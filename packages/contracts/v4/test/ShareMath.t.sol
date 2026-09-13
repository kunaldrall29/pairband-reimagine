// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ShareMath} from "../src/libraries/ShareMath.sol";

contract ShareMathTest {
    function testFirstDepositSharesEqLiquidity() public pure {
        uint256 shares = ShareMath.sharesForLiquidity(1e9, 0, 0);
        assert(shares == 1e9);
    }

    function testProRataFloor() public pure {
        // 100 liq into 1000 liq / 1000 shares → 100 shares
        uint256 shares = ShareMath.sharesForLiquidity(100, 1000, 1000);
        assert(shares == 100);
        // floor: 1 * 3 / 2 = 1
        shares = ShareMath.sharesForLiquidity(1, 3, 2);
        assert(shares == 1);
    }

    function testLiquidityForSharesFloor() public pure {
        uint256 liq = ShareMath.liquidityForShares(1, 3, 100);
        assert(liq == 33);
    }

    function testMulDivCeil() public pure {
        assert(ShareMath.mulDivCeil(1, 1, 2) == 1);
        assert(ShareMath.mulDivCeil(2, 2, 2) == 2);
    }
}
