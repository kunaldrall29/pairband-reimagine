// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {PairbandLaunchpad} from "../src/launch/PairbandLaunchpad.sol";
import {PairbandPair} from "../src/launch/PairbandPair.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract LaunchpadTest is Test {
    MockERC20 usdc;
    PairbandLaunchpad pad;
    address treasury = address(0x7EA5);
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    uint256 constant GRADUATE = 80e6;
    uint256 constant VUSDC = 80e6;
    uint256 constant VTOK = 1_000_000_000 ether;

    function setUp() public {
        usdc = new MockERC20("USD Coin", "USDC", 6);
        pad = new PairbandLaunchpad(address(usdc), treasury, GRADUATE, VUSDC, VTOK);
        usdc.mint(alice, 10_000e6);
        usdc.mint(bob, 10_000e6);
        vm.prank(alice);
        usdc.approve(address(pad), type(uint256).max);
        vm.prank(bob);
        usdc.approve(address(pad), type(uint256).max);
    }

    function _create() internal returns (uint256 id, address token) {
        vm.prank(alice);
        return pad.create("Helix", "HLX");
    }

    function testCreateSetsVirtualReserves() public {
        (uint256 id,) = _create();
        PairbandLaunchpad.Launch memory l = pad.getLaunch(id);
        assertEq(l.virtualUsdc, VUSDC);
        assertEq(l.virtualTokens, VTOK);
        assertFalse(l.graduated);
        assertEq(l.realUsdc, 0);
    }

    function testBuyMintsAndMovesPrice() public {
        (uint256 id, address token) = _create();
        vm.prank(alice);
        uint256 out = pad.buy(id, 10e6, 0);
        assertGt(out, 0);
        assertEq(MockERC20(token).balanceOf(alice), out); // token is PairbandToken, balanceOf exists
        PairbandLaunchpad.Launch memory l = pad.getLaunch(id);
        assertGt(l.realUsdc, 0);
        assertLt(l.virtualTokens, VTOK);
    }

    function testSellReturnsUsdc() public {
        (uint256 id,) = _create();
        vm.prank(alice);
        uint256 tokens = pad.buy(id, 20e6, 0);
        uint256 before = usdc.balanceOf(alice);
        address token = pad.getLaunch(id).token;
        vm.startPrank(alice);
        PairbandLaunchpad(pad).getLaunch(id); // silence
        // approve token
        (bool ok,) = token.call(abi.encodeWithSignature("approve(address,uint256)", address(pad), tokens));
        require(ok);
        pad.sell(id, tokens / 2, 0);
        vm.stopPrank();
        assertGt(usdc.balanceOf(alice), before);
    }

    function testFeesSplit() public {
        (uint256 id,) = _create();
        uint256 tBefore = usdc.balanceOf(treasury);
        vm.prank(bob);
        pad.buy(id, 10e6, 0);
        assertEq(usdc.balanceOf(treasury) - tBefore, 0.1e6);
        assertEq(usdc.balanceOf(alice), 10_000e6 + 0.05e6);
    }

    function testSlippageReverts() public {
        (uint256 id,) = _create();
        vm.prank(alice);
        vm.expectRevert(PairbandLaunchpad.Slippage.selector);
        pad.buy(id, 5e6, type(uint256).max);
    }

    function testGraduateLocksLp() public {
        (uint256 id,) = _create();
        vm.prank(alice);
        pad.buy(id, 90e6, 0);
        PairbandLaunchpad.Launch memory l = pad.getLaunch(id);
        assertTrue(l.graduated);
        assertTrue(l.pair != address(0));
        uint256 lp = PairbandPair(l.pair).balanceOf(address(0x000000000000000000000000000000000000dEaD));
        assertGt(lp, 0);
        (uint112 r0, uint112 r1) = PairbandPair(l.pair).getReserves();
        assertGt(uint256(r0) * uint256(r1), 0);
    }

    function testBuyAutoGraduatesThenRoutesToAmm() public {
        (uint256 id,) = _create();
        vm.prank(alice);
        pad.buy(id, 40e6, 0);
        assertFalse(pad.getLaunch(id).graduated);
        vm.prank(alice);
        pad.buy(id, 50e6, 0);
        PairbandLaunchpad.Launch memory l = pad.getLaunch(id);
        assertTrue(l.graduated);
        uint256 rUsdc;
        {
            (uint112 r0, uint112 r1) = PairbandPair(l.pair).getReserves();
            rUsdc = PairbandPair(l.pair).token0() == address(usdc) ? r0 : r1;
        }
        vm.prank(bob);
        pad.buy(id, 3e6, 0);
        (uint112 r0b, uint112 r1b) = PairbandPair(l.pair).getReserves();
        uint256 rUsdc2 = PairbandPair(l.pair).token0() == address(usdc) ? r0b : r1b;
        assertGt(rUsdc2, rUsdc);
    }

    function testAmmConservesKMinusFee() public {
        (uint256 id,) = _create();
        vm.prank(alice);
        pad.buy(id, 90e6, 0);
        PairbandLaunchpad.Launch memory l = pad.getLaunch(id);
        (uint112 r0, uint112 r1) = PairbandPair(l.pair).getReserves();
        uint256 k = uint256(r0) * uint256(r1);
        vm.prank(bob);
        pad.buy(id, 2e6, 0);
        (uint112 a, uint112 b) = PairbandPair(l.pair).getReserves();
        assertGe(uint256(a) * uint256(b), k);
    }

    function testStrangerCannotMint() public {
        (uint256 id, address token) = _create();
        (bool ok, bytes memory data) =
            token.call(abi.encodeWithSignature("mint(address,uint256)", bob, 1 ether));
        assertFalse(ok);
        data;
        assertEq(pad.getLaunch(id).tokensSold, 0);
    }

    function testZeroAmountReverts() public {
        (uint256 id,) = _create();
        vm.prank(alice);
        vm.expectRevert(PairbandLaunchpad.ZeroAmount.selector);
        pad.buy(id, 0, 0);
    }

    function testInvalidMetaReverts() public {
        vm.prank(alice);
        vm.expectRevert(PairbandLaunchpad.InvalidMeta.selector);
        pad.create("X", "H");
        vm.prank(alice);
        vm.expectRevert(PairbandLaunchpad.InvalidMeta.selector);
        pad.create("Hello", "bad");
    }

    function testNoRemoveLiquidityOnLocker() public {
        (uint256 id,) = _create();
        vm.prank(alice);
        pad.buy(id, 90e6, 0);
        address pair = pad.getLaunch(id).pair;
        // Pair has no burn() — LP on dead cannot be pulled.
        (bool ok,) = pair.call(abi.encodeWithSignature("burn(address)", alice));
        assertFalse(ok);
    }
}
