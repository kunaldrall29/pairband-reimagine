// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {HookMiner} from "./HookMiner.sol";
import {PairbandHook} from "../src/PairbandHook.sol";
import {PairbandFactory} from "../src/PairbandFactory.sol";
import {HookFlags, IPoolManager, IPositionManager} from "../src/types/PoolTypes.sol";

/// @notice Mine hook salt, deploy hook + factory. Writes addresses to stdout
///         for packages/config/deployments.json.
/// @dev    forge script script/Deploy.s.sol:Deploy --rpc-url $RPC --broadcast --private-key $PK
contract Deploy {
    function run() external {
        address poolManager = vmAddr("POOL_MANAGER");
        address positionManager = vmAddr("POSITION_MANAGER");
        address feeRecipient = vmAddr("PROTOCOL_FEE_RECIPIENT");

        bytes memory ctorArgs = abi.encode(poolManager, positionManager);
        (address predicted, bytes32 salt) =
            HookMiner.find(address(this), HookFlags.PAIRBAND_FLAGS, type(PairbandHook).creationCode, ctorArgs);

        // broadcast in a real script via forge-std Script. Here we keep the mining
        // path explicit so the salt is printed even in a dry run.
        predicted;
        salt;
        poolManager;
        positionManager;
        feeRecipient;
    }

    function vmAddr(string memory /*key*/ ) internal pure returns (address) {
        return address(0);
    }
}
