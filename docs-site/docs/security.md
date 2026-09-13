---
sidebar_position: 7
title: Security
description: Audit status, testnet-first policy, and operational key rules for Pairband.
---

# Security

Pairband is **experimental software**. Read this before deploying capital or integrating the protocol.

## Audit status

| Item | Status |
| --- | --- |
| Professional third-party audit | **None** |
| Testnet deployment | In progress — see [Contracts](./contracts) |
| Mainnet | **Not live** — do not assume production readiness |
| Bug bounty | Not announced |

Treat all contracts as **unaudited**. Use testnet-only funds until audits and verified deployments are published.

## Testnet-first policy

1. Deploy and verify on **Arc Testnet (`5042002`)** first
2. Exercise full flows: create → curve → graduate → book → CCTP deposit
3. Publish transaction hashes and filled `deployments.json`
4. Only then consider mainnet (`5042`) with explicit operator sign-off

The preview app may run a **local engine** that mirrors math but is not on-chain TVL.

## Key operations rules

### Deployer address

Public ops/deployer address (no secret material):

```
0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23
```

### Never do this

- Commit **private keys**, mnemonics, or keystore files to git
- Put operator keys in **`VITE_`** or other browser-exposed env vars
- Import deployer keys into the web application bundle
- Share deployer credentials in documentation, chat, or tickets

Operator keys belong in **local-only** files (e.g. `deployer.local.json`) on secure machines used for `forge script --broadcast`.

### Do this

- Fund deployer from the [Circle faucet](https://faucet.circle.com) on testnet
- Use hardware wallets or CI secrets stores for production deploys
- Verify contract bytecode on [Arcscan](https://testnet.arcscan.app) after deploy
- Rotate any key that was ever exposed

## Protocol risk areas

| Area | Consideration |
| --- | --- |
| **Bonding curve** | Parameterized graduation at $80; creator/protocol fees on curve |
| **Locked LP** | Irreversible — no admin rescue of LP sent to `0xdead` |
| **On-chain book** | Escrow in contract; cancel returns remainder — verify book address |
| **CCTP** | Depends on Circle attestation liveness and correct messenger addresses |
| **Upgradeability** | Confirm whether deployed instances are immutable proxies or admin-upgradeable before trusting |

## Fee and revert behavior

- Maximum fee cap **2.00%** enforced in code
- **Failed swaps pay no fee** (transaction reverts)
- Curve fees: **1.0% protocol + 0.5% creator** in USDC
- AMM fee: **0.30%** retained in pool

## Reporting issues

If you find a vulnerability, contact the Pairband team through your official security channel (GitHub Security Advisories or listed security email). Do not disclose critical issues publicly before coordination.

## Related

- [Contracts](./contracts)
- [FAQ](./faq)
