// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title BandMath
/// @notice Tick alignment, width, L1 shift, and in-range checks for Pairband vaults.
/// @dev Shift is defined as |ΔtickLower| + |ΔtickUpper| (Manhattan / L1). A parallel
///      translation of N ticks costs 2N; a one-sided stretch of N ticks costs N.
library BandMath {
    error InvalidTicks();

    /// @notice Align `tick` down to a multiple of `spacing`, rounding toward negative infinity.
    function align(int24 tick, int24 spacing) internal pure returns (int24 aligned) {
        if (spacing <= 0) revert InvalidTicks();
        int24 compressed = tick / spacing;
        if (tick < 0 && tick % spacing != 0) compressed--;
        aligned = compressed * spacing;
    }

    /// @notice Width in ticks. Reverts if the band is empty or inverted.
    function width(int24 tickLower, int24 tickUpper) internal pure returns (int24) {
        if (tickLower >= tickUpper) revert InvalidTicks();
        return tickUpper - tickLower;
    }

    /// @notice L1 shift of a proposed band versus the live band.
    /// @dev Metric = |newLower - curLower| + |newUpper - curUpper|. Documented and tested.
    function shift(int24 curLower, int24 curUpper, int24 newLower, int24 newUpper)
        internal
        pure
        returns (uint256)
    {
        return _absDiff(curLower, newLower) + _absDiff(curUpper, newUpper);
    }

    /// @notice Uniswap v3/v4 in-range test: tickLower <= tick < tickUpper.
    function inRange(int24 tick, int24 tickLower, int24 tickUpper) internal pure returns (bool) {
        return tick >= tickLower && tick < tickUpper;
    }

    /// @notice Require the proposed band is aligned, non-empty, within `maxWidth`, and a multiple of spacing.
    function validateBand(int24 tickLower, int24 tickUpper, int24 spacing, uint24 maxWidth) internal pure {
        if (spacing <= 0) revert InvalidTicks();
        if (tickLower >= tickUpper) revert InvalidTicks();
        if (tickLower % spacing != 0 || tickUpper % spacing != 0) revert InvalidTicks();
        int24 w = tickUpper - tickLower;
        if (w <= 0) revert InvalidTicks();
        if (uint24(w) > maxWidth) revert TooWide();
        if (uint24(w) % uint24(spacing) != 0) revert InvalidTicks();
    }

    error TooWide();

    function _absDiff(int24 a, int24 b) private pure returns (uint256) {
        return a >= b ? uint256(int256(a - b)) : uint256(int256(b - a));
    }
}
