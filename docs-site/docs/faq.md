---
sidebar_position: 8
title: FAQ
description: Common questions about Pairband, Arc, CCTP, and trading.
---

# FAQ

## General

### What is Pairband?

Pairband is an **Arc launchpad**: launch tokens against a USDC bonding curve, auto-graduate at **$80** into a locked Uniswap-style pool (LP burned) plus an **on-chain order book**.

### Who is this for?

Creators launching tokens on Arc, traders who want CLOB + AMM in one market, and integrators building on CCTP-funded Arc USDC flows.

### Is mainnet live?

**No.** Development targets **Arc Testnet (`5042002`)**. Mainnet chain ID is **`5042`** with the same bytecode, but contracts are not deployed until testnet is verified.

---

## Trading

### What happens at graduation?

When **$80 USDC** is raised on the curve, the system seeds a constant-product pair, **burns LP to `0xdead`**, and enables **`PairbandBook`** for limits.

### Can I remove liquidity after graduation?

**No.** LP is sent to the dead address; there is no admin rug path through standard `removeLiquidity`.

### What's the difference between market and limit?

- **Market** — while on curve, hits bonding math; after graduation, walks the book then the AMM
- **Limit** — post-graduation only; rests on-chain until filled or canceled

### What fees do I pay?

| Phase | Fees |
| --- | --- |
| Launch | $1.00 USDC flat on Arc |
| Curve | 1.0% protocol + 0.5% creator (USDC) |
| AMM | 0.30% on swaps |
| Vault agent | $0.25 USDC per rebalance proposal |

See [Business model](./business-model.md) for treasury routing and examples.

---

## Cross-chain

### Do tokens bridge to Arc?

**No.** Only **USDC** moves via CCTP. Tokens are minted and traded **natively on Arc**.

### Which messenger address on Arc?

`0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA` (TokenMessenger), domain **26**.

---

## Technical

### Where are contract addresses?

In the monorepo: `packages/config/deployments.json`. Launchpad and factory may be **`null`** until deploy completes — see [Contracts](./contracts).

### Why does the preview app work without on-chain factory?

The UI includes a **local engine** that mirrors contract math for demos. On-chain mode activates when addresses are populated and the deployer is funded.

### What chain IDs should I use?

| Network | Chain ID |
| --- | --- |
| Arc Testnet | `5042002` |
| Arc Mainnet | `5042` |

### Is there an audit?

**No third-party audit yet.** See [Security](./security).

---

## Ops

### How do I deploy contracts?

Fund deployer `0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23` from the Circle faucet, run `DeployLaunch.s.sol` on testnet, update `deployments.json`. **Never commit private keys.**

### Where is USDC on Arc?

`0x3600000000000000000000000000000000000000`

---

## Still stuck?

- [Quickstart](./quickstart)
- [Architecture](./architecture)
- [GitHub](https://github.com/pairband/pairband)
