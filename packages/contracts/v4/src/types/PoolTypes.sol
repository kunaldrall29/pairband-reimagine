// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @dev Local copies of Uniswap v4 types so Pairband compiles against v4-core
///      *or* standalone mocks. When forging with lib/v4-core, prefer the upstream
///      types via remappings and delete this file from imports.

type Currency is address;
type PoolId is bytes32;

using CurrencyLibrary for Currency global;
using PoolIdLibrary for PoolKey global;

function toCurrency(address a) pure returns (Currency) {
    return Currency.wrap(a);
}

library CurrencyLibrary {
    function unwrap(Currency c) internal pure returns (address) {
        return Currency.unwrap(c);
    }

    function transfer(Currency currency, address to, uint256 amount) internal {
        if (amount == 0) return;
        address token = Currency.unwrap(currency);
        if (token == address(0)) {
            (bool ok,) = to.call{value: amount}("");
            require(ok, "ETH_TRANSFER");
            return;
        }
        (bool success, bytes memory data) =
            token.call(abi.encodeWithSelector(0xa9059cbb, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "TRANSFER");
    }
}

struct PoolKey {
    Currency currency0;
    Currency currency1;
    uint24 fee;
    int24 tickSpacing;
    address hooks;
}

library PoolIdLibrary {
    function toId(PoolKey memory key) internal pure returns (PoolId) {
        return PoolId.wrap(keccak256(abi.encode(key)));
    }
}

/// @dev Packed int128 amount0 | int128 amount1, matching v4 BalanceDelta.
type BalanceDelta is int256;

library BalanceDeltaLibrary {
    function amount0(BalanceDelta delta) internal pure returns (int128) {
        return int128(int256(BalanceDelta.unwrap(delta)) >> 128);
    }

    function amount1(BalanceDelta delta) internal pure returns (int128) {
        return int128(int256(BalanceDelta.unwrap(delta)));
    }

    function toBalanceDelta(int128 a0, int128 a1) internal pure returns (BalanceDelta) {
        return BalanceDelta.wrap((int256(a0) << 128) | int256(uint256(uint128(a1))));
    }
}

struct ModifyLiquidityParams {
    int24 tickLower;
    int24 tickUpper;
    int256 liquidityDelta;
    bytes32 salt;
}

struct SwapParams {
    bool zeroForOne;
    int256 amountSpecified;
    uint160 sqrtPriceLimitX96;
}

/// @notice Hook permission flags — must match v4-core Hooks.sol.
library HookFlags {
    uint160 internal constant ALL_HOOK_MASK = uint160((1 << 14) - 1);
    uint160 internal constant BEFORE_INITIALIZE_FLAG = 1 << 13;
    uint160 internal constant AFTER_INITIALIZE_FLAG = 1 << 12;
    uint160 internal constant BEFORE_ADD_LIQUIDITY_FLAG = 1 << 11;
    uint160 internal constant AFTER_ADD_LIQUIDITY_FLAG = 1 << 10;
    uint160 internal constant BEFORE_REMOVE_LIQUIDITY_FLAG = 1 << 9;
    uint160 internal constant AFTER_REMOVE_LIQUIDITY_FLAG = 1 << 8;
    uint160 internal constant BEFORE_SWAP_FLAG = 1 << 7;
    uint160 internal constant AFTER_SWAP_FLAG = 1 << 6;
    uint160 internal constant BEFORE_DONATE_FLAG = 1 << 5;
    uint160 internal constant AFTER_DONATE_FLAG = 1 << 4;
    uint160 internal constant BEFORE_SWAP_RETURNS_DELTA_FLAG = 1 << 3;
    uint160 internal constant AFTER_SWAP_RETURNS_DELTA_FLAG = 1 << 2;
    uint160 internal constant AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG = 1 << 1;
    uint160 internal constant AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG = 1 << 0;

    /// @dev Pairband address flags: beforeInitialize | beforeAddLiquidity | beforeRemoveLiquidity | afterSwap
    uint160 internal constant PAIRBAND_FLAGS = BEFORE_INITIALIZE_FLAG | BEFORE_ADD_LIQUIDITY_FLAG
        | BEFORE_REMOVE_LIQUIDITY_FLAG | AFTER_SWAP_FLAG; // 0x2A40

    struct Permissions {
        bool beforeInitialize;
        bool afterInitialize;
        bool beforeAddLiquidity;
        bool afterAddLiquidity;
        bool beforeRemoveLiquidity;
        bool afterRemoveLiquidity;
        bool beforeSwap;
        bool afterSwap;
        bool beforeDonate;
        bool afterDonate;
        bool beforeSwapReturnDelta;
        bool afterSwapReturnDelta;
        bool afterAddLiquidityReturnDelta;
        bool afterRemoveLiquidityReturnDelta;
    }

    function validateHookAddress(address hook, Permissions memory p) internal pure {
        uint160 expected;
        if (p.beforeInitialize) expected |= BEFORE_INITIALIZE_FLAG;
        if (p.afterInitialize) expected |= AFTER_INITIALIZE_FLAG;
        if (p.beforeAddLiquidity) expected |= BEFORE_ADD_LIQUIDITY_FLAG;
        if (p.afterAddLiquidity) expected |= AFTER_ADD_LIQUIDITY_FLAG;
        if (p.beforeRemoveLiquidity) expected |= BEFORE_REMOVE_LIQUIDITY_FLAG;
        if (p.afterRemoveLiquidity) expected |= AFTER_REMOVE_LIQUIDITY_FLAG;
        if (p.beforeSwap) expected |= BEFORE_SWAP_FLAG;
        if (p.afterSwap) expected |= AFTER_SWAP_FLAG;
        if (p.beforeDonate) expected |= BEFORE_DONATE_FLAG;
        if (p.afterDonate) expected |= AFTER_DONATE_FLAG;
        if (p.beforeSwapReturnDelta) expected |= BEFORE_SWAP_RETURNS_DELTA_FLAG;
        if (p.afterSwapReturnDelta) expected |= AFTER_SWAP_RETURNS_DELTA_FLAG;
        if (p.afterAddLiquidityReturnDelta) expected |= AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG;
        if (p.afterRemoveLiquidityReturnDelta) expected |= AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG;
        require(uint160(hook) & ALL_HOOK_MASK == expected, "Hook address flags mismatch");
    }
}

interface IPoolManager {
    function initialize(PoolKey memory key, uint160 sqrtPriceX96) external returns (int24 tick);

    function unlock(bytes calldata data) external returns (bytes memory);

    function modifyLiquidity(PoolKey memory key, ModifyLiquidityParams memory params, bytes calldata hookData)
        external
        returns (BalanceDelta callerDelta, BalanceDelta feesAccrued);

    function swap(PoolKey memory key, SwapParams memory params, bytes calldata hookData)
        external
        returns (BalanceDelta);

    function sync(Currency currency) external;

    function settle() external payable returns (uint256);

    function take(Currency currency, address to, uint256 amount) external;

    function extsload(bytes32 slot) external view returns (bytes32);
}

interface IUnlockCallback {
    function unlockCallback(bytes calldata data) external returns (bytes memory);
}

interface IPositionManager {
    function modifyLiquidities(bytes calldata unlockData, uint256 deadline) external payable;
    function nextTokenId() external view returns (uint256);
}

interface IERC20Minimal {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address) external view returns (uint256);
    function decimals() external view returns (uint8);
}
