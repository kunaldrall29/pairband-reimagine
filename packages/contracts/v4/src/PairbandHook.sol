// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {
    IPoolManager,
    PoolKey,
    PoolId,
    PoolIdLibrary,
    ModifyLiquidityParams,
    SwapParams,
    BalanceDelta,
    HookFlags
} from "./types/PoolTypes.sol";

/// @title PairbandHook
/// @notice Singleton Uniswap v4 hook. Gates liquidity so ONLY the registered vault
///         (or PositionManager acting under that vault's transient operate flag)
///         may modifyLiquidity. afterSwap emits only — no storage writes, no delta.
/// @dev Permissions / address flags ONLY:
///      BEFORE_INITIALIZE | BEFORE_ADD_LIQUIDITY | BEFORE_REMOVE_LIQUIDITY | AFTER_SWAP
///      Flag mask = 0x2A40. Mine the CREATE2 salt so the deployed address matches.
contract PairbandHook {
    using PoolIdLibrary for PoolKey;

    error NotVault();
    error NotFactory();
    error AlreadySet();
    error NotPoolManager();
    error HookNotImplemented();

    /// @notice Emitted from afterSwap. Indexers / the app poll this for the sparkline.
    /// @dev Intentionally no storage writes — a storage-heavy afterSwap can grief swappers.
    event SwapTouched(PoolId indexed poolId, int24 tick, uint160 sqrtPriceX96);

    IPoolManager public immutable poolManager;
    address public immutable positionManager;
    address public factory;

    mapping(PoolId => address) public vaultOf;

    /// @dev Cancun transient slot: vault that is currently operating via PositionManager.
    bytes32 private constant OPERATING_SLOT = keccak256("pairband.operating");

    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        _;
    }

    constructor(IPoolManager _poolManager, address _positionManager) {
        poolManager = _poolManager;
        positionManager = _positionManager;
        HookFlags.validateHookAddress(address(this), getHookPermissions());
    }

    /// @notice Wire the factory once. Factory is the only registrar.
    function setFactory(address _factory) external {
        if (factory != address(0)) revert AlreadySet();
        if (_factory == address(0)) revert NotFactory();
        factory = _factory;
    }

    /// @notice Register the unique vault for a pool. Reverts if already set.
    function registerVault(PoolKey calldata key, address vault) external {
        if (msg.sender != factory) revert NotFactory();
        if (vault == address(0)) revert NotVault();
        PoolId id = key.toId();
        if (vaultOf[id] != address(0)) revert AlreadySet();
        vaultOf[id] = vault;
    }

    /// @notice Vault calls this immediately before a PositionManager.modifyLiquidities
    ///         so the hook can attribute the locker (PositionManager) to the vault.
    ///         Direct vault→PoolManager.unlock paths do not need this (sender == vault).
    function notifyOperate(PoolId id) external {
        if (msg.sender != vaultOf[id]) revert NotVault();
        assembly ("memory-safe") {
            tstore(OPERATING_SLOT, caller())
        }
    }

    function getHookPermissions() public pure returns (HookFlags.Permissions memory) {
        return HookFlags.Permissions({
            beforeInitialize: true,
            afterInitialize: false,
            beforeAddLiquidity: true,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: true,
            afterRemoveLiquidity: false,
            beforeSwap: false,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    /// @notice One vault per pool must already be registered. Revert if missing.
    function beforeInitialize(address, PoolKey calldata key, uint160) external view onlyPoolManager returns (bytes4) {
        if (vaultOf[key.toId()] == address(0)) revert NotVault();
        return this.beforeInitialize.selector;
    }

    function beforeAddLiquidity(
        address sender,
        PoolKey calldata key,
        ModifyLiquidityParams calldata,
        bytes calldata
    ) external view onlyPoolManager returns (bytes4) {
        _requireVaultLocker(sender, key.toId());
        return this.beforeAddLiquidity.selector;
    }

    function beforeRemoveLiquidity(
        address sender,
        PoolKey calldata key,
        ModifyLiquidityParams calldata,
        bytes calldata
    ) external view onlyPoolManager returns (bytes4) {
        _requireVaultLocker(sender, key.toId());
        return this.beforeRemoveLiquidity.selector;
    }

    /// @notice Emit only. Returns 0 delta — AFTER_SWAP_RETURNS_DELTA is not set.
    function afterSwap(
        address,
        PoolKey calldata key,
        SwapParams calldata,
        BalanceDelta,
        bytes calldata
    ) external onlyPoolManager returns (bytes4, int128) {
        (uint160 sqrtPriceX96, int24 tick) = _slot0(key.toId());
        emit SwapTouched(key.toId(), tick, sqrtPriceX96);
        return (this.afterSwap.selector, 0);
    }

    function _requireVaultLocker(address sender, PoolId id) internal view {
        address vault = vaultOf[id];
        if (vault == address(0)) revert NotVault();
        if (sender == vault) return;
        if (sender == positionManager) {
            address operating;
            assembly ("memory-safe") {
                operating := tload(OPERATING_SLOT)
            }
            if (operating != vault) revert NotVault();
            return;
        }
        revert NotVault();
    }

    /// @dev Best-effort slot0 via extssload of the v4 StateLibrary slot. Tests/mocks
    ///      may return (0, 0); the event is still useful as a heartbeat.
    function _slot0(PoolId id) internal view returns (uint160 sqrtPriceX96, int24 tick) {
        // PoolManager pools slot: keccak256(abi.encode(poolId, pools.slot)) with pools.slot = 6 in v4-core.
        bytes32 stateSlot = keccak256(abi.encode(PoolId.unwrap(id), uint256(6)));
        try poolManager.extsload(stateSlot) returns (bytes32 packed) {
            sqrtPriceX96 = uint160(uint256(packed));
            tick = int24(int256(uint256(packed) >> 160));
        } catch {
            return (0, 0);
        }
    }

    // Unimplemented hook entrypoints — v4 calls them only if the address flag is set.
    function afterInitialize(address, PoolKey calldata, uint160, int24) external pure returns (bytes4) {
        revert HookNotImplemented();
    }
}
