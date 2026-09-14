---
sidebar_position: 5
title: Vault agent
description: How to use the live vault agent on Arc and the AI launch draft.
---

# Vault agent

The vault agent is **live on Arc testnet**. It proposes a new concentrated-liquidity band; the named curator executes after a short delay.

## Fee

| Action | Fee |
| --- | --- |
| Agent propose | **$0.25 USDC** (on-chain desk + app demo) |
| Curator execute / reject | Free |

On-chain desk: `VaultAgentDesk` at [`0x9BedBFc897d4f90E92389818edDC968f99Da5563`](https://testnet.arcscan.app/address/0x9BedBFc897d4f90E92389818edDC968f99Da5563).

## What you can do

1. **Propose** a suggested band (agent) — ticks are computed deterministically, never by an LLM.
2. **Execute or reject** after the delay (curator).
3. **Deposit / withdraw** as an LP and watch the band move.

Open the desk in the app: **Agent** in the nav, or `/app/curator`.

## How to use (app)

1. Open **Agent** and choose **Act as agent**.
2. Click **Propose suggested band** ($0.25 USDC fee).
3. Switch to **Act as curator**. Wait for the proposal delay.
4. Click **Execute rebalance** (or **Reject**).
5. As LP, deposit USDC + USD1, then open the vault detail page.

## Create with AI draft

On **Launch** (`/app/create`), describe a token idea and generate a name, symbol, and description. Review the draft, then confirm — nothing launches until you submit. If Grok is configured it drafts with the model; otherwise a local fallback fills the form.

## Related

- [Contracts](./contracts)
- [Business model](./business-model)
- [Quickstart](./quickstart)
