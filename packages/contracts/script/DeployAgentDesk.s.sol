// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console2} from "forge-std/Script.sol";
import {VaultAgentDesk} from "../src/agent/VaultAgentDesk.sol";
import {MockERC20} from "../test/mocks/MockERC20.sol";

/// @notice Deploy VaultAgentDesk on Arc (or local anvil with mock USDC).
contract DeployAgentDesk is Script {
    address constant ARC_USDC = 0x3600000000000000000000000000000000000000;

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        uint256 chainId = block.chainid;

        address usdc = ARC_USDC;
        if (chainId == 31337) {
            vm.startBroadcast(pk);
            MockERC20 mock = new MockERC20("USD Coin", "USDC", 6);
            mock.mint(deployer, 1_000_000e6);
            usdc = address(mock);
        } else {
            vm.startBroadcast(pk);
        }

        VaultAgentDesk desk = new VaultAgentDesk(usdc, deployer);

        // Seed vault #0: deployer is curator + agent so demos can propose on-chain.
        uint256 id = desk.registerVault(deployer, -100, 100, 15);

        vm.stopBroadcast();

        console2.log("chainId", chainId);
        console2.log("deployer", deployer);
        console2.log("usdc", usdc);
        console2.log("agentDesk", address(desk));
        console2.log("agentFee", desk.AGENT_FEE());
        console2.log("seedVaultId", id);
    }
}
