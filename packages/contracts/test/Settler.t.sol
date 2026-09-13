// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {PairbandLaunchpad} from "../src/launch/PairbandLaunchpad.sol";
import {PairbandSettler} from "../src/launch/PairbandSettler.sol";
import {PairbandToken} from "../src/launch/PairbandToken.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockMessenger} from "./mocks/MockMessenger.sol";

contract SettlerTest is Test {
    MockERC20 usdc;
    MockMessenger messenger;
    PairbandLaunchpad pad;
    PairbandSettler settler;
    address alice = address(0xA11CE);

    function setUp() public {
        usdc = new MockERC20("USD Coin", "USDC", 6);
        messenger = new MockMessenger(address(usdc));
        pad = new PairbandLaunchpad(address(usdc), address(this), 80e6, 80e6, 1_000_000_000 ether);
        settler = new PairbandSettler(address(usdc), address(pad), address(messenger), address(messenger));
        usdc.mint(alice, 1_000e6);
        vm.prank(alice);
        usdc.approve(address(pad), type(uint256).max);
        vm.prank(alice);
        pad.create("Paper", "PAPER");
    }

    function testIngestThenSettleBuy() public {
        messenger.ingestMint(address(settler), alice, 10e6, 6); // Base
        bytes32 id = settler.creditId(6, 1);
        uint256 before = PairbandToken(pad.getLaunch(0).token).balanceOf(alice);
        vm.prank(alice);
        uint256 out = settler.settleBuy(id, 0, 0);
        assertGt(out, 0);
        assertEq(PairbandToken(pad.getLaunch(0).token).balanceOf(alice), before + out);
        vm.expectRevert(PairbandSettler.AlreadySpent.selector);
        vm.prank(alice);
        settler.settleBuy(id, 0, 0);
    }

    function testUnknownDomainReverts() public {
        vm.expectRevert(PairbandSettler.UnknownDomain.selector);
        messenger.ingestMint(address(settler), alice, 1e6, 99);
    }

    function testOnlyMessengerIngests() public {
        vm.expectRevert(PairbandSettler.NotMessenger.selector);
        settler.ingest(alice, 1e6, 6, 9);
    }

    function testBridgeOutBurns() public {
        vm.prank(alice);
        usdc.approve(address(settler), 5e6);
        uint256 supplyBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        settler.bridgeOut(0, 5e6, bytes32(uint256(uint160(alice))));
        assertEq(usdc.balanceOf(alice), supplyBefore - 5e6);
        assertEq(usdc.balanceOf(address(messenger)), 5e6);
    }

    function testBridgeOutSameDomainReverts() public {
        vm.prank(alice);
        usdc.approve(address(settler), 1e6);
        vm.expectRevert(PairbandSettler.SameDomain.selector);
        vm.prank(alice);
        settler.bridgeOut(26, 1e6, bytes32(uint256(uint160(alice))));
    }
}
