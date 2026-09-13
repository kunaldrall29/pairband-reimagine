// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {FullMath} from "./FullMath.sol";
import {TickMath} from "./TickMath.sol";

/// @notice Convert token amounts <-> liquidity. Adapted from Uniswap v4-periphery (MIT).
library LiquidityAmounts {
    uint256 internal constant Q96 = 0x1000000000000000000000000;

    function getLiquidityForAmount0(uint160 sqrtA, uint160 sqrtB, uint256 amount0)
        internal
        pure
        returns (uint128 liquidity)
    {
        if (sqrtA > sqrtB) (sqrtA, sqrtB) = (sqrtB, sqrtA);
        uint256 intermediate = FullMath.mulDiv(sqrtA, sqrtB, Q96);
        liquidity = toUint128(FullMath.mulDiv(amount0, intermediate, sqrtB - sqrtA));
    }

    function getLiquidityForAmount1(uint160 sqrtA, uint160 sqrtB, uint256 amount1)
        internal
        pure
        returns (uint128 liquidity)
    {
        if (sqrtA > sqrtB) (sqrtA, sqrtB) = (sqrtB, sqrtA);
        liquidity = toUint128(FullMath.mulDiv(amount1, Q96, sqrtB - sqrtA));
    }

    function getLiquidityForAmounts(
        uint160 sqrtPriceX96,
        uint160 sqrtA,
        uint160 sqrtB,
        uint256 amount0,
        uint256 amount1
    ) internal pure returns (uint128 liquidity) {
        if (sqrtA > sqrtB) (sqrtA, sqrtB) = (sqrtB, sqrtA);
        if (sqrtPriceX96 <= sqrtA) {
            liquidity = getLiquidityForAmount0(sqrtA, sqrtB, amount0);
        } else if (sqrtPriceX96 < sqrtB) {
            uint128 liq0 = getLiquidityForAmount0(sqrtPriceX96, sqrtB, amount0);
            uint128 liq1 = getLiquidityForAmount1(sqrtA, sqrtPriceX96, amount1);
            liquidity = liq0 < liq1 ? liq0 : liq1;
        } else {
            liquidity = getLiquidityForAmount1(sqrtA, sqrtB, amount1);
        }
    }

    function getAmount0ForLiquidity(uint160 sqrtA, uint160 sqrtB, uint128 liquidity)
        internal
        pure
        returns (uint256 amount0)
    {
        if (sqrtA > sqrtB) (sqrtA, sqrtB) = (sqrtB, sqrtA);
        amount0 = FullMath.mulDiv(uint256(liquidity) << 96, sqrtB - sqrtA, sqrtB) / sqrtA;
    }

    function getAmount1ForLiquidity(uint160 sqrtA, uint160 sqrtB, uint128 liquidity)
        internal
        pure
        returns (uint256 amount1)
    {
        if (sqrtA > sqrtB) (sqrtA, sqrtB) = (sqrtB, sqrtA);
        amount1 = FullMath.mulDiv(liquidity, sqrtB - sqrtA, Q96);
    }

    function getAmountsForLiquidity(uint160 sqrtPriceX96, uint160 sqrtA, uint160 sqrtB, uint128 liquidity)
        internal
        pure
        returns (uint256 amount0, uint256 amount1)
    {
        if (sqrtA > sqrtB) (sqrtA, sqrtB) = (sqrtB, sqrtA);
        if (sqrtPriceX96 <= sqrtA) {
            amount0 = getAmount0ForLiquidity(sqrtA, sqrtB, liquidity);
        } else if (sqrtPriceX96 < sqrtB) {
            amount0 = getAmount0ForLiquidity(sqrtPriceX96, sqrtB, liquidity);
            amount1 = getAmount1ForLiquidity(sqrtA, sqrtPriceX96, liquidity);
        } else {
            amount1 = getAmount1ForLiquidity(sqrtA, sqrtB, liquidity);
        }
    }

    function getLiquidityForAmountsAtTick(
        int24 tick,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0,
        uint256 amount1
    ) internal pure returns (uint128) {
        return getLiquidityForAmounts(
            TickMath.getSqrtPriceAtTick(tick),
            TickMath.getSqrtPriceAtTick(tickLower),
            TickMath.getSqrtPriceAtTick(tickUpper),
            amount0,
            amount1
        );
    }

    function toUint128(uint256 x) private pure returns (uint128 y) {
        require(x <= type(uint128).max);
        y = uint128(x);
    }
}
