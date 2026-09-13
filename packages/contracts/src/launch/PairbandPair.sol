// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {AmmMath} from "./AmmMath.sol";

interface IERC20Minimal {
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
}

/// @notice Uniswap v2-style constant product pair. 0.30% fee. MIT original — not a copy of DualPool/Bunni.
contract PairbandPair {
    error Locked();
    error NotFactory();
    error InsufficientLiquidity();
    error K();
    error Overflow();

    event Mint(address indexed sender, uint256 amount0, uint256 amount1, uint256 liquidity);
    event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to);
    event Sync(uint112 reserve0, uint112 reserve1);

    uint256 public constant MINIMUM_LIQUIDITY = 1_000;
    address public immutable factory;
    address public token0;
    address public token1;
    uint112 public reserve0;
    uint112 public reserve1;
    uint256 public kLast;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    uint256 private unlocked = 1;
    modifier lock() {
        if (unlocked != 1) revert Locked();
        unlocked = 0;
        _;
        unlocked = 1;
    }

    constructor() {
        factory = msg.sender;
    }

    function initialize(address t0, address t1) external {
        if (msg.sender != factory) revert NotFactory();
        token0 = t0;
        token1 = t1;
    }

    function getReserves() public view returns (uint112, uint112) {
        return (reserve0, reserve1);
    }

    /// @notice Mint LP to `to`. First mint permanently locks MINIMUM_LIQUIDITY at address(0).
    function mint(address to) external lock returns (uint256 liquidity) {
        (uint112 r0, uint112 r1) = (reserve0, reserve1);
        uint256 balance0 = IERC20Minimal(token0).balanceOf(address(this));
        uint256 balance1 = IERC20Minimal(token1).balanceOf(address(this));
        uint256 amount0 = balance0 - r0;
        uint256 amount1 = balance1 - r1;

        uint256 _total = totalSupply;
        if (_total == 0) {
            liquidity = AmmMath.sqrt(amount0 * amount1);
            if (liquidity <= MINIMUM_LIQUIDITY) revert InsufficientLiquidity();
            liquidity -= MINIMUM_LIQUIDITY;
            totalSupply = liquidity + MINIMUM_LIQUIDITY;
            balanceOf[address(0)] = MINIMUM_LIQUIDITY;
        } else {
            uint256 liq0 = (amount0 * _total) / r0;
            uint256 liq1 = (amount1 * _total) / r1;
            liquidity = liq0 < liq1 ? liq0 : liq1;
            if (liquidity == 0) revert InsufficientLiquidity();
            totalSupply = _total + liquidity;
        }
        balanceOf[to] += liquidity;
        _update(balance0, balance1);
        kLast = uint256(reserve0) * uint256(reserve1);
        emit Mint(msg.sender, amount0, amount1, liquidity);
    }

    /// @notice Optimistic swap. Caller must have already sent the input token to this pair.
    function swap(uint256 amount0Out, uint256 amount1Out, address to) external lock {
        if (amount0Out == 0 && amount1Out == 0) revert InsufficientLiquidity();
        (uint112 r0, uint112 r1) = (reserve0, reserve1);
        if (amount0Out >= r0 || amount1Out >= r1) revert InsufficientLiquidity();
        if (amount0Out > 0) _safeTransfer(token0, to, amount0Out);
        if (amount1Out > 0) _safeTransfer(token1, to, amount1Out);
        uint256 balance0 = IERC20Minimal(token0).balanceOf(address(this));
        uint256 balance1 = IERC20Minimal(token1).balanceOf(address(this));
        uint256 amount0In = balance0 > r0 - amount0Out ? balance0 - (r0 - amount0Out) : 0;
        uint256 amount1In = balance1 > r1 - amount1Out ? balance1 - (r1 - amount1Out) : 0;
        if (amount0In == 0 && amount1In == 0) revert InsufficientLiquidity();
        uint256 balance0Adj = balance0 * 1000 - amount0In * 3;
        uint256 balance1Adj = balance1 * 1000 - amount1In * 3;
        if (balance0Adj * balance1Adj < uint256(r0) * uint256(r1) * 1000 ** 2) revert K();
        _update(balance0, balance1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    function _update(uint256 balance0, uint256 balance1) private {
        if (balance0 > type(uint112).max || balance1 > type(uint112).max) revert Overflow();
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        emit Sync(reserve0, reserve1);
    }

    function _safeTransfer(address token, address to, uint256 value) private {
        (bool ok, bytes memory data) = token.call(abi.encodeWithSelector(IERC20Minimal.transfer.selector, to, value));
        require(ok && (data.length == 0 || abi.decode(data, (bool))), "TRANSFER");
    }
}
