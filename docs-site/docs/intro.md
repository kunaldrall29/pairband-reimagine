---
slug: /
sidebar_position: 1
title: Introduction
description: What Pairband is — the Arc launchpad with USDC bonding curves, locked AMM, and on-chain CLOB.
---

# Introduction

**Pairband is the Arc launchpad:** create a token, fill a USDC bonding curve, graduate into a locked Uniswap-style pair **and** a fully on-chain central limit order book (CLOB).

> **One-liner for judges:** Pay USDC from any CCTP chain, settle on Arc, trade through a bonding curve that graduates at $80 into burned LP + an on-chain order book — tokens never leave Arc.

## What you get

| Phase | What happens |
| --- | --- |
| **Launch** | Creator calls `create()` → `PairbandToken` minted with launchpad as minter |
| **Curve** | Buyers/sellers trade on a virtual x·y=k curve quoted in USDC |
| **Graduate** | At **$80 USDC** raised, inventory + cash seed a constant-product pair; LP sent to `0xdead` |
| **Trade** | Market orders walk the CLOB (price-time), then hit the locked pair at 0.30%; limits rest on-chain |

## Design principles

- **USDC everywhere** — quote asset, gas on Arc, fees on the curve
- **Any chain in** — Circle CCTP v2 burns source USDC and mints on Arc via `PairbandSettler`
- **Tokens stay on Arc** — no bridged ERC-20; settlement is native to the Arc ledger
- **No removable LP** — graduation burns liquidity provider tokens to the dead address
- **Light, readable UI** — paper background, charcoal text, teal accents (see the live app)

## Networks

| Network | Chain ID | Status |
| --- | --- | --- |
| Arc Testnet | `5042002` | **Active development** — deploy and verify here first |
| Arc Mainnet | `5042` | Same bytecode as testnet; **not live** until testnet contracts are funded, deployed, and verified |

:::caution Testnet first
This documentation describes the **real protocol**. The preview app may still use a local engine until factory contracts are funded on testnet. Do not treat mainnet as live without published deployment hashes.
:::

## Next steps

- [Quickstart](./quickstart) — use the app, faucet, and supported chains
- [Architecture](./architecture) — curve → graduate → book + AMM
- [Security](./security) — audit status, ops rules, and key handling
