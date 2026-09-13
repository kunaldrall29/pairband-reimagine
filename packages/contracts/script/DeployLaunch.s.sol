// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console2} from "forge-std/Script.sol";
import {PairbandLaunchpad} from "../src/launch/PairbandLaunchpad.sol";
import {PairbandSettler} from "../src/launch/PairbandSettler.sol";
import {MockERC20} from "../test/mocks/MockERC20.sol";

/// @notice Deploy launchpad + AMM factory. Same bytecode on Arc testnet (5042002) and mainnet (5042).
/// @dev    forge script script/DeployLaunch.s.sol:DeployLaunch --rpc-url $RPC --broadcast --private-key $PK
contract DeployLaunch is Script {
    address constant ARC_USDC = 0x3600000000000000000000000000000000000000;

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        uint256 chainId = block.chainid;

        address usdc;
        uint256 graduateAt;
        uint256 virtualUsdc;
        uint256 virtualTokens = 1_000_000_000 ether;

        if (chainId == 31337) {
            vm.startBroadcast(pk);
            MockERC20 mock = new MockERC20("USD Coin", "USDC", 6);
            mock.mint(deployer, 1_000_000e6);
            usdc = address(mock);
            graduateAt = 80e6;
            virtualUsdc = 80e6;
        } else {
            usdc = ARC_USDC;
            graduateAt = 80e6;
            virtualUsdc = 80e6;
            vm.startBroadcast(pk);
        }

        PairbandLaunchpad pad = new PairbandLaunchpad(usdc, deployer, graduateAt, virtualUsdc, virtualTokens);
        address messenger = chainId == 31337 ? address(0) : 0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA;
        PairbandSettler settler = new PairbandSettler(usdc, address(pad), messenger, messenger);
        vm.stopBroadcast();

        console2.log("chainId", chainId);
        console2.log("deployer", deployer);
        console2.log("usdc", usdc);
        console2.log("launchpad", address(pad));
        console2.log("settler", address(settler));
        console2.log("ammFactory", address(pad.ammFactory()));
        console2.log("graduateAt", pad.graduateAt());
    }
}
