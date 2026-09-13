# Uniswap v4 hackathon feedback

Submitted as https://developers.uniswap.org/hackathon-feedback (paste this URL).

## HookMiner DX

Mining a 14-bit flag mask with CREATE2 is the right model. The pain is the constructor-time `validateHookAddress`: you cannot `new Hook()` in a test without also running HookMiner, and a one-bit typo in `getHookPermissions` fails at deploy with a generic revert. A `HookMiner.find` that takes the Permissions struct (not a raw uint160) would kill a class of production bugs. Document the flag table next to `IHooks` with the exact bit indexes — we copied them into `HookFlags.PAIRBAND_FLAGS = 0x2A40` because that mapping is easy to get wrong.

## PositionManager action encoding

`modifyLiquidities(bytes, deadline)` with packed `Actions` + `bytes[] params` is powerful and easy to mis-order. We routed liquidity through `PoolManager.unlock` + `modifyLiquidity` with a vault-owned salt instead, and kept PositionManager on the hook so a future path can `notifyOperate` + PM. The docs should show a full MINT → SETTLE_PAIR → TAKE_PAIR example with the exact `uint8` action codes and the `amountMin` positions. A typed helper (`Planner.mint(...).settlePair().encode()`) in v4-periphery is the right shape; we still hit “wrong params length” once.

## Sepolia token plumbing

Unichain Sepolia USDC at `0x31d0220469e10c4E71834a79b1f276d740d3768F` is a 6-dec Circle token — good. There is no canonical second stable, so Pairband ships `MockUSD1` (6 decimals) so share math is honest. A documented Unichain Sepolia faucet + a second official mock stable would save every LP-vault team a day. StateView / Quoter addresses in the official Unichain docs must stay the source of truth; we re-verified against the spec in this repo before writing `deployments.json`.

## Docs gaps

- `beforeAddLiquidity` `sender` is the locker (PositionManager), not the user. This is mentioned, not loud enough. Vault teams will write `require(sender == vault)` and brick PM-routed liquidity.
- afterSwap’s `(bytes4, int128)` return with `AFTER_SWAP_RETURNS_DELTA` unset must be `0`. A single sentence in the hook template would help.
- Protocol fee vs LP fee vs hook fee override: we needed to be sure Pairband takes **zero** swap-flow cut. A “fees we do not touch” section would have confirmed it faster.

Pairband’s afterSwap writes nothing and returns 0 delta. The gate is the product.
