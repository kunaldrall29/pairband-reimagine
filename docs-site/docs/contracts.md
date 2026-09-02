---
sidebar_position: 6
title: Contracts
description: On-chain addresses for Pairband on Arc testnet and mainnet readiness.
---

# Contracts

Addresses are sourced from **`packages/config/deployments.json`**.

:::tip Arc Testnet live
Launchpad, settler, and AMM factory are deployed on Arc Testnet (`5042002`). Verify on [Arcscan](https://testnet.arcscan.app).
:::

## Arc Testnet — chain `5042002`

| Field | Value |
| --- | --- |
| Network | Arc Testnet |
| RPC | `https://rpc.testnet.arc.io` |
| Explorer | [testnet.arcscan.app](https://testnet.arcscan.app) |
| USDC | `0x3600000000000000000000000000000000000000` |
| Deployer (ops) | `0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23` |
| Graduate at | `$80 USDC` (`80000000` on-chain) |
| **Launchpad** | [`0x0f2c604DB770E2E0a68Fc447E33C66BCB0E8E2e0`](https://testnet.arcscan.app/address/0x0f2c604DB770E2E0a68Fc447E33C66BCB0E8E2e0) |
| **Settler** | [`0x1D117354187FD5719201B77b04467EB5f3733A91`](https://testnet.arcscan.app/address/0x1D117354187FD5719201B77b04467EB5f3733A91) |
| **AMM factory** | [`0x11E21E0d87b6d8f697B34bF1fA1B923dc2e65670`](https://testnet.arcscan.app/address/0x11E21E0d87b6d8f697B34bF1fA1B923dc2e65670) |

## Arc Mainnet — chain `5042`

| Field | Value |
| --- | --- |
| Network | Arc |
| RPC | `https://rpc.arc.network` |
| Explorer | [arcscan.app](https://arcscan.app) |
| USDC | `0x3600000000000000000000000000000000000000` |
| **Launchpad** | *Not deployed* (`null`) |
| **Amm factory** | *Not deployed* (`null`) |

:::caution Mainnet
Do **not** broadcast to mainnet until testnet is verified and exercised. Same bytecode as testnet.
:::

## CCTP (Arc)

| Contract | Address |
| --- | --- |
| TokenMessenger | `0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA` |
| CCTP domain | **26** |

## Contract responsibilities

| Contract | Purpose |
| --- | --- |
| `PairbandLaunchpad` | Token creation, curve trading, graduation |
| `PairbandToken` | ERC-20; launchpad mints; burns on curve sell |
| `PairbandAmmFactory` | Deploys locked pairs at graduation |
| `PairbandPair` | Constant-product pool; LP irreversibly burned |
| `PairbandBook` | On-chain limit order book |
| `PairbandSettler` | CCTP mint recipient and router |

## Related

- [Architecture](./architecture)
- [Security](./security)
- [CCTP](./cctp)
