// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {BandMath} from "../src/libraries/BandMath.sol";

contract BandMathTest {
    function testAlignDownPositive() public pure {
        assert(BandMath.align(17, 10) == 10);
        assert(BandMath.align(10, 10) == 10);
        assert(BandMath.align(0, 10) == 0);
    }

    function testAlignDownNegative() public pure {
        // -17 / 10 in Solidity truncates toward 0 (= -1), then we subtract 1 → -2, *10 = -20
        assert(BandMath.align(-17, 10) == -20);
        assert(BandMath.align(-10, 10) == -10);
        assert(BandMath.align(-1, 10) == -10);
    }

    function testWidth() public pure {
        assert(BandMath.width(-100, 100) == 200);
    }

    function testShiftL1() public pure {
        // parallel shift of 10 ticks on both edges → 20
        uint256 s = BandMath.shift(-100, 100, -90, 110);
        assert(s == 20);
        // one-sided stretch of 50 → 50
        s = BandMath.shift(-100, 100, -100, 150);
        assert(s == 50);
    }

    function testInRange() public pure {
        assert(BandMath.inRange(0, -100, 100));
        assert(!BandMath.inRange(100, -100, 100)); // exclusive upper
        assert(BandMath.inRange(-100, -100, 100));
        assert(!BandMath.inRange(-101, -100, 100));
    }

    function testValidateBandOk() public pure {
        BandMath.validateBand(-100, 100, 10, 400);
    }

    function testValidateBandTooWide() public {
        try BandMath.validateBand(-500, 500, 10, 400) {
            assert(false);
        } catch {}
    }

    function testValidateBandUnaligned() public {
        try BandMath.validateBand(-101, 100, 10, 400) {
            assert(false);
        } catch {}
    }
}
