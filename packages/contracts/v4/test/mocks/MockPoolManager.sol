// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {PairbandHook} from "../../src/PairbandHook.sol";
import {TickMath} from "../../src/libraries/TickMath.sol";
import {LiquidityAmounts} from "../../src/libraries/LiquidityAmounts.sol";
import {
    IUnlockCallback,
    PoolKey,
    PoolId,
    PoolIdLibrary,
    Currency,
    CurrencyLibrary,
    ModifyLiquidityParams,
    SwapParams,
    BalanceDelta,
    BalanceDeltaLibrary,
    IERC20Minimal
} from "../../src/types/PoolTypes.sol";

/// @notice Minimal PoolManager mock: unlock callback, modifyLiquidity with hook gates,
///         slot0, and a simple in-range swap used by vault tests.
contract MockPoolManager {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;
    using BalanceDeltaLibrary for BalanceDelta;

    struct PoolState {
        uint160 sqrtPriceX96;
        int24 tick;
        uint128 liquidity;
        int24 tickLower;
        int24 tickUpper;
        address locker;
        bool initialized;
        uint256 fee0;
        uint256 fee1;
    }

    mapping(PoolId => PoolState) public pools;
    mapping(address => uint256) public synced;

    event LiquidityModified(address indexed locker, int256 liquidityDelta);

    function initialize(PoolKey memory key, uint160 sqrtPriceX96) external returns (int24 tick) {
        PoolId id = key.toId();
        tick = TickMath.getTickAtSqrtPrice(sqrtPriceX96);
        pools[id].sqrtPriceX96 = sqrtPriceX96;
        pools[id].tick = tick;
        pools[id].initialized = true;
        if (key.hooks != address(0)) {
            PairbandHook(key.hooks).beforeInitialize(msg.sender, key, sqrtPriceX96);
        }
    }

    function setSlot0(PoolKey memory key, uint160 sqrtPriceX96, int24 tick) external {
        PoolId id = key.toId();
        pools[id].sqrtPriceX96 = sqrtPriceX96;
        pools[id].tick = tick;
        pools[id].initialized = true;
    }

    function unlock(bytes calldata data) external returns (bytes memory) {
        return IUnlockCallback(msg.sender).unlockCallback(data);
    }

    function modifyLiquidity(PoolKey memory key, ModifyLiquidityParams memory params, bytes calldata hookData)
        external
        returns (BalanceDelta callerDelta, BalanceDelta feesAccrued)
    {
        PoolId id = key.toId();
        PoolState storage p = pools[id];
        address hooks = key.hooks;

        if (params.liquidityDelta > 0) {
            if (hooks != address(0)) {
                PairbandHook(hooks).beforeAddLiquidity(msg.sender, key, params, hookData);
            }
            uint128 add = uint128(uint256(params.liquidityDelta));
            (uint256 a0, uint256 a1) = LiquidityAmounts.getAmountsForLiquidity(
                p.sqrtPriceX96,
                TickMath.getSqrtPriceAtTick(params.tickLower),
                TickMath.getSqrtPriceAtTick(params.tickUpper),
                add
            );
            p.liquidity += add;
            p.tickLower = params.tickLower;
            p.tickUpper = params.tickUpper;
            callerDelta = BalanceDeltaLibrary.toBalanceDelta(-int128(int256(a0)), -int128(int256(a1)));
        } else if (params.liquidityDelta < 0) {
            if (hooks != address(0)) {
                PairbandHook(hooks).beforeRemoveLiquidity(msg.sender, key, params, hookData);
            }
            uint128 sub = uint128(uint256(-params.liquidityDelta));
            (uint256 a0, uint256 a1) = LiquidityAmounts.getAmountsForLiquidity(
                p.sqrtPriceX96,
                TickMath.getSqrtPriceAtTick(params.tickLower),
                TickMath.getSqrtPriceAtTick(params.tickUpper),
                sub
            );
            p.liquidity -= sub;
            callerDelta = BalanceDeltaLibrary.toBalanceDelta(int128(int256(a0)), int128(int256(a1)));
        } else {
            // collect: return accrued fees as positive delta
            feesAccrued = BalanceDeltaLibrary.toBalanceDelta(int128(int256(p.fee0)), int128(int256(p.fee1)));
            p.fee0 = 0;
            p.fee1 = 0;
        }
        emit LiquidityModified(msg.sender, params.liquidityDelta);
    }

    /// @dev Credit fees as if a swap happened, then ping afterSwap.
    function simulateSwap(PoolKey memory key, bool zeroForOne, uint256 amountIn, uint256 feeAmount, int24 newTick)
        external
        returns (BalanceDelta)
    {
        PoolId id = key.toId();
        PoolState storage p = pools[id];
        if (zeroForOne) p.fee0 += feeAmount;
        else p.fee1 += feeAmount;
        p.tick = newTick;
        p.sqrtPriceX96 = TickMath.getSqrtPriceAtTick(newTick);
        SwapParams memory sp =
            SwapParams({zeroForOne: zeroForOne, amountSpecified: -int256(amountIn), sqrtPriceLimitX96: 0});
        if (key.hooks != address(0)) {
            PairbandHook(key.hooks).afterSwap(msg.sender, key, sp, BalanceDelta.wrap(0), bytes(""));
        }
        amountIn;
        return BalanceDelta.wrap(0);
    }

    function sync(Currency currency) external {
        synced[Currency.unwrap(currency)] = IERC20Minimal(Currency.unwrap(currency)).balanceOf(address(this));
    }

    function settle() external payable returns (uint256 paid) {
        // Tokens already transferred in; no-op for the mock.
        return 0;
    }

    function take(Currency currency, address to, uint256 amount) external {
        currency.transfer(to, amount);
    }

    function extssload(bytes32) external pure returns (bytes32) {
        return bytes32(0);
    }

    function liquidityOf(PoolKey memory key) external view returns (uint128) {
        return pools[key.toId()].liquidity;
    }
}
