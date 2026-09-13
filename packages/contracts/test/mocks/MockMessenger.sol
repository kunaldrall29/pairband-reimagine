// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {MockERC20} from "./MockERC20.sol";
import {PairbandSettler} from "../../src/launch/PairbandSettler.sol";

/// @notice Test stand-in for CCTP TokenMessengerV2 + mint-to-settler.
contract MockMessenger {
    MockERC20 public usdc;
    uint64 public nonce;

    constructor(address usdc_) {
        usdc = MockERC20(usdc_);
    }

    function ingestMint(address settler, address account, uint256 amount, uint32 sourceDomain) external {
        usdc.mint(settler, amount);
        nonce += 1;
        PairbandSettler(settler).ingest(account, amount, sourceDomain, nonce);
    }

    function depositForBurn(
        uint256 amount,
        uint32,
        bytes32,
        address burnToken,
        bytes32,
        uint256,
        uint32
    ) external returns (uint64) {
        // Burn: pull from settler (already approved) and retire.
        require(MockERC20(burnToken).transferFrom(msg.sender, address(this), amount), "pull");
        nonce += 1;
        return nonce;
    }
}
