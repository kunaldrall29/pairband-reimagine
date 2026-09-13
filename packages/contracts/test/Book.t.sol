// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {PairbandLaunchpad} from "../src/launch/PairbandLaunchpad.sol";
import {PairbandBook} from "../src/launch/PairbandBook.sol";
import {PairbandToken} from "../src/launch/PairbandToken.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract BookTest is Test {
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

    function _graduate() internal returns (uint256 id, PairbandBook book, PairbandToken tok) {
        vm.prank(alice);
        (id,) = pad.create("Helix", "HLX");
        vm.prank(alice);
        pad.buy(id, 90e6, 0);
        PairbandLaunchpad.Launch memory l = pad.getLaunch(id);
        book = PairbandBook(l.book);
        tok = PairbandToken(l.token);
    }

    function testGraduateDeploysBook() public {
        (, PairbandBook book,) = _graduate();
        assertTrue(address(book) != address(0));
        assertEq(book.bestAsk(), 0);
        assertEq(book.bestBid(), 0);
    }

    function testLimitAskThenMarketBuy() public {
        (uint256 id, PairbandBook book, PairbandToken tok) = _graduate();
        uint256 aliceTok = tok.balanceOf(alice);
        vm.startPrank(alice);
        tok.approve(address(book), type(uint256).max);
        uint128 px = 1e8; // tiny wad price; tokens are 18 dec, usdc 6
        // Use a price near AMM: skip exact, just post 1e20 tokens at a round price
        px = 1e11;
        book.limitAsk(px, 1_000_000 ether);
        vm.stopPrank();
        assertTrue(book.bestAsk() > 0);

        uint256 bobTok = tok.balanceOf(bob);
        vm.prank(bob);
        pad.buy(id, 2e6, 0);
        assertGt(tok.balanceOf(bob), bobTok);
        aliceTok;
    }

    function testCancelReturnsEscrow() public {
        (, PairbandBook book, PairbandToken tok) = _graduate();
        uint256 before = tok.balanceOf(alice);
        vm.startPrank(alice);
        tok.approve(address(book), type(uint256).max);
        uint32 id = book.limitAsk(1e11, 100_000 ether);
        assertLt(tok.balanceOf(alice), before);
        book.cancel(id);
        vm.stopPrank();
        assertEq(tok.balanceOf(alice), before);
    }
}
