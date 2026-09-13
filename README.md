# Pairband

Launch in USDC. Any chain in. Settlement on Arc.

Pairband is the Arc launchpad: create a token, fill a USDC bonding curve, graduate into a locked Uniswap-style pair **and** a fully on-chain CLOB. Market orders walk the book (price-time); leftover hits the pair at 0.30%. Limits rest on-chain. LP is burned to 0xdead.

## Architecture

```
create()  →  PairbandToken (minter = launchpad)
buy/sell  →  bonding curve (1.0% protocol + 0.5% creator, USDC)
             └─ at $80 real USDC → PairbandAmmFactory.createPair (LP → 0xdead)
                                   PairbandBook (on-chain CLOB)
buy/sell  →  book match, then PairbandPair.getAmountOut 0.30%
limit     →  rest on PairbandBook; cancel returns escrow
```

Arc Testnet `5042002` and Arc mainnet `5042` share bytecode. Quote and gas are USDC.

## Deployer (ops, not the app)

Address: `0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23`

Fund from [Circle faucet](https://faucet.circle.com). The key lives in `packages/config/deployer.local.json` and is never imported by the web app, never a `VITE_` env var.

```
cd packages/contracts
PRIVATE_KEY=… forge script script/DeployLaunch.s.sol:DeployLaunch \
  --rpc-url https://rpc.testnet.arc.io --broadcast
```

Paste `launchpad` + `ammFactory` into `packages/config/deployments.json` under `5042002`.

## Tests

```
node --experimental-strip-types --test src/lib/engine/launchpad.test.ts
cd packages/contracts && forge test --match-path test/Launchpad.t.sol
```

## This preview

The live UI is a local engine that mirrors the contracts: curve math, Uniswap getAmountOut, LP burn, fees, slippage. Numbers are this book, not a published TVL. Connect-wallet broadcast waits on a funded factory.

No audit. Testnet first. MIT.
