---
sidebar_position: 3
title: Architecture
description: Bonding curve, graduation, locked AMM, and on-chain CLOB on Arc.
---

# Architecture

Pairband splits the lifecycle of every token into three on-chain venues: **curve**, **AMM**, and **book**.

```
create()  →  PairbandToken (minter = launchpad)
buy/sell  →  bonding curve (1.0% protocol + 0.5% creator, USDC)
             └─ at $80 real USDC → PairbandAmmFactory.createPair (LP → 0xdead)
                                   PairbandBook (on-chain CLOB)
buy/sell  →  book match, then PairbandPair.getAmountOut (0.30%)
limit     →  rest on PairbandBook; cancel returns escrow
```

## Core contracts

| Contract | Role |
| --- | --- |
| `PairbandLaunchpad` | `create()`, curve buy/sell, graduation trigger |
| `PairbandToken` | ERC-20; minter restricted to launchpad until graduation rules apply |
| `PairbandAmmFactory` | Deploys `PairbandPair` at graduation |
| `PairbandPair` | Constant-product AMM (Uniswap v2-style `getAmountOut`, 0.30% fee) |
| `PairbandBook` | On-chain CLOB — escrowed bids/asks, price-time linked list |
| `PairbandSettler` | CCTP inbox — receives minted Arc USDC and routes to launchpad/book |

Arc Testnet (`5042002`) and Arc Mainnet (`5042`) share **identical bytecode**. Quote and gas are USDC.

## Phase 1 — Bonding curve

While `status == curve`:

- Virtual reserves: **80 USDC × 1,000,000,000 tokens** (x·y=k)
- Buys increase USDC reserve and decrease token reserve; sells do the reverse
- Fees skimmed in USDC: **1.0% protocol**, **0.5% creator**
- Graduation threshold: **$80 USDC** (`80000000` with 6 decimals) raised on the curve

The curve is the only venue until graduation. Slippage follows the bonding curve math, not the AMM.

## Phase 2 — Graduation

When cumulative USDC raised reaches the threshold, the **graduating buy**:

1. Moves remaining token inventory + USDC into a new pair
2. Calls `PairbandAmmFactory.createPair`
3. Mints LP tokens and transfers them to **`0x000000000000000000000000000000000000dEaD`**
4. Initializes `PairbandBook` for that market

There is **no `removeLiquidity`** path for burned LP. Liquidity is permanently locked.

## Phase 3 — Book + AMM

After graduation, **one ticket** handles routing:

### Market orders

1. Walk **`PairbandBook`** at price-time priority (linked-list order book)
2. Any unfilled size hits **`PairbandPair`** via `getAmountOut` at **0.30%** swap fee
3. `k` is conserved after the fee; no fee on failed swaps (cap **2.00%** in code)

### Limit orders

- Rest on-chain with escrowed USDC (bids) or tokens (asks)
- **Cancel** returns the remainder to the maker
- No off-chain matcher — Arc's ~0.5s finality and USDC gas make resting orders practical

## Cross-chain settlement

Deposits from other chains never wrap tokens onto Arc. **CCTP** mints native Arc USDC into `PairbandSettler`, which forwards into the launchpad or book. Withdrawals burn Arc USDC and mint on the destination domain.

Details: [CCTP](./cctp).

## Configuration source of truth

Per-chain addresses and RPC endpoints live in the monorepo at `packages/config/deployments.json`. The docs site references those values; when `launchpad` or `ammFactory` is `null`, on-chain mode is not yet wired for that chain.

See [Contracts](./contracts).
