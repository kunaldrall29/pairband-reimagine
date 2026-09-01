---
sidebar_position: 5
title: CCTP
description: Pay USDC from any Circle CCTP chain; settlement and trading stay on Arc.
---

# CCTP — Any chain in, settle on Arc

Pairband uses **Circle CCTP v2** so users can fund trades from Ethereum, Base, Unichain, Arbitrum, Optimism, Solana, and other supported domains without holding Arc USDC upfront.

**Tokens never leave Arc.** Only USDC moves cross-chain; ERC-20 launch tokens are minted and traded natively on Arc.

## Flow

```
Source chain                Arc (domain 26)
─────────────               ─────────────────
User USDC  ──burn──►  TokenMessenger  ──mint──►  PairbandSettler
                                                      │
                                                      ├─► Launchpad (curve buy)
                                                      └─► Book / pair (post-grad)
```

1. User approves USDC on the **source chain**
2. CCTP **burns** source USDC and attestation is relayed
3. Arc **mints** native USDC to **`PairbandSettler`**
4. Settler **routes** into `PairbandLaunchpad` or post-graduation venues
5. User receives tokens or book credit on Arc

**Bridge out** burns Arc USDC and mints on the destination domain — tokens still do not bridge.

## Arc constants

| Parameter | Value |
| --- | --- |
| Arc CCTP domain | **26** |
| TokenMessenger (Arc) | `0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA` |
| USDC on Arc | `0x3600000000000000000000000000000000000000` |
| Settler contract | See [Contracts](./contracts) — filled after deployment |

## Supported source domains (preview)

The app config includes common CCTP sources, for example:

| Chain | Notes |
| --- | --- |
| Ethereum | Fast Transfer eligible |
| Base | Fast Transfer eligible |
| Unichain | Fast Transfer eligible |
| Arbitrum | Standard transfer |
| Optimism | Standard transfer |
| Solana | Domain-specific CCTP flow |

Exact domain IDs and messenger addresses on source chains follow [Circle's CCTP documentation](https://developers.circle.com/stablecoins/cctp). Always verify live addresses before mainnet use.

## Fast vs standard transfer

| Mode | Latency | When |
| --- | --- | --- |
| **Fast Transfer** | Seconds | Supported pairs (e.g. ETH, Base, Unichain → Arc) |
| **Standard** | Minutes | Chains without fast path |

The **preview app** may settle CCTP instantly for demo purposes. Production follows Circle attestation timing.

## Security notes

- Only **`PairbandSettler`** should receive minted USDC from CCTP for protocol routing — verify bytecode and ownership after deploy
- Never paste **private keys** in apps, docs, or env files committed to git
- Test every new domain on **Arc Testnet (`5042002`)** before mainnet

## Related

- [Quickstart](./quickstart) — faucet and first trade
- [Architecture](./architecture) — settler role in the stack
- [Contracts](./contracts) — per-chain address table
