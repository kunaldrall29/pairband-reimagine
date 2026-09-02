# Pairband

Launch in USDC. Any chain in. Settlement on Arc.

Pairband is the Arc launchpad: create a token, fill a USDC bonding curve, graduate into a locked Uniswap-style pair **and** a fully on-chain CLOB. Market orders walk the book (price-time); leftover hits the pair at 0.30%. Limits rest on-chain. LP is burned to 0xdead.

## Live on Arc Testnet (`5042002`)

| Contract | Address |
| --- | --- |
| Launchpad | [`0x0f2c604DB770E2E0a68Fc447E33C66BCB0E8E2e0`](https://testnet.arcscan.app/address/0x0f2c604DB770E2E0a68Fc447E33C66BCB0E8E2e0) |
| Settler | [`0x1D117354187FD5719201B77b04467EB5f3733A91`](https://testnet.arcscan.app/address/0x1D117354187FD5719201B77b04467EB5f3733A91) |
| AMM factory | [`0x11E21E0d87b6d8f697B34bF1fA1B923dc2e65670`](https://testnet.arcscan.app/address/0x11E21E0d87b6d8f697B34bF1fA1B923dc2e65670) |
| USDC | `0x3600000000000000000000000000000000000000` |

Mainnet (`5042`) uses the same bytecode — do not broadcast until testnet is verified.

## Architecture

```
create()  →  PairbandToken (minter = launchpad)
buy/sell  →  bonding curve (1.0% protocol + 0.5% creator, USDC)
             └─ at $80 real USDC → PairbandAmmFactory.createPair (LP → 0xdead)
                                   PairbandBook (on-chain CLOB)
buy/sell  →  book match, then PairbandPair.getAmountOut 0.30%
limit     →  rest on PairbandBook; cancel returns escrow
```

## Deployer (ops, not the app)

Address: `0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23`

Fund from [Circle faucet](https://faucet.circle.com). The key lives in `packages/config/deployer.local.json` (gitignored) and is never imported by the web app, never a `VITE_` env var.

```
cd packages/contracts
PRIVATE_KEY=… forge script script/DeployLaunch.s.sol:DeployLaunch \
  --rpc-url https://rpc.testnet.arc.io --broadcast
```

Paste `launchpad` + `ammFactory` + `settler` into `packages/config/deployments.json` and `src/lib/wagmi.ts`.

## Sites

| Surface | URL |
| --- | --- |
| App + landing | `https://pairband.com` / `https://app.pairband.com` |
| Docs | `https://docs.pairband.com` |

## Tests

```
node --experimental-strip-types --test src/lib/engine/launchpad.test.ts
cd packages/contracts && forge test --match-path 'test/*.sol'
```

## Preview

The UI includes a local engine that mirrors the contracts for demos without a wallet. Connect a wallet on Arc testnet to broadcast create/buy to the live factory.

No audit. Testnet first. MIT.
