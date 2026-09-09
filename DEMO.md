# Demo hashes — Arc testnet launchpad

Broadcast `DeployLaunch.s.sol` on Arc Testnet (`5042002`). Same bytecode targets mainnet `5042` later — do not mainnet until these are verified.

| # | Step | Address / tx |
| --- | --- | --- |
| 1 | Deployer | `0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23` |
| 2 | USDC (Arc) | `0x3600000000000000000000000000000000000000` |
| 3 | Launchpad | `0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4` |
| 4 | Settler | `0x229BD1BcdE44c26E0c7741B46854Ccfb4e54CC40` |
| 5 | AMM factory | `0x0769121558BB51Fb71Edb933010D294D770e6e18` |
| 6 | Graduate at | `80000000` (80 USDC, 6 decimals on-chain) |
| 7 | create PAPERX | [`0x0ea8df4a…e500`](https://testnet.arcscan.app/tx/0x0ea8df4a9fc1eb271edc96b50b26ae34d6430d47d277b7ba61046c6c7476e500) |
| 8 | buy $10 USDC | [`0x5b8bf818…f916`](https://testnet.arcscan.app/tx/0x5b8bf81857e3a6775ff142b9d21e05db304fe9e07ecade47a6339535b7d6f916) |

Explorer: [testnet.arcscan.app](https://testnet.arcscan.app)

## Flow under test

1. `create(name, symbol)` → PairbandToken (minter = launchpad)
2. `buy` / `sell` on bonding curve (1.0% protocol + 0.5% creator); sells burn returned inventory
3. At graduate threshold → `PairbandAmmFactory.createPair`, LP → `0xdead`, `PairbandBook` opens
4. Market walks book then Uniswap residual (0.30%); limits rest / cancel returns escrow
5. CCTP: source `depositForBurn` → Settler `ingest` / `settleBuy` (preview may simulate)

## Preview vs live

The in-app engine mirrors the math for demos without a wallet. With a connected wallet on Arc testnet and USDC approval, Trade / Create can broadcast to the addresses above.

Ops private key stays in `deployer.local.json` / env — never `VITE_`, never the browser.
