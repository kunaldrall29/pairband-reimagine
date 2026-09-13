# Demo hashes

Fill after `forge script script/Demo.s.sol` on Unichain Sepolia / Anvil.

The preview app runs the same sequence against the local engine (see Activity).

| # | Step | Hash |
| --- | --- | --- |
| 1 | MockUSD1 deploy | _pending broadcast_ |
| 2 | Hook deploy (CREATE2, flags 0x2A40) | _pending broadcast_ |
| 3 | Factory deploy | _pending broadcast_ |
| 4 | createPairband USDC/USD1 | _pending broadcast_ |
| 5 | deposit (LP A) | _pending broadcast_ |
| 6 | swap via PoolManager / Universal Router | _pending broadcast_ |
| 7 | proposeRebalance | _pending broadcast_ |
| 8 | executeRebalance (after delay) | _pending broadcast_ |

Withdraw A is the bonus ninth hash.

Until broadcast, open `/app`, deposit both sides, swap to move slot0, propose, wait the preview delay (15s), execute, withdraw.
