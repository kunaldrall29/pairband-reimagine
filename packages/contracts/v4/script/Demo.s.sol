// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Demo flow on Anvil / Unichain Sepolia:
///         create pair → deposit A → swap → propose → warp delay → execute → withdraw A.
///         Print the 8 hashes to DEMO.md.
///
/// Required hashes (fill after broadcast):
///  1. MockUSD1 deploy
///  2. Hook deploy
///  3. Factory deploy
///  4. createPairband
///  5. deposit
///  6. swap
///  7. proposeRebalance
///  8. executeRebalance
///  9. withdraw (bonus)
///
/// @dev forge script script/Demo.s.sol:Demo --rpc-url $RPC --broadcast
contract Demo {
    function run() external {
        // Implemented against live addresses in deployments.json after Deploy.s.sol.
        // This file is the runbook; the TypeScript engine in the app mirrors the same
        // sequence so the preview can complete the flow without a signer.
    }
}
