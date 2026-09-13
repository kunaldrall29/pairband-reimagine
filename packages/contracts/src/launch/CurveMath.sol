// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

library CurveMath {
    uint256 internal constant BPS = 10_000;
    uint256 internal constant PROTOCOL_FEE_BPS = 100;
    uint256 internal constant CREATOR_FEE_BPS = 50;

    error ZeroAmount();
    error InsufficientLiquidity();

    function splitFees(uint256 usdcIn)
        internal
        pure
        returns (uint256 protocol, uint256 creator, uint256 net)
    {
        if (usdcIn == 0) revert ZeroAmount();
        protocol = (usdcIn * PROTOCOL_FEE_BPS) / BPS;
        creator = (usdcIn * CREATOR_FEE_BPS) / BPS;
        net = usdcIn - protocol - creator;
    }

    function getTokensOut(uint256 virtualUsdc, uint256 virtualTokens, uint256 netUsdcIn)
        internal
        pure
        returns (uint256)
    {
        if (netUsdcIn == 0) revert ZeroAmount();
        if (virtualUsdc == 0 || virtualTokens == 0) revert InsufficientLiquidity();
        uint256 newUsdc = virtualUsdc + netUsdcIn;
        uint256 newTokens = (virtualUsdc * virtualTokens) / newUsdc;
        if (newTokens >= virtualTokens) revert InsufficientLiquidity();
        return virtualTokens - newTokens;
    }

    function getUsdcOut(uint256 virtualUsdc, uint256 virtualTokens, uint256 tokensIn)
        internal
        pure
        returns (uint256)
    {
        if (tokensIn == 0) revert ZeroAmount();
        if (virtualUsdc == 0 || virtualTokens == 0) revert InsufficientLiquidity();
        uint256 newTokens = virtualTokens + tokensIn;
        uint256 newUsdc = (virtualUsdc * virtualTokens) / newTokens;
        if (newUsdc >= virtualUsdc) revert InsufficientLiquidity();
        return virtualUsdc - newUsdc;
    }
}
