---
sidebar_position: 4
title: Business model
description: Launch fees, trading fees, and agent fees — all settled in USDC on Arc.
---

# Business model

Pairband monetizes through **minimal, transparent USDC fees on Arc**. There are no hidden spreads: every charge is quoted before you confirm, and trading fees are enforced in bytecode.

All fees below are denominated in **native Arc USDC** (6 decimals on-chain; the preview engine mirrors the same dollar amounts at 18 decimals).

## Fee overview

| Fee | Amount | When | Paid by | Recipient |
| --- | --- | --- | --- | --- |
| **Launch** | **$1.00 USDC** | Token creation | Creator | Protocol treasury |
| **Curve protocol** | 1.00% | Bonding-curve buy/sell | Trader | Protocol treasury |
| **Curve creator** | 0.50% | Bonding-curve buy/sell | Trader | Token creator |
| **Uniswap pair** | 0.30% | Post-graduation AMM swap | Trader | Pool reserves |
| **Agent proposal** | **$0.25 USDC** | Vault rebalance proposal | Licensed agent | Protocol treasury |
| **Code cap** | 2.00% max | — | — | Hard limit in contracts |

Launch and agent fees are **flat USDC charges** — not percentage skim — so small creators and vaults know the exact cost up front.

## Launch fee

Creating a token on Pairband costs **$1 USDC** on Arc (`LAUNCH_FEE = 1e6` in the launchpad). This covers:

- On-chain registration and metadata anchoring
- Anti-spam gatekeeping without KYC
- Indexing and discover feed placement

The fee is deducted from the creator’s Arc USDC balance at launch. If you also make a first buy, you need **launch fee + buy size + curve fees** in the same wallet.

:::tip Live on Arc testnet
The launchpad charges `LAUNCH_FEE = 1e6` (\$1 USDC) in `create()`. Connected wallets approve USDC, then broadcast create — the fee is pulled to the on-chain treasury. The preview engine mirrors the same \$1 debit locally.
:::

## Trading fees

### Bonding curve (pre-graduation)

Every curve trade pays:

- **1.0%** to the protocol
- **0.5%** to the token creator

Both are taken in **USDC** before reserves update. Failed swaps revert with **no fee**.

### After graduation

Market orders route **book → AMM**. The Uniswap-style pair charges **0.30%** on the input token; liquidity stays in the pool. LP tokens are **burned** at graduation — there is no withdrawLiquidity escape hatch.

See [Trading](./trading.md) for venue routing detail.

## Agent fees (vaults)

Concentrated-liquidity vaults can designate an **on-chain agent** address. When `policy.agent` is set:

- Only the **agent** or **curator** may call `proposeRebalance`
- Each **agent-initiated proposal** costs **$0.25 USDC** on Arc, paid from the agent’s USDC balance
- The curator still **executes** after the proposal delay — the agent proposes; humans or multisigs approve by executing

Curator-initiated proposals do **not** incur the agent fee. This aligns incentives: automation pays per signal; discretionary curator moves stay free aside from gas.

Agent fees route to the vault **protocol fee recipient** (same treasury family as launch fees).

## Where fees go

| Stream | Default recipient |
| --- | --- |
| Launch fee | `0x7EA5…7EA5` protocol treasury (testnet) |
| Curve protocol fee | Protocol treasury |
| Curve creator fee | Token creator wallet |
| Agent fee | Protocol fee recipient on the vault |
| AMM fee | Locked pool reserves |

Treasury addresses are published in [Contracts](./contracts.md) per network.

## Why USDC on Arc

Arc is the **settlement layer** for Pairband:

- USDC is the quote asset for every launch
- CCTP v2 mints Arc USDC when traders bridge in from ETH, Base, Solana, and other domains
- Flat fees in USDC avoid volatile gas-token accounting and match how creators think about launch cost

## What Pairband does not charge

- **No subscription** for browsing or paper trading in preview
- **No withdrawal fee** on demo faucet USDC
- **No LP management fee** after graduation (LP is dead)
- **No fee on failed transactions**

## Example: creator launch + first buy

1. Creator connects wallet with **$11 USDC** on Arc
2. Pays **$1 launch fee** → treasury
3. First buy **$10 USDC** on curve → ~1.5% trading fees inside the quote
4. Token appears in Discover; creator earns **0.5%** on all future curve volume until graduation

## Roadmap

- ~~On-chain launch fee in `PairbandLaunchpad.create`~~ — **live** on Arc testnet (`LAUNCH_FEE = 1e6`)
- ~~Agent fee on `proposeRebalance` when `policy.agent` is set~~ — **in vault bytecode** (`AGENT_FEE = 2.5e5`)
- Optional creator fee share buyback — not live; curve creator fee is the current creator revenue

Questions? See [FAQ](./faq.md) or open an issue on GitHub.
