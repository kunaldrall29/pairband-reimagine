---
sidebar_position: 2
title: Quickstart
description: Launch, trade, and bridge USDC into Pairband on Arc testnet.
---

# Quickstart

Get from zero to your first curve trade in a few minutes.

## 1. Open the app

Visit [pairband.com](https://pairband.com) (or your local preview). Connect a wallet that supports **Arc Testnet** (`5042002`).

Add Arc Testnet to your wallet if needed:

| Field | Value |
| --- | --- |
| Network name | Arc Testnet |
| RPC URL | `https://rpc.testnet.arc.io` |
| Chain ID | `5042002` |
| Currency | USDC |
| Explorer | [testnet.arcscan.app](https://testnet.arcscan.app) |

## 2. Get testnet USDC

Fund the protocol **deployer** or your wallet from the [Circle faucet](https://faucet.circle.com). Gas and quotes on Arc are USDC — there is no separate native gas token.

Official USDC on Arc:

```
0x3600000000000000000000000000000000000000
```

## 3. Create or buy on a curve

1. **Create** — name, symbol, and optional metadata; the launchpad deploys `PairbandToken` and opens the bonding curve.
2. **Buy** — pay USDC; the curve uses virtual reserves (80 USDC × 1B tokens) until graduation.
3. **Sell** — return tokens for USDC while `status == curve`.

Fees on the curve (paid in USDC):

- **1.0%** protocol
- **0.5%** creator

## 4. Graduate and trade post-curve

When **$80 USDC** is raised on the curve, the next qualifying buy:

1. Transfers remaining tokens + USDC into a new `PairbandPair`
2. Mints LP and sends it to **`0x000000000000000000000000000000000000dEaD`**
3. Opens **`PairbandBook`** for on-chain limit orders

After graduation, the same buy/sell entry points route through the book + locked AMM (0.30% swap fee).

## 5. Pay from another chain (CCTP)

You do not need Arc USDC in your wallet on day one:

1. Choose a supported source chain (Ethereum, Base, Unichain, Arbitrum, Optimism, Solana, etc.)
2. Approve and burn USDC via Circle **CCTP v2**
3. Arc mints USDC into **`PairbandSettler`**, which routes into the launchpad or book

See [CCTP](./cctp) for domain IDs, messenger address, and settlement flow.

## Preview vs on-chain

| Mode | Behavior |
| --- | --- |
| **Preview / local engine** | Mirrors contract math (curve, graduation, Uniswap `getAmountOut`, LP burn, fees). Numbers are illustrative until factory is live. |
| **On-chain (testnet)** | Requires funded deployer and published `launchpad` + `ammFactory` in `deployments.json`. Connect wallet to broadcast. |

:::tip Contract addresses
On-chain addresses are filled in after `DeployLaunch.s.sol` is broadcast. See [Contracts](./contracts) — placeholders are `null` until deployment.
:::

## Useful links

- [Arc Testnet explorer](https://testnet.arcscan.app)
- [Circle faucet](https://faucet.circle.com)
- [Architecture](./architecture)
- [Trading](./trading)
