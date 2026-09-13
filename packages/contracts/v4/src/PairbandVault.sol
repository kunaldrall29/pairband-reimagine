// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {BandMath} from "./libraries/BandMath.sol";
import {ShareMath} from "./libraries/ShareMath.sol";
import {TickMath} from "./libraries/TickMath.sol";
import {LiquidityAmounts} from "./libraries/LiquidityAmounts.sol";
import {
    IPoolManager,
    IUnlockCallback,
    IPositionManager,
    IERC20Minimal,
    PoolKey,
    PoolId,
    PoolIdLibrary,
    Currency,
    CurrencyLibrary,
    ModifyLiquidityParams,
    BalanceDelta,
    BalanceDeltaLibrary
} from "./types/PoolTypes.sol";
import {PairbandHook} from "./PairbandHook.sol";

/// @title PairbandVault
/// @notice ERC-20 range vault: LPs deposit both tokens, receive shares, and the vault
///         owns exactly one Uniswap v4 position inside a published tick band.
///         An agent may PROPOSE a new band; only the named CURATOR can EXECUTE.
/// @dev No custom curve, no beforeSwapReturnDelta, no idle-vs-active LDF, no lending.
///      Protocol fee is taken from collected swap fees only (never from principal).
contract PairbandVault is IUnlockCallback {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;
    using BalanceDeltaLibrary for BalanceDelta;

    // ── Errors (decoded by the app) ──────────────────────────────────────────
    error NotCurator();
    error NotAgent();
    error NotVault();
    error TooWide();
    error ShiftCapped();
    error DelayPending();
    error CooldownPending();
    error NoProposal();
    error Locked();
    error ZeroAmount();
    error InvalidTicks();
    error FeeCap();
    error NotPoolManager();
    error Reentrancy();
    error InsufficientAgentFee();

    // ── Types ────────────────────────────────────────────────────────────────
    struct Band {
        int24 tickLower;
        int24 tickUpper;
        uint256 positionId;
        uint48 lastRebalanceAt;
    }

    struct Policy {
        address curator;
        address agent; // address(0) = anyone may propose
        uint24 maxWidth; // ticks
        uint24 maxShift; // max L1 |Δlower|+|Δupper| per execute
        uint32 minCooldown; // seconds between executes
        uint16 protocolFeeBps; // of collected fees, cap 200
        uint16 performanceFeeBps; // of remaining fees, paid in shares
        uint32 proposalDelay; // seconds before execute allowed
    }

    struct Proposal {
        int24 tickLower;
        int24 tickUpper;
        uint128 amount0Min;
        uint128 amount1Min;
        address proposer;
        uint48 postedAt;
        bool active;
    }

    // ── ERC-20 ───────────────────────────────────────────────────────────────
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    // ── Constants ────────────────────────────────────────────────────────────
    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;
    /// @dev Minimum first-deposit liquidity. Combined with 1e3 dead shares, a
    ///      tiny attacker deposit cannot inflate share price and steal later LPs.
    uint128 public constant MIN_BOOTSTRAP = 1e6;
    uint256 public constant MIN_DEAD_SHARES = 1e3;
    uint16 public constant PROTOCOL_FEE_CAP_BPS = 200;
    /// @notice Flat agent proposal fee in USDC (6 decimals) — $0.25. Charged only when the named agent proposes.
    uint256 public constant AGENT_FEE = 250_000;
    bytes32 public constant POSITION_SALT = bytes32(uint256(1));

    // ── Immutables / config ──────────────────────────────────────────────────
    IPoolManager public immutable poolManager;
    IPositionManager public immutable positionManager;
    PairbandHook public immutable hook;
    PoolKey public poolKey;
    address public protocolFeeRecipient;
    Policy public policy;
    Band public band;
    Proposal public proposal;
    /// @notice Withdraws revert while `block.number <= rebalanceUnlockBlock`.
    uint256 public rebalanceUnlockBlock;

    uint256 private _locked = 1;
    uint128 public totalLiquidity;

    enum Action {
        Deposit,
        Withdraw,
        Rebalance
    }

    // ── Events ───────────────────────────────────────────────────────────────
    event Deposit(address indexed from, address indexed to, uint256 amount0, uint256 amount1, uint256 shares, uint128 liquidity);
    event Withdraw(address indexed from, address indexed to, uint256 shares, uint256 amount0, uint256 amount1);
    event Proposed(address indexed proposer, int24 tickLower, int24 tickUpper, uint128 amount0Min, uint128 amount1Min);
    event AgentFeePaid(address indexed agent, uint256 amount, address indexed recipient);
    event ProposalRejected(address indexed curator);
    event Rebalanced(
        address indexed curator,
        int24 tickLower,
        int24 tickUpper,
        uint256 protocolFee0,
        uint256 protocolFee1,
        uint256 curatorShares
    );
    event CuratorTransferred(address indexed oldCurator, address indexed newCurator);

    modifier nonReentrant() {
        if (_locked != 1) revert Reentrancy();
        _locked = 2;
        _;
        _locked = 1;
    }

    modifier onlyCurator() {
        if (msg.sender != policy.curator) revert NotCurator();
        _;
    }

    constructor(
        PoolKey memory key,
        Policy memory _policy,
        IPoolManager _poolManager,
        IPositionManager _positionManager,
        PairbandHook _hook,
        address _protocolFeeRecipient,
        int24 tickLower,
        int24 tickUpper,
        string memory _name,
        string memory _symbol
    ) {
        if (_policy.protocolFeeBps > PROTOCOL_FEE_CAP_BPS) revert FeeCap();
        if (_policy.curator == address(0)) revert NotCurator();
        BandMath.validateBand(tickLower, tickUpper, key.tickSpacing, _policy.maxWidth);

        poolKey = key;
        policy = _policy;
        poolManager = _poolManager;
        positionManager = _positionManager;
        hook = _hook;
        protocolFeeRecipient = _protocolFeeRecipient;
        band = Band({tickLower: tickLower, tickUpper: tickUpper, positionId: 1, lastRebalanceAt: 0});
        name = _name;
        symbol = _symbol;
    }

    // ── Views ────────────────────────────────────────────────────────────────

    /// @notice Preview shares minted for a two-sided deposit at current slot0.
    function previewDeposit(uint256 amount0, uint256 amount1) external view returns (uint256 shares, uint128 liquidity) {
        (uint160 sqrtPriceX96, int24 tick) = _slot0();
        tick; // silence
        liquidity = LiquidityAmounts.getLiquidityForAmounts(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(band.tickLower),
            TickMath.getSqrtPriceAtTick(band.tickUpper),
            amount0,
            amount1
        );
        if (totalSupply == 0) {
            shares = liquidity;
        } else {
            shares = ShareMath.sharesForLiquidity(liquidity, totalSupply, totalLiquidity);
        }
    }

    /// @notice Preview token amounts returned for burning `shares`.
    function previewWithdraw(uint256 shares) external view returns (uint256 amount0, uint256 amount1) {
        if (shares == 0 || totalSupply == 0) return (0, 0);
        (uint160 sqrtPriceX96,) = _slot0();
        uint128 liqOut = uint128(ShareMath.liquidityForShares(shares, totalSupply, totalLiquidity));
        (amount0, amount1) = LiquidityAmounts.getAmountsForLiquidity(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(band.tickLower),
            TickMath.getSqrtPriceAtTick(band.tickUpper),
            liqOut
        );
        // idle residuals (fees left in vault) paid pro-rata
        uint256 idle0 = _idle(poolKey.currency0) ;
        uint256 idle1 = _idle(poolKey.currency1);
        amount0 += ShareMath.mulDivFloor(idle0, shares, totalSupply);
        amount1 += ShareMath.mulDivFloor(idle1, shares, totalSupply);
    }

    function poolId() external view returns (PoolId) {
        return poolKey.toId();
    }

    // ── Deposit / withdraw ───────────────────────────────────────────────────

    /// @notice Pull both tokens, add liquidity to the live band, mint shares.
    /// @dev Both sides required in v1; no single-sided zap. Reverts during the 3-block rebalance lock.
    function deposit(uint256 amount0, uint256 amount1, address recipient)
        external
        nonReentrant
        returns (uint256 shares)
    {
        if (amount0 == 0 || amount1 == 0) revert ZeroAmount();
        if (block.number <= rebalanceUnlockBlock) revert Locked();
        if (recipient == address(0)) revert ZeroAmount();

        _pull(poolKey.currency0, msg.sender, amount0);
        _pull(poolKey.currency1, msg.sender, amount1);

        (uint160 sqrtPriceX96,) = _slot0();
        uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(band.tickLower),
            TickMath.getSqrtPriceAtTick(band.tickUpper),
            amount0,
            amount1
        );
        if (liquidity == 0) revert ZeroAmount();

        if (totalSupply == 0) {
            if (liquidity < MIN_BOOTSTRAP) revert ZeroAmount();
            _mint(DEAD, MIN_DEAD_SHARES);
            shares = uint256(liquidity);
        } else {
            shares = ShareMath.sharesForLiquidity(liquidity, totalSupply, totalLiquidity);
            if (shares == 0) revert ZeroAmount();
        }

        _mint(recipient, shares);
        totalLiquidity += liquidity;

        poolManager.unlock(abi.encode(Action.Deposit, abi.encode(int256(uint256(liquidity)), amount0, amount1)));
        emit Deposit(msg.sender, recipient, amount0, amount1, shares, liquidity);
    }

    /// @notice Burn shares and take a pro-rata slice of the position + idle tokens.
    function withdraw(uint256 shares, address recipient) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        if (shares == 0) revert ZeroAmount();
        if (block.number <= rebalanceUnlockBlock) revert Locked();
        if (recipient == address(0)) revert ZeroAmount();
        if (balanceOf[msg.sender] < shares) revert ZeroAmount();

        uint128 liqOut = uint128(ShareMath.liquidityForShares(shares, totalSupply, totalLiquidity));
        if (liqOut == 0) revert ZeroAmount();

        (uint160 sqrtPriceX96,) = _slot0();
        (uint256 owed0, uint256 owed1) = LiquidityAmounts.getAmountsForLiquidity(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(band.tickLower),
            TickMath.getSqrtPriceAtTick(band.tickUpper),
            liqOut
        );

        uint256 idle0 = _idle(poolKey.currency0);
        uint256 idle1 = _idle(poolKey.currency1);
        uint256 extra0 = ShareMath.mulDivFloor(idle0, shares, totalSupply);
        uint256 extra1 = ShareMath.mulDivFloor(idle1, shares, totalSupply);

        _burn(msg.sender, shares);
        totalLiquidity -= liqOut;

        poolManager.unlock(abi.encode(Action.Withdraw, abi.encode(-int256(uint256(liqOut)), owed0, owed1)));

        amount0 = owed0 + extra0;
        amount1 = owed1 + extra1;
        poolKey.currency0.transfer(recipient, amount0);
        poolKey.currency1.transfer(recipient, amount1);
        emit Withdraw(msg.sender, recipient, shares, amount0, amount1);
    }

    // ── Proposals ────────────────────────────────────────────────────────────

    /// @notice Post a new band. `policy.agent == 0` → anyone; else agent or curator.
    /// @dev Agent proposals pay AGENT_FEE USDC (currency0) to protocolFeeRecipient. Curator proposals are free.
    function proposeRebalance(int24 tickLower, int24 tickUpper, uint128 amount0Min, uint128 amount1Min) external {
        Policy memory p = policy;
        if (p.agent != address(0) && msg.sender != p.agent && msg.sender != p.curator) revert NotAgent();

        if (p.agent != address(0) && msg.sender == p.agent) {
            _pull(poolKey.currency0, msg.sender, AGENT_FEE);
            poolKey.currency0.transfer(protocolFeeRecipient, AGENT_FEE);
            emit AgentFeePaid(msg.sender, AGENT_FEE, protocolFeeRecipient);
        }

        int24 spacing = poolKey.tickSpacing;
        tickLower = BandMath.align(tickLower, spacing);
        tickUpper = BandMath.align(tickUpper, spacing);
        try BandMath.validateBand(tickLower, tickUpper, spacing, p.maxWidth) {}
        catch {
            // distinguish TooWide vs InvalidTicks
            if (tickLower >= tickUpper) revert InvalidTicks();
            if (uint24(tickUpper - tickLower) > p.maxWidth) revert TooWide();
            revert InvalidTicks();
        }
        proposal = Proposal({
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            proposer: msg.sender,
            postedAt: uint48(block.timestamp),
            active: true
        });
        emit Proposed(msg.sender, tickLower, tickUpper, amount0Min, amount1Min);
    }

    /// @notice Curator-only. Burns the active proposal without moving the band.
    function rejectProposal() external onlyCurator {
        if (!proposal.active) revert NoProposal();
        proposal.active = false;
        emit ProposalRejected(msg.sender);
    }

    /// @notice Curator-only. Collect fees, cut protocol + performance, move the band.
    /// @dev Shift metric = |Δlower| + |Δupper| (see BandMath). Sets a 3-block withdraw lock.
    function executeRebalance() external onlyCurator nonReentrant {
        Proposal memory prop = proposal;
        Policy memory p = policy;
        if (!prop.active) revert NoProposal();
        if (block.timestamp < uint256(prop.postedAt) + p.proposalDelay) revert DelayPending();
        if (band.lastRebalanceAt != 0 && block.timestamp < uint256(band.lastRebalanceAt) + p.minCooldown) {
            revert CooldownPending();
        }
        uint256 s = BandMath.shift(band.tickLower, band.tickUpper, prop.tickLower, prop.tickUpper);
        if (s > p.maxShift) revert ShiftCapped();

        poolManager.unlock(abi.encode(Action.Rebalance, abi.encode(prop)));
    }

    /// @notice Curator-only. Instant on testnet. TODO mainnet: 7-day delay.
    function transferCurator(address newCurator) external onlyCurator {
        if (newCurator == address(0)) revert NotCurator();
        address old = policy.curator;
        policy.curator = newCurator;
        emit CuratorTransferred(old, newCurator);
    }

    // ── Unlock callback ──────────────────────────────────────────────────────

    /// @dev PoolManager calls back here. CEI: shares already minted/burned in the outer fn.
    function unlockCallback(bytes calldata data) external returns (bytes memory) {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        (Action action, bytes memory payload) = abi.decode(data, (Action, bytes));
        if (action == Action.Deposit) {
            (int256 liqDelta,,) = abi.decode(payload, (int256, uint256, uint256));
            _modify(liqDelta);
        } else if (action == Action.Withdraw) {
            (int256 liqDelta,,) = abi.decode(payload, (int256, uint256, uint256));
            _modify(liqDelta);
        } else if (action == Action.Rebalance) {
            Proposal memory prop = abi.decode(payload, (Proposal));
            _rebalanceInsideUnlock(prop);
        }
        return bytes("");
    }

    function _modify(int256 liquidityDelta) internal {
        ModifyLiquidityParams memory params = ModifyLiquidityParams({
            tickLower: band.tickLower,
            tickUpper: band.tickUpper,
            liquidityDelta: liquidityDelta,
            salt: POSITION_SALT
        });
        (BalanceDelta delta, BalanceDelta fees) =
            poolManager.modifyLiquidity(poolKey, params, bytes(""));
        fees; // collected into delta when decreasing; deposit has none
        _settleDelta(delta);
    }

    function _rebalanceInsideUnlock(Proposal memory prop) internal {
        Policy memory p = policy;
        // 1) Collect fees (0-delta modifyLiquidity returns feesAccrued in v4)
        ModifyLiquidityParams memory collectParams = ModifyLiquidityParams({
            tickLower: band.tickLower,
            tickUpper: band.tickUpper,
            liquidityDelta: 0,
            salt: POSITION_SALT
        });
        (, BalanceDelta feesAccrued) = poolManager.modifyLiquidity(poolKey, collectParams, bytes(""));
        _settleDelta(feesAccrued);

        uint256 fee0 = uint256(int256(feesAccrued.amount0() > 0 ? feesAccrued.amount0() : int128(0)));
        uint256 fee1 = uint256(int256(feesAccrued.amount1() > 0 ? feesAccrued.amount1() : int128(0)));

        // 2) Protocol cut in tokens; curator performance in shares of remaining.
        uint256 proto0 = fee0 * p.protocolFeeBps / 10_000;
        uint256 proto1 = fee1 * p.protocolFeeBps / 10_000;
        if (proto0 > 0) poolKey.currency0.transfer(protocolFeeRecipient, proto0);
        if (proto1 > 0) poolKey.currency1.transfer(protocolFeeRecipient, proto1);

        uint256 remain0 = fee0 - proto0;
        uint256 remain1 = fee1 - proto1;
        uint256 curatorShares;
        if (p.performanceFeeBps > 0 && totalSupply > 0 && (remain0 > 0 || remain1 > 0)) {
            // Stables: decimal-normalize and treat 1:1. Do NOT use spot on volatile pairs in phase 0.
            uint256 v0 = _norm(poolKey.currency0, remain0 * p.performanceFeeBps / 10_000);
            uint256 v1 = _norm(poolKey.currency1, remain1 * p.performanceFeeBps / 10_000);
            uint256 curatorValue = v0 + v1;
            uint256 totalValue = _norm(poolKey.currency0, _idle(poolKey.currency0) + _positionAmount(0))
                + _norm(poolKey.currency1, _idle(poolKey.currency1) + _positionAmount(1));
            if (curatorValue > 0 && totalValue > curatorValue) {
                curatorShares = ShareMath.mulDivFloor(curatorValue, totalSupply, totalValue - curatorValue);
                if (curatorShares > 0) _mint(p.curator, curatorShares);
            }
        }

        // 3) Decrease live position to zero.
        if (totalLiquidity > 0) {
            ModifyLiquidityParams memory burnParams = ModifyLiquidityParams({
                tickLower: band.tickLower,
                tickUpper: band.tickUpper,
                liquidityDelta: -int256(uint256(totalLiquidity)),
                salt: POSITION_SALT
            });
            (BalanceDelta burnDelta,) = poolManager.modifyLiquidity(poolKey, burnParams, bytes(""));
            _settleDelta(burnDelta);
        }

        // 4) Mint at the new ticks with proposal mins (anti-sandwich).
        uint256 bal0 = IERC20Minimal(Currency.unwrap(poolKey.currency0)).balanceOf(address(this));
        uint256 bal1 = IERC20Minimal(Currency.unwrap(poolKey.currency1)).balanceOf(address(this));
        if (bal0 < prop.amount0Min || bal1 < prop.amount1Min) revert ZeroAmount();

        (uint160 sqrtPriceX96,) = _slot0();
        uint128 newLiq = LiquidityAmounts.getLiquidityForAmounts(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(prop.tickLower),
            TickMath.getSqrtPriceAtTick(prop.tickUpper),
            bal0,
            bal1
        );
        if (newLiq == 0) revert ZeroAmount();

        band.tickLower = prop.tickLower;
        band.tickUpper = prop.tickUpper;
        ModifyLiquidityParams memory mintParams = ModifyLiquidityParams({
            tickLower: prop.tickLower,
            tickUpper: prop.tickUpper,
            liquidityDelta: int256(uint256(newLiq)),
            salt: POSITION_SALT
        });
        (BalanceDelta mintDelta,) = poolManager.modifyLiquidity(poolKey, mintParams, bytes(""));
        _settleDelta(mintDelta);
        totalLiquidity = newLiq;

        // 5) Write band, clear proposal, lock withdrawals for 3 blocks.
        band.lastRebalanceAt = uint48(block.timestamp);
        proposal.active = false;
        rebalanceUnlockBlock = block.number + 3;

        emit Rebalanced(p.curator, prop.tickLower, prop.tickUpper, proto0, proto1, curatorShares);
    }

    function _settleDelta(BalanceDelta delta) internal {
        int128 a0 = delta.amount0();
        int128 a1 = delta.amount1();
        if (a0 < 0) _pay(poolKey.currency0, uint256(uint128(-a0)));
        if (a1 < 0) _pay(poolKey.currency1, uint256(uint128(-a1)));
        if (a0 > 0) poolManager.take(poolKey.currency0, address(this), uint256(uint128(a0)));
        if (a1 > 0) poolManager.take(poolKey.currency1, address(this), uint256(uint128(a1)));
    }

    function _pay(Currency currency, uint256 amount) internal {
        if (amount == 0) return;
        poolManager.sync(currency);
        currency.transfer(address(poolManager), amount);
        poolManager.settle();
    }

    function _pull(Currency currency, address from, uint256 amount) internal {
        address token = Currency.unwrap(currency);
        bool ok = IERC20Minimal(token).transferFrom(from, address(this), amount);
        if (!ok) revert ZeroAmount();
    }

    function _idle(Currency currency) internal view returns (uint256) {
        address token = Currency.unwrap(currency);
        return IERC20Minimal(token).balanceOf(address(this));
    }

    function _positionAmount(uint8 which) internal view returns (uint256 amt) {
        (uint160 sqrtPriceX96,) = _slot0();
        (uint256 a0, uint256 a1) = LiquidityAmounts.getAmountsForLiquidity(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(band.tickLower),
            TickMath.getSqrtPriceAtTick(band.tickUpper),
            totalLiquidity
        );
        return which == 0 ? a0 : a1;
    }

    /// @dev Decimal-normalize to 18 decimals so 6-dec stables are 1:1 comparable.
    function _norm(Currency currency, uint256 amount) internal view returns (uint256) {
        uint8 d = 18;
        try IERC20Minimal(Currency.unwrap(currency)).decimals() returns (uint8 dec) {
            d = dec;
        } catch {}
        if (d == 18) return amount;
        if (d < 18) return amount * 10 ** (18 - d);
        return amount / 10 ** (d - 18);
    }

    function _slot0() internal view returns (uint160 sqrtPriceX96, int24 tick) {
        bytes32 stateSlot = keccak256(abi.encode(PoolId.unwrap(poolKey.toId()), uint256(6)));
        bytes32 packed = poolManager.extsload(stateSlot);
        sqrtPriceX96 = uint160(uint256(packed));
        tick = int24(int256(uint256(packed) >> 160));
        if (sqrtPriceX96 == 0) {
            // Mock / pre-init fallback: treat as 1:1.
            sqrtPriceX96 = TickMath.getSqrtPriceAtTick(0);
            tick = 0;
        }
    }

    // ── ERC-20 internals ─────────────────────────────────────────────────────
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - amount;
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        if (balanceOf[from] < amount) revert ZeroAmount();
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }
}
