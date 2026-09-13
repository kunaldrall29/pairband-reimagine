// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {AmmMath} from "./AmmMath.sol";
import {PairbandPair} from "./PairbandPair.sol";
import {PairbandToken} from "./PairbandToken.sol";

interface IERC20B {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

/// @title PairbandBook
/// @notice Fully on-chain CLOB. Price-time priority via a doubly linked list.
///         Market leftover hits the locked Uniswap-style pair. No proxy.
contract PairbandBook {
    error Locked();
    error ZeroAmount();
    error NotOwner();
    error OrderNotFound();
    error Slippage();
    error TransferFailed();
    error NotLaunchpad();

    uint256 private unlocked = 1;
    modifier lock() {
        if (unlocked != 1) revert Locked();
        unlocked = 0;
        _;
        unlocked = 1;
    }

    uint256 public constant WAD = 1e18;

    IERC20B public immutable usdc;
    PairbandToken public immutable token;
    PairbandPair public immutable pair;
    address public immutable launchpad;

    struct Order {
        address owner;
        bool isBid;
        uint128 price;
        uint128 remaining; // tokens
        uint128 escrow; // USDC for bids, tokens for asks
    }

    Order[] public orders; // 1-indexed
    mapping(uint32 => uint32) public nxt;
    mapping(uint32 => uint32) public prv;
    uint32 public bidHead;
    uint32 public askHead;

    event Limit(uint32 indexed id, address indexed owner, bool isBid, uint128 price, uint128 remaining);
    event Fill(uint32 indexed id, address indexed taker, address indexed maker, uint128 tokens, uint128 usdc);
    event Cancel(uint32 indexed id, address indexed owner);
    event Market(address indexed taker, bool usdcIn, uint256 amountIn, uint256 filled, uint256 amm);

    constructor(address usdc_, address token_, address pair_, address launchpad_) {
        usdc = IERC20B(usdc_);
        token = PairbandToken(token_);
        pair = PairbandPair(pair_);
        launchpad = launchpad_;
        orders.push(); // index 0 empty
    }

    modifier onlyPad() {
        if (msg.sender != launchpad) revert NotLaunchpad();
        _;
    }

    function bestBid() external view returns (uint128) {
        return bidHead == 0 ? 0 : orders[bidHead].price;
    }

    function bestAsk() external view returns (uint128) {
        return askHead == 0 ? 0 : orders[askHead].price;
    }

    function marketBuyFor(address to, uint256 usdcIn, uint256 minOut) external onlyPad lock returns (uint256 out) {
        out = _marketBuy(to, usdcIn, minOut);
    }

    function marketSellFor(address from, address to, uint256 tokensIn, uint256 minOut)
        external
        onlyPad
        lock
        returns (uint256 out)
    {
        out = _marketSell(from, to, tokensIn, minOut);
    }

    function limitBid(uint128 price, uint256 usdcIn) external lock returns (uint32 id) {
        if (price == 0 || usdcIn == 0) revert ZeroAmount();
        _pullUsdc(msg.sender, usdcIn);
        (uint256 filledUsdc, uint256 tokensOut) = _matchAsks(msg.sender, usdcIn, price);
        uint256 rest = usdcIn - filledUsdc;
        uint256 restTok = (rest * WAD) / price;
        uint256 escrow = (restTok * price) / WAD;
        if (rest > escrow) _pushUsdc(msg.sender, rest - escrow);
        if (restTok > 0 && escrow > 0) {
            id = _newOrder(msg.sender, true, price, uint128(restTok), uint128(escrow));
            _insertBid(id, price);
            emit Limit(id, msg.sender, true, price, uint128(restTok));
        }
        tokensOut;
    }

    function limitAsk(uint128 price, uint256 tokensIn) external lock returns (uint32 id) {
        if (price == 0 || tokensIn == 0) revert ZeroAmount();
        if (!token.transferFrom(msg.sender, address(this), tokensIn)) revert TransferFailed();
        (uint256 filledTok,) = _matchBids(msg.sender, tokensIn, price);
        uint256 rest = tokensIn - filledTok;
        if (rest > 0) {
            id = _newOrder(msg.sender, false, price, uint128(rest), uint128(rest));
            _insertAsk(id, price);
            emit Limit(id, msg.sender, false, price, uint128(rest));
        }
    }

    function cancel(uint32 id) external lock {
        Order storage o = orders[id];
        if (o.owner == address(0)) revert OrderNotFound();
        if (o.owner != msg.sender) revert NotOwner();
        _unlink(id, o.isBid);
        if (o.isBid) _pushUsdc(msg.sender, o.escrow);
        else if (!token.transfer(msg.sender, o.remaining)) revert TransferFailed();
        delete orders[id];
        emit Cancel(id, msg.sender);
    }

    function _marketBuy(address to, uint256 usdcIn, uint256 minOut) internal returns (uint256 out) {
        (uint256 filledUsdc, uint256 tokensOut) = _matchAsks(to, usdcIn, type(uint128).max);
        uint256 leftover = usdcIn - filledUsdc;
        uint256 ammOut;
        if (leftover > 0) {
            ammOut = _ammUsdcForToken(to, leftover);
        }
        out = tokensOut + ammOut;
        if (out < minOut) revert Slippage();
        emit Market(to, true, usdcIn, tokensOut, ammOut);
    }

    function _marketSell(address from, address to, uint256 tokensIn, uint256 minOut) internal returns (uint256 out) {
        (uint256 filledTok, uint256 usdcOut) = _matchBids(to, tokensIn, 0);
        uint256 leftover = tokensIn - filledTok;
        uint256 ammOut;
        if (leftover > 0) {
            ammOut = _ammTokenForUsdc(from, to, leftover);
        }
        out = usdcOut + ammOut;
        if (out < minOut) revert Slippage();
        emit Market(to, false, tokensIn, filledTok, leftover);
    }

    function _matchAsks(address taker, uint256 usdcIn, uint256 maxPrice)
        internal
        returns (uint256 filledUsdc, uint256 tokensOut)
    {
        uint32 cur = askHead;
        uint256 left = usdcIn;
        while (cur != 0 && left > 0) {
            Order storage o = orders[cur];
            uint32 follow = nxt[cur];
            if (o.price > maxPrice) break;
            uint256 maxTok = (left * WAD) / o.price;
            uint256 fillTok = maxTok < o.remaining ? maxTok : o.remaining;
            uint256 fillUsdc = (fillTok * o.price) / WAD;
            if (fillTok == 0 || fillUsdc == 0) break;
            o.remaining -= uint128(fillTok);
            o.escrow -= uint128(fillTok);
            left -= fillUsdc;
            filledUsdc += fillUsdc;
            tokensOut += fillTok;
            _pushUsdc(o.owner, fillUsdc);
            if (!token.transfer(taker, fillTok)) revert TransferFailed();
            emit Fill(cur, taker, o.owner, uint128(fillTok), uint128(fillUsdc));
            if (o.remaining == 0) {
                _unlink(cur, false);
                delete orders[cur];
            }
            cur = follow;
        }
    }

    function _matchBids(address taker, uint256 tokensIn, uint256 minPrice)
        internal
        returns (uint256 filledTok, uint256 usdcOut)
    {
        uint32 cur = bidHead;
        uint256 left = tokensIn;
        while (cur != 0 && left > 0) {
            Order storage o = orders[cur];
            uint32 follow = nxt[cur];
            if (minPrice != 0 && o.price < minPrice) break;
            uint256 fillTok = left < o.remaining ? left : o.remaining;
            uint256 fillUsdc = (fillTok * o.price) / WAD;
            if (fillTok == 0 || fillUsdc == 0) break;
            o.remaining -= uint128(fillTok);
            o.escrow -= uint128(fillUsdc);
            left -= fillTok;
            filledTok += fillTok;
            usdcOut += fillUsdc;
            if (!token.transferFrom(taker, o.owner, fillTok)) {
                // tokens already pulled to book on limitAsk path; for market from launchpad, book holds them?
                // Market sell: launchpad transferred tokens to book first. Send to maker from this.
                if (!token.transfer(o.owner, fillTok)) revert TransferFailed();
            }
            _pushUsdc(taker, fillUsdc);
            emit Fill(cur, taker, o.owner, uint128(fillTok), uint128(fillUsdc));
            if (o.remaining == 0) {
                _unlink(cur, true);
                delete orders[cur];
            }
            cur = follow;
        }
    }

    function _ammUsdcForToken(address to, uint256 usdcIn) internal returns (uint256 out) {
        (uint112 r0, uint112 r1) = pair.getReserves();
        bool usdcIs0 = pair.token0() == address(usdc);
        uint256 reserveUsdc = usdcIs0 ? r0 : r1;
        uint256 reserveToken = usdcIs0 ? r1 : r0;
        out = AmmMath.getAmountOut(usdcIn, reserveUsdc, reserveToken);
        _pushUsdc(address(pair), usdcIn);
        if (usdcIs0) pair.swap(0, out, to);
        else pair.swap(out, 0, to);
    }

    function _ammTokenForUsdc(address /*from*/, address to, uint256 tokensIn) internal returns (uint256 out) {
        (uint112 r0, uint112 r1) = pair.getReserves();
        bool usdcIs0 = pair.token0() == address(usdc);
        uint256 reserveUsdc = usdcIs0 ? r0 : r1;
        uint256 reserveToken = usdcIs0 ? r1 : r0;
        out = AmmMath.getAmountOut(tokensIn, reserveToken, reserveUsdc);
        if (!token.transfer(address(pair), tokensIn)) revert TransferFailed();
        if (usdcIs0) pair.swap(out, 0, to);
        else pair.swap(0, out, to);
    }

    function _newOrder(address owner, bool isBid, uint128 price, uint128 remaining, uint128 escrow)
        internal
        returns (uint32 id)
    {
        id = uint32(orders.length);
        orders.push(Order({owner: owner, isBid: isBid, price: price, remaining: remaining, escrow: escrow}));
    }

    function _insertBid(uint32 id, uint128 price) internal {
        uint32 cur = bidHead;
        uint32 last = 0;
        while (cur != 0 && orders[cur].price >= price) {
            last = cur;
            cur = nxt[cur];
        }
        _link(id, last, cur, true);
    }

    function _insertAsk(uint32 id, uint128 price) internal {
        uint32 cur = askHead;
        uint32 last = 0;
        while (cur != 0 && orders[cur].price <= price) {
            last = cur;
            cur = nxt[cur];
        }
        _link(id, last, cur, false);
    }

    function _link(uint32 id, uint32 last, uint32 cur, bool isBid) internal {
        nxt[id] = cur;
        prv[id] = last;
        if (last == 0) {
            if (isBid) bidHead = id;
            else askHead = id;
        } else {
            nxt[last] = id;
        }
        if (cur != 0) prv[cur] = id;
    }

    function _unlink(uint32 id, bool isBid) internal {
        uint32 p = prv[id];
        uint32 n = nxt[id];
        if (p == 0) {
            if (isBid) bidHead = n;
            else askHead = n;
        } else {
            nxt[p] = n;
        }
        if (n != 0) prv[n] = p;
        delete nxt[id];
        delete prv[id];
    }

    function _pullUsdc(address from, uint256 amount) internal {
        if (!usdc.transferFrom(from, address(this), amount)) revert TransferFailed();
    }

    function _pushUsdc(address to, uint256 amount) internal {
        if (!usdc.transfer(to, amount)) revert TransferFailed();
    }
}
