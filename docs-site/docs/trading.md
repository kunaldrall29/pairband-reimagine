---
sidebar_position: 4
title: Trading
description: Market and limit orders, venue routing, fees, and UI chips.
---

# Trading

Pairband exposes **one buy/sell flow** that routes to the correct venue based on token status. Limits are a separate path onto the on-chain book after graduation.

## Venues at a glance

| Token status | Buy / sell routes through | Price discovery |
| --- | --- | --- |
| `curve` | Virtual x·y=k bonding curve | Curve reserves (80 USDC × 1B tokens) |
| `graduated` | `PairbandBook` → `PairbandPair` | CLOB price-time, then AMM `getAmountOut` |

You do not pick the venue manually — the launchpad/router selects it from on-chain state.

## Market orders

### On the curve

- Pay **USDC** to receive tokens (buy) or send tokens to receive USDC (sell)
- Slippage is bonding-curve slippage; check the quote before confirming
- Fees (USDC): **1.0% protocol** + **0.5% creator**

### After graduation

Market flow:

1. **Match the book** — walk resting limits at best price, FIFO at each level
2. **AMM fallback** — residual size swaps against the locked pair at **0.30%**

The Uniswap-style pair uses constant-product math with fee taken from input; liquidity cannot be withdrawn (LP burned).

## Limit orders

Available only when `status == graduated`:

| Side | Escrow | Behavior |
| --- | --- | --- |
| **Bid** | USDC | Rests on `PairbandBook`; fills when a sell crosses your price |
| **Ask** | Tokens | Rests on `PairbandBook`; fills when a buy crosses your price |

- **Cancel** — returns unfilled escrow to the maker
- **Partial fills** — supported; remainder stays on book
- **Ordering** — price-time via on-chain linked list (no centralized matcher)

## Fees summary

| Venue | Fee | Paid in | Notes |
| --- | --- | --- | --- |
| Token launch | $1.00 flat | USDC on Arc | One-time at create — see [Business model](./business-model.md) |
| Bonding curve | 1.0% protocol + 0.5% creator | USDC | Skimmed on curve trades |
| Uniswap pair | 0.30% | Input token | Stays in pool reserves |
| Vault agent proposal | $0.25 flat | USDC on Arc | When `policy.agent` is set |
| Code cap | 2.00% max | — | No fee charged on failed swap |

Full economics (treasury routing, agent incentives, examples): **[Business model](./business-model.md)**.

## UI chips (preview app)

The preview surfaces venue and state with small labels — useful when demoing:

| Chip | Meaning |
| --- | --- |
| **Curve** | Token still on bonding curve; graduation not reached |
| **Graduated** | LP locked; book + AMM active |
| **Book** | Last fill or route touched the CLOB |
| **AMM** | Residual routed to the locked pair |
| **CCTP** | Cross-chain USDC settlement in progress or completed |

Chips reflect **routing intent** in the preview engine; on-chain, read `status` and events from the launchpad and book contracts.

## Slippage and failed swaps

- Set a **minimum out** (or maximum in) consistent with your tolerance
- If the swap would exceed the fee cap or violate `k`, the transaction **reverts with no fee**
- Post-graduation, large market orders may walk multiple book levels before hitting the AMM — simulate or quote when possible

## Related

- [Architecture](./architecture) — graduation and contract roles
- [CCTP](./cctp) — funding Arc USDC from other chains
- [Contracts](./contracts) — addresses per chain
