# Demo hashes — Arc testnet launchpad

Broadcast on Arc Testnet (`5042002`). Mainnet `5042` stays undeployed until testnet is validated.

| # | Step | Address |
| --- | --- | --- |
| 1 | Deployer / treasury | `0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23` |
| 2 | USDC (Arc) | `0x3600000000000000000000000000000000000000` |
| 3 | Launchpad | `0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4` |
| 4 | Settler | `0x229BD1BcdE44c26E0c7741B46854Ccfb4e54CC40` |
| 5 | AMM factory | `0x0769121558BB51Fb71Edb933010D294D770e6e18` |
| 6 | Graduate at | `80000000` (80 USDC, 6 decimals) |
| 7 | Launch fee | `1000000` ($1 USDC) |
| 8 | Smoke token (launch `0`) | `0x0c070DAD8148295b1E34746635333785Dc2E61DD` (SMOKE · Smoke Pair) |

## Status (verified)

- Launchpad, AMM factory, and settler have bytecode on Arc testnet and respond to views (`launchCount`, `graduateAt`, factory + settler links).
- Deployer holds testnet USDC (gas + fees). Curve vault holds real USDC after buys — no separate factory funding step.
- App defaults: Create / Discover / Trade prefer live Arc txs when a wallet is connected; Discover syncs on-chain launches into the local book.

## Flow under test

1. `create(name, symbol)` → token (minter = launchpad), `$1` USDC fee
2. `buy` / `sell` on bonding curve (protocol + creator fees in USDC)
3. At graduate threshold → AMM pair + burned LP + on-chain book
4. CCTP settler path for cross-domain USDC (ingest / settle)

Ops keys stay in `deployer.local.json` / env — never `VITE_`, never the browser.


## App integrity

- Live create / buy / sell go through the Arc launchpad ABI (6-dec USDC in, 18-dec token amounts).
- Sell slippage is scaled 18→6 before broadcast so curve sells do not revert as Slippage.
- Discover separates on-chain (numeric ids) from local demo seed markets.
- Connected wallets become the active account; faucet USDC is demo-only.
