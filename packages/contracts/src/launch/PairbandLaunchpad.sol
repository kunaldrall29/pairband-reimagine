// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {AmmMath} from "./AmmMath.sol";
import {CurveMath} from "./CurveMath.sol";
import {PairbandAmmFactory} from "./PairbandAmmFactory.sol";
import {PairbandBook} from "./PairbandBook.sol";
import {PairbandPair} from "./PairbandPair.sol";
import {PairbandToken} from "./PairbandToken.sol";

interface IERC20Usdc {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
}

/// @title PairbandLaunchpad
/// @notice USDC-quoted bonding curve. At graduateAt, remaining inventory + USDC mint a
///         Uniswap-style pair and burn LP to 0xdead. Same bytecode on Arc testnet and mainnet.
/// @dev    No proxy. No delegatecall. CEI. Reentrancy lock. Fees capped in code.
contract PairbandLaunchpad {
    using CurveMath for uint256;

    error Locked();
    error ZeroAmount();
    error Slippage();
    error BelowMinLp();
    error InsufficientRealUsdc();
    error AlreadyGraduated();
    error InvalidMeta();
    error TransferFailed();

    uint256 private unlocked = 1;
    modifier nonReentrant() {
        if (unlocked != 1) revert Locked();
        unlocked = 0;
        _;
        unlocked = 1;
    }

    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 ether;
    uint256 public constant MIN_LP_TOKENS = 200_000_000 ether;
    uint256 public constant MAX_FEE_BPS = 200;
    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;

    IERC20Usdc public immutable usdc;
    address public immutable treasury;
    PairbandAmmFactory public immutable ammFactory;
    uint256 public immutable graduateAt;
    uint256 public immutable virtualUsdcStart;
    uint256 public immutable virtualTokensStart;

    struct Launch {
        address token;
        address pair;
        address book;
        address creator;
        bool graduated;
        uint256 virtualUsdc;
        uint256 virtualTokens;
        uint256 realUsdc;
        uint256 tokensSold;
        uint256 protocolFees;
        uint256 creatorFees;
    }

    Launch[] public launches;

    event Created(uint256 indexed id, address indexed token, address indexed creator, string name, string symbol);
    event Buy(uint256 indexed id, address indexed account, uint256 usdcIn, uint256 tokensOut, bool graduated);
    event Sell(uint256 indexed id, address indexed account, uint256 tokensIn, uint256 usdcOut);
    event Graduated(
        uint256 indexed id, address indexed pair, address book, uint256 usdcSeeded, uint256 tokensSeeded, uint256 lpBurned
    );
    event Swap(uint256 indexed id, address indexed account, bool usdcIn, uint256 amountIn, uint256 amountOut);

    constructor(address usdc_, address treasury_, uint256 graduateAt_, uint256 virtualUsdc_, uint256 virtualTokens_) {
        require(usdc_ != address(0) && treasury_ != address(0), "zero");
        require(graduateAt_ > 0 && virtualUsdc_ > 0 && virtualTokens_ > 0, "params");
        require(CurveMath.PROTOCOL_FEE_BPS + CurveMath.CREATOR_FEE_BPS <= MAX_FEE_BPS, "fee cap");
        usdc = IERC20Usdc(usdc_);
        treasury = treasury_;
        graduateAt = graduateAt_;
        virtualUsdcStart = virtualUsdc_;
        virtualTokensStart = virtualTokens_;
        ammFactory = new PairbandAmmFactory();
    }

    function launchCount() external view returns (uint256) {
        return launches.length;
    }

    function getLaunch(uint256 id) external view returns (Launch memory) {
        return launches[id];
    }

    function create(string calldata name_, string calldata symbol_)
        external
        nonReentrant
        returns (uint256 id, address token)
    {
        bytes memory s = bytes(symbol_);
        bytes memory n = bytes(name_);
        if (n.length < 2 || n.length > 32 || s.length < 2 || s.length > 12) revert InvalidMeta();
        for (uint256 i; i < s.length; i++) {
            bytes1 c = s[i];
            bool ok = (c >= 0x41 && c <= 0x5A) || (c >= 0x30 && c <= 0x39);
            if (!ok) revert InvalidMeta();
        }
        id = launches.length;
        PairbandToken t = new PairbandToken(name_, symbol_, address(this));
        token = address(t);
        launches.push(
            Launch({
                token: token,
                pair: address(0),
                book: address(0),
                creator: msg.sender,
                graduated: false,
                virtualUsdc: virtualUsdcStart,
                virtualTokens: virtualTokensStart,
                realUsdc: 0,
                tokensSold: 0,
                protocolFees: 0,
                creatorFees: 0
            })
        );
        emit Created(id, token, msg.sender, name_, symbol_);
    }

    function buy(uint256 id, uint256 usdcIn, uint256 minTokensOut) external nonReentrant returns (uint256 tokensOut) {
        if (usdcIn == 0) revert ZeroAmount();
        Launch storage l = launches[id];
        _pullUsdc(msg.sender, usdcIn);

        if (l.graduated) {
            _pushUsdc(l.book, usdcIn);
            tokensOut = PairbandBook(l.book).marketBuyFor(msg.sender, usdcIn, minTokensOut);
            emit Swap(id, msg.sender, true, usdcIn, tokensOut);
            return tokensOut;
        }

        (uint256 protocol, uint256 creator, uint256 net) = CurveMath.splitFees(usdcIn);
        tokensOut = CurveMath.getTokensOut(l.virtualUsdc, l.virtualTokens, net);
        if (l.virtualTokens - tokensOut < MIN_LP_TOKENS) revert BelowMinLp();
        if (tokensOut < minTokensOut) revert Slippage();

        l.virtualUsdc += net;
        l.virtualTokens -= tokensOut;
        l.realUsdc += net;
        l.tokensSold += tokensOut;
        l.protocolFees += protocol;
        l.creatorFees += creator;

        if (protocol > 0) _pushUsdc(treasury, protocol);
        if (creator > 0) _pushUsdc(l.creator, creator);
        PairbandToken(l.token).mint(msg.sender, tokensOut);

        bool did = false;
        if (l.realUsdc >= graduateAt) {
            _graduate(id, l);
            did = true;
        }
        emit Buy(id, msg.sender, usdcIn, tokensOut, did);
    }

    function sell(uint256 id, uint256 tokensIn, uint256 minUsdcOut) external nonReentrant returns (uint256 usdcOut) {
        if (tokensIn == 0) revert ZeroAmount();
        Launch storage l = launches[id];

        if (l.graduated) {
            if (!PairbandToken(l.token).transferFrom(msg.sender, l.book, tokensIn)) revert TransferFailed();
            usdcOut = PairbandBook(l.book).marketSellFor(msg.sender, msg.sender, tokensIn, minUsdcOut);
            emit Swap(id, msg.sender, false, tokensIn, usdcOut);
            return usdcOut;
        }

        uint256 gross = CurveMath.getUsdcOut(l.virtualUsdc, l.virtualTokens, tokensIn);
        if (gross > l.realUsdc) revert InsufficientRealUsdc();
        (uint256 protocol, uint256 creator, uint256 net) = CurveMath.splitFees(gross);
        if (net < minUsdcOut) revert Slippage();

        PairbandToken(l.token).transferFrom(msg.sender, address(this), tokensIn);
        // Burn returned inventory so buy→sell→buy cannot inflate totalSupply past TOTAL_SUPPLY.
        PairbandToken(l.token).burn(address(this), tokensIn);

        l.virtualTokens += tokensIn;
        l.virtualUsdc -= gross;
        l.realUsdc -= gross;
        if (l.tokensSold >= tokensIn) l.tokensSold -= tokensIn;
        else l.tokensSold = 0;
        l.protocolFees += protocol;
        l.creatorFees += creator;

        if (protocol > 0) _pushUsdc(treasury, protocol);
        if (creator > 0) _pushUsdc(l.creator, creator);
        _pushUsdc(msg.sender, net);
        emit Sell(id, msg.sender, tokensIn, net);
        return net;
    }

    function _graduate(uint256 id, Launch storage l) internal {
        if (l.graduated) revert AlreadyGraduated();
        uint256 usdcSeed = l.realUsdc;
        uint256 tokenSeed = l.virtualTokens;
        address pair = ammFactory.createPair(l.token, address(usdc));
        uint256 held = PairbandToken(l.token).balanceOf(address(this));
        if (held < tokenSeed) {
            PairbandToken(l.token).mint(address(this), tokenSeed - held);
        }
        bool sent = PairbandToken(l.token).transfer(pair, tokenSeed);
        if (!sent) revert TransferFailed();
        _pushUsdc(pair, usdcSeed);
        uint256 lp = PairbandPair(pair).mint(DEAD);
        PairbandBook b = new PairbandBook(address(usdc), l.token, pair, address(this));
        l.pair = pair;
        l.book = address(b);
        l.graduated = true;
        l.realUsdc = 0;
        emit Graduated(id, pair, address(b), usdcSeed, tokenSeed, lp);
    }

    function _swapUsdcForToken(Launch storage l, uint256 usdcIn, uint256 minOut, address to)
        internal
        returns (uint256 out)
    {
        PairbandPair pair = PairbandPair(l.pair);
        (uint112 r0, uint112 r1) = pair.getReserves();
        address t0 = pair.token0();
        bool usdcIs0 = t0 == address(usdc);
        uint256 reserveUsdc = usdcIs0 ? r0 : r1;
        uint256 reserveToken = usdcIs0 ? r1 : r0;
        out = AmmMath.getAmountOut(usdcIn, reserveUsdc, reserveToken);
        if (out < minOut) revert Slippage();
        _pushUsdc(address(pair), usdcIn);
        if (usdcIs0) pair.swap(0, out, to);
        else pair.swap(out, 0, to);
    }

    function _swapTokenForUsdc(Launch storage l, uint256 tokensIn, uint256 minOut, address to)
        internal
        returns (uint256 out)
    {
        PairbandPair pair = PairbandPair(l.pair);
        (uint112 r0, uint112 r1) = pair.getReserves();
        address t0 = pair.token0();
        bool usdcIs0 = t0 == address(usdc);
        uint256 reserveUsdc = usdcIs0 ? r0 : r1;
        uint256 reserveToken = usdcIs0 ? r1 : r0;
        out = AmmMath.getAmountOut(tokensIn, reserveToken, reserveUsdc);
        if (out < minOut) revert Slippage();
        PairbandToken(l.token).transferFrom(msg.sender, address(pair), tokensIn);
        if (usdcIs0) pair.swap(out, 0, to);
        else pair.swap(0, out, to);
    }

    function _pullUsdc(address from, uint256 amount) internal {
        bool ok = usdc.transferFrom(from, address(this), amount);
        if (!ok) revert TransferFailed();
    }

    function _pushUsdc(address to, uint256 amount) internal {
        bool ok = usdc.transfer(to, amount);
        if (!ok) revert TransferFailed();
    }
}
