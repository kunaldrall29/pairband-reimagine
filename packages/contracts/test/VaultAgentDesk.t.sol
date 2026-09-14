// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {VaultAgentDesk} from "../src/agent/VaultAgentDesk.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract VaultAgentDeskTest is Test {
    MockERC20 usdc;
    VaultAgentDesk desk;
    address curator = address(0xC0);
    address agent = address(0xA6);
    address stranger = address(0x51);

    function setUp() public {
        usdc = new MockERC20("USDC", "USDC", 6);
        desk = new VaultAgentDesk(address(usdc), address(this));
        usdc.mint(agent, 10e6);
        usdc.mint(curator, 10e6);
        vm.prank(agent);
        usdc.approve(address(desk), type(uint256).max);
    }

    function test_register_and_agent_propose_pays_fee() public {
        vm.prank(curator);
        uint256 id = desk.registerVault(agent, -100, 100, 15);

        uint256 treBefore = usdc.balanceOf(address(this));
        vm.prank(agent);
        desk.propose(id, -80, 120);
        assertEq(usdc.balanceOf(address(this)) - treBefore, desk.AGENT_FEE());

        (,,,, bool active) = desk.getProposal(id);
        assertTrue(active);
    }

    function test_stranger_cannot_propose_when_agent_set() public {
        vm.prank(curator);
        uint256 id = desk.registerVault(agent, -100, 100, 15);
        vm.prank(stranger);
        vm.expectRevert(VaultAgentDesk.NotAgent.selector);
        desk.propose(id, -80, 120);
    }

    function test_execute_after_delay() public {
        vm.prank(curator);
        uint256 id = desk.registerVault(agent, -100, 100, 15);
        vm.prank(agent);
        desk.propose(id, -60, 140);

        vm.prank(curator);
        vm.expectRevert(VaultAgentDesk.DelayPending.selector);
        desk.execute(id);

        vm.warp(block.timestamp + 16);
        vm.prank(curator);
        desk.execute(id);

        (,, int24 lo, int24 hi,,) = desk.getVault(id);
        assertEq(lo, -60);
        assertEq(hi, 140);
    }

    function test_curator_propose_is_free() public {
        vm.prank(curator);
        uint256 id = desk.registerVault(agent, -100, 100, 15);
        uint256 treBefore = usdc.balanceOf(address(this));
        vm.prank(curator);
        desk.propose(id, -50, 150);
        assertEq(usdc.balanceOf(address(this)), treBefore);
    }
}
