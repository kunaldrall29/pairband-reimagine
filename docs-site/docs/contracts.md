---
sidebar_position: 6
title: Contracts
description: On-chain addresses for Pairband on Arc — placeholders until deployments.json is filled.
---

# Contracts

Addresses are sourced from **`packages/config/deployments.json`** in the Pairband monorepo. Values shown below reflect the current config; **`null` means not yet deployed** on that chain.

:::info Before you integrate
Wait for verified deployment transactions on **Arc Testnet** before hard-coding addresses in production clients. Mainnet (`5042`) uses the same bytecode but should not be treated as live until testnet hashes are published.
:::

## Arc Testnet — chain `5042002`

| Field | Value |
| --- | --- |
| Network | Arc Testnet |
| RPC | `https://rpc.testnet.arc.io` |
| Explorer | [testnet.arcscan.app](https://testnet.arcscan.app) |
| USDC | `0x3600000000000000000000000000000000000000` |
| Deployer (ops) | `0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23` |
| Graduate at | `$80 USDC` (`80000000` — 6 decimals) |
| **Launchpad** | *Pending deploy* (`null`) |
| **Amm factory** | *Pending deploy* (`null`) |
| **Settler** | *Pending deploy* — see repo after `DeployLaunch.s.sol` |

Fund the deployer from the [Circle faucet](https://faucet.circle.com), then broadcast:

```bash
cd packages/contracts
forge script script/DeployLaunch.s.sol:DeployLaunch \
  --rpc-url https://rpc.testnet.arc.io --broadcast
```

Paste returned `launchpad` and `ammFactory` into `deployments.json` under `"5042002"`.

## Arc Mainnet — chain `5042`

| Field | Value |
| --- | --- |
| Network | Arc |
| RPC | `https://rpc.arc.network` |
| Explorer | [arcscan.app](https://arcscan.app) |
| USDC | `0x3600000000000000000000000000000000000000` |
| Deployer (ops) | `0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23` |
| **Launchpad** | *Not deployed* (`null`) |
| **Amm factory** | *Not deployed* (`null`) |

:::caution Mainnet
Do **not** broadcast to mainnet until testnet factory is live, verified, and exercised. Same bytecode as testnet; different chain ID only.
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
| `PairbandToken` | ERC-20 with launchpad-controlled minting |
| `PairbandAmmFactory` | Deploys locked pairs at graduation |
| `PairbandPair` | Constant-product pool; LP irreversibly burned |
| `PairbandBook` | On-chain limit order book |
| `PairbandSettler` | CCTP mint recipient and router |

## Reading live addresses

When integrating programmatically, read `deployments.json` (or your deployed mirror) with null-safe parsing:

```typescript
const cfg = deployments['5042002'];
const launchpad = cfg?.launchpad ?? null;
if (!launchpad) {
  // Fall back to preview engine or disable on-chain writes
}
```

The web app never loads deployer private keys — ops keys live only in local operator config, never as `VITE_` variables.

## Related

- [Architecture](./architecture)
- [Security](./security)
- [CCTP](./cctp)
