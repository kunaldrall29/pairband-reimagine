// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice CREATE2 salt miner for Uniswap v4 hook address flags.
/// @dev Adapted from v4-periphery HookMiner. Used by Deploy.s.sol.
library HookMiner {
    uint160 internal constant FLAG_MASK = uint160((1 << 14) - 1);

    function find(address deployer, uint160 flags, bytes memory creationCode, bytes memory constructorArgs)
        internal
        pure
        returns (address hookAddress, bytes32 salt)
    {
        bytes32 initCodeHash = keccak256(abi.encodePacked(creationCode, constructorArgs));
        uint256 start = 0;
        for (uint256 i = start; i < start + 200_000; i++) {
            salt = bytes32(i);
            hookAddress = computeAddress(deployer, salt, initCodeHash);
            if (uint160(hookAddress) & FLAG_MASK == flags) {
                return (hookAddress, salt);
            }
        }
        revert("HookMiner: no salt");
    }

    function computeAddress(address deployer, bytes32 salt, bytes32 initCodeHash) internal pure returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), deployer, salt, initCodeHash)))));
    }
}
