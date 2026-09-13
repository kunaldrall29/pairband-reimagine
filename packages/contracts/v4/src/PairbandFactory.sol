// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {PairbandHook} from "./PairbandHook.sol";
import {PairbandVault} from "./PairbandVault.sol";
import {
    IPoolManager,
    IPositionManager,
    PoolKey,
    PoolId,
    PoolIdLibrary,
    Currency,
    CurrencyLibrary
} from "./types/PoolTypes.sol";

/// @title PairbandFactory
/// @notice Deploys a vault per pair, registers it on the singleton hook, initializes the pool.
contract PairbandFactory {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    error NotOwner();
    error FeeCap();
    error ZeroAddress();

    event PairbandCreated(
        address indexed vault,
        address indexed hook,
        PoolId indexed poolId,
        address curator,
        address currency0,
        address currency1
    );
    event ProtocolFeeRecipientSet(address indexed recipient);
    event OwnerTransferred(address indexed oldOwner, address indexed newOwner);

    address public owner;
    address public protocolFeeRecipient;
    uint16 public globalFeeCeilingBps = 200;
    IPoolManager public immutable poolManager;
    IPositionManager public immutable positionManager;
    PairbandHook public immutable hook;

    mapping(PoolId => address) public vaultOf;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(
        IPoolManager _poolManager,
        IPositionManager _positionManager,
        PairbandHook _hook,
        address _protocolFeeRecipient
    ) {
        owner = msg.sender;
        poolManager = _poolManager;
        positionManager = _positionManager;
        hook = _hook;
        protocolFeeRecipient = _protocolFeeRecipient;
        _hook.setFactory(address(this));
    }

    /// @notice Deploy a vault, register it, initialize the pool if needed.
    /// @param key Pool key — hooks MUST equal the Pairband hook.
    /// @param policy Vault policy. protocolFeeBps is capped by globalFeeCeilingBps (≤ 200).
    /// @param sqrtPriceX96 Passed to PoolManager.initialize; ignored if the pool already exists.
    /// @param tickLower Initial band lower tick (aligned).
    /// @param tickUpper Initial band upper tick.
    /// @param name_ ERC-20 name, e.g. "Pairband USDC-USD1".
    /// @param symbol_ ERC-20 symbol, e.g. "pb-USDC-USD1".
    function createPairband(
        PoolKey memory key,
        PairbandVault.Policy memory policy,
        uint160 sqrtPriceX96,
        int24 tickLower,
        int24 tickUpper,
        string calldata name_,
        string calldata symbol_
    ) external returns (address vault, PoolId id) {
        if (key.hooks != address(hook)) revert ZeroAddress();
        if (policy.protocolFeeBps > globalFeeCeilingBps || policy.protocolFeeBps > 200) revert FeeCap();

        id = key.toId();
        vault = address(
            new PairbandVault(
                key,
                policy,
                poolManager,
                positionManager,
                hook,
                protocolFeeRecipient,
                tickLower,
                tickUpper,
                name_,
                symbol_
            )
        );
        hook.registerVault(key, vault);
        vaultOf[id] = vault;

        if (sqrtPriceX96 != 0) {
            try poolManager.initialize(key, sqrtPriceX96) {} catch {}
        }

        emit PairbandCreated(vault, address(hook), id, policy.curator, Currency.unwrap(key.currency0), Currency.unwrap(key.currency1));
    }

    function setProtocolFeeRecipient(address recipient) external onlyOwner {
        if (recipient == address(0)) revert ZeroAddress();
        protocolFeeRecipient = recipient;
        emit ProtocolFeeRecipientSet(recipient);
    }

    function setGlobalFeeCeiling(uint16 bps) external onlyOwner {
        if (bps > 200) revert FeeCap();
        globalFeeCeilingBps = bps;
    }

    function transferOwner(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnerTransferred(owner, newOwner);
        owner = newOwner;
    }
}
