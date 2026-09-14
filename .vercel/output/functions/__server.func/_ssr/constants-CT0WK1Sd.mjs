//#region node_modules/.nitro/vite/services/ssr/assets/constants-CT0WK1Sd.js
/** Must match packages/contracts/src/launch/PairbandLaunchpad.sol (preview uses 18-dec USDC). */
var WAD = 10n ** 18n;
var BPS_DENOM = 10000n;
var PROTOCOL_FEE_BPS = 100n;
var CREATOR_FEE_BPS = 50n;
var AMM_FEE_BPS = 30n;
var TOTAL_SUPPLY = 1000000000n * WAD;
var VIRTUAL_USDC = 80n * WAD;
var VIRTUAL_TOKENS = 1000000000n * WAD;
var MIN_LP_TOKENS = 150000000n * WAD;
/**
* Testnet dual graduation: Stage A and Stage B fire in the same tx at $80
* so faucet users can see a book. Mainnet MUST NOT ship the $80 constant.
*/
var STAGE_A_USD_TESTNET = 80n * WAD;
var STAGE_A_WALLETS_TESTNET = 1n;
var STAGE_B_USD_TESTNET = 80n * WAD;
var STAGE_B_WALLETS_MIN_TESTNET = 1n;
var STAGE_B_USD_HARD_TESTNET = 80n * WAD;
/** Mainnet freeze defaults (18-dec preview units; on-chain uses 6-dec USDC × 1e6). */
var STAGE_A_USD_MAINNET = 2000n * WAD;
var STAGE_A_WALLETS_MAINNET = 15n;
var STAGE_B_USD_MAINNET = 12000n * WAD;
var STAGE_B_WALLETS_MIN_MAINNET = 25n;
var STAGE_B_USD_HARD_MAINNET = 20000n * WAD;
/** @deprecated Use STAGE_B_USD_* — alias for testnet Stage B threshold. */
var GRADUATE_AT = STAGE_B_USD_TESTNET;
var TREASURY = "0x7EA5000000000000000000000000000000007EA5";
var DEAD = "0x000000000000000000000000000000000000dEaD";
2000n * WAD;
50000n * WAD;
var DEFAULT_SLIPPAGE_BPS = 50n;
var ARC_TESTNET_ID = 5042002;
var ARC_MAINNET_ID = 5042;
var BOOK_MM = "0xB00C00000000000000000000000000000000B00C";
var DEPLOYER = "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23";
/** One-time token launch registration — paid in native Arc USDC (18 decimals in preview). */
var LAUNCH_FEE_USDC = 1n * WAD;
/** Agent proposals — disabled in v1 (parked for v2). */
var AGENT_FEE_USDC = 25n * (WAD / 100n);
/** Same agent fee for 6-decimal USDC vault wallets (0.25 USDC). */
var AGENT_FEE_VAULT_USDC = AGENT_FEE_USDC / 1000000000000n;
/** On-chain Arc USDC amounts (6 decimals) — must match PairbandLaunchpad / PairbandVault. */
var LAUNCH_FEE_ONCHAIN_USDC = 1000000n;
var AGENT_FEE_ONCHAIN_USDC = 250000n;
function stageThresholds(chainId) {
	if (chainId === 5042) return {
		aUsd: STAGE_A_USD_MAINNET,
		aWallets: STAGE_A_WALLETS_MAINNET,
		bUsd: STAGE_B_USD_MAINNET,
		bWalletsMin: STAGE_B_WALLETS_MIN_MAINNET,
		bUsdHard: STAGE_B_USD_HARD_MAINNET
	};
	return {
		aUsd: STAGE_A_USD_TESTNET,
		aWallets: STAGE_A_WALLETS_TESTNET,
		bUsd: STAGE_B_USD_TESTNET,
		bWalletsMin: STAGE_B_WALLETS_MIN_TESTNET,
		bUsdHard: STAGE_B_USD_HARD_TESTNET
	};
}
//#endregion
export { stageThresholds as C, WAD as S, PROTOCOL_FEE_BPS as _, ARC_MAINNET_ID as a, VIRTUAL_TOKENS as b, BPS_DENOM as c, DEFAULT_SLIPPAGE_BPS as d, DEPLOYER as f, MIN_LP_TOKENS as g, LAUNCH_FEE_USDC as h, AMM_FEE_BPS as i, CREATOR_FEE_BPS as l, LAUNCH_FEE_ONCHAIN_USDC as m, AGENT_FEE_USDC as n, ARC_TESTNET_ID as o, GRADUATE_AT as p, AGENT_FEE_VAULT_USDC as r, BOOK_MM as s, AGENT_FEE_ONCHAIN_USDC as t, DEAD as u, TOTAL_SUPPLY as v, VIRTUAL_USDC as x, TREASURY as y };
