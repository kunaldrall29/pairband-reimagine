// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title ShareMath
/// @notice Share and asset conversions with explicit rounding.
/// @dev Deposit share mint uses floor so we never over-mint versus liquidity.
///      Withdraw token payout uses floor so remaining LPs keep any 1-wei dust.
///      Invariant: sum of withdrawable token value of all shares <= vault-held
///      tokens + position amounts (1-wei dust allowed).
library ShareMath {
    error DivByZero();

    /// @notice Floor(a * b / d). Used for shares minted on deposit and tokens paid on withdraw.
    function mulDivFloor(uint256 a, uint256 b, uint256 denominator) internal pure returns (uint256) {
        if (denominator == 0) revert DivByZero();
        return (a * b) / denominator;
    }

    /// @notice Ceil(a * b / d). Reserved for quote previews that should not under-state cost.
    function mulDivCeil(uint256 a, uint256 b, uint256 denominator) internal pure returns (uint256) {
        if (denominator == 0) revert DivByZero();
        uint256 prod = a * b;
        uint256 result = prod / denominator;
        if (prod % denominator != 0) result += 1;
        return result;
    }

    /// @notice Shares to mint for `liquidity` added.
    /// @dev First depositor: shares = liquidity (caller also burns MIN_DEAD to 0xdeaD).
    function sharesForLiquidity(uint256 liquidity, uint256 totalSupply, uint256 totalLiquidityBefore)
        internal
        pure
        returns (uint256 shares)
    {
        if (totalSupply == 0) return liquidity;
        if (totalLiquidityBefore == 0) revert DivByZero();
        return mulDivFloor(liquidity, totalSupply, totalLiquidityBefore);
    }

    /// @notice Liquidity (and therefore token amounts) owed to `shares` of `totalSupply`.
    function liquidityForShares(uint256 shares, uint256 totalSupply, uint256 totalLiquidity)
        internal
        pure
        returns (uint256)
    {
        if (totalSupply == 0) revert DivByZero();
        return mulDivFloor(shares, totalLiquidity, totalSupply);
    }
}
