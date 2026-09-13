// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {PairbandPair} from "./PairbandPair.sol";

/// @notice Creates Uniswap v2-style pairs. One pair per token combo.
contract PairbandAmmFactory {
    error Identical();
    error ZeroAddress();
    error Exists();

    event PairCreated(address indexed token0, address indexed token1, address pair, uint256 allPairsLength);

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        if (tokenA == tokenB) revert Identical();
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        if (token0 == address(0)) revert ZeroAddress();
        if (getPair[token0][token1] != address(0)) revert Exists();
        PairbandPair p = new PairbandPair();
        p.initialize(token0, token1);
        pair = address(p);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
}
