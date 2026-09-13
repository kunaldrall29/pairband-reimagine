// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

library AmmMath {
    uint256 internal constant BPS = 10_000;
    uint256 internal constant FEE_BPS = 30; // 0.30% Uniswap v2-style

    error ZeroAmount();
    error InsufficientLiquidity();

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) internal pure returns (uint256 out) {
        if (amountIn == 0) revert ZeroAmount();
        if (reserveIn == 0 || reserveOut == 0) revert InsufficientLiquidity();
        uint256 amountInWithFee = amountIn * (BPS - FEE_BPS);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * BPS + amountInWithFee;
        out = numerator / denominator;
        if (out == 0 || out >= reserveOut) revert InsufficientLiquidity();
    }

    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y <= 0) return 0;
        z = y;
        uint256 x = y / 2 + 1;
        while (x < z) {
            z = x;
            x = (y / x + x) / 2;
        }
    }
}
