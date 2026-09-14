//#region node_modules/.nitro/vite/services/ssr/assets/constants-BJEdPgzX.js
/** Must match packages/contracts/src/launch/PairbandLaunchpad.sol */
var WAD = 10n ** 18n;
var BPS_DENOM = 10000n;
var PROTOCOL_FEE_BPS = 100n;
var CREATOR_FEE_BPS = 50n;
var AMM_FEE_BPS = 30n;
var TOTAL_SUPPLY = 1000000000n * WAD;
var VIRTUAL_USDC = 80n * WAD;
var VIRTUAL_TOKENS = 1000000000n * WAD;
var MIN_LP_TOKENS = 200000000n * WAD;
var GRADUATE_AT = 80n * WAD;
var DEMO_USER = "0xA11CE00000000000000000000000000000000A11";
var TREASURY = "0x7EA5000000000000000000000000000000007EA5";
var DEAD = "0x000000000000000000000000000000000000dEaD";
var FAUCET_AMOUNT = 2000n * WAD;
var FAUCET_CAP = 50000n * WAD;
var DEFAULT_SLIPPAGE_BPS = 50n;
var ARC_TESTNET_ID = 5042002;
var ARC_MAINNET_ID = 5042;
var BOOK_MM = "0xB00C00000000000000000000000000000000B00C";
var DEPLOYER = "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23";
/** One-time token launch registration — paid in native Arc USDC (18 decimals in preview). */
var LAUNCH_FEE_USDC = 1n * WAD;
/** Per vault rebalance proposal when an on-chain agent is configured (18-decimal preview USDC). */
var AGENT_FEE_USDC = 25n * (WAD / 100n);
/** Same agent fee for 6-decimal USDC vault wallets (0.25 USDC). */
var AGENT_FEE_VAULT_USDC = AGENT_FEE_USDC / 1000000000000n;
/** On-chain Arc USDC amounts (6 decimals) — must match PairbandLaunchpad / PairbandVault. */
var LAUNCH_FEE_ONCHAIN_USDC = 1000000n;
var AGENT_FEE_ONCHAIN_USDC = 250000n;
//#endregion
export { VIRTUAL_TOKENS as C, TREASURY as S, WAD as T, LAUNCH_FEE_ONCHAIN_USDC as _, ARC_MAINNET_ID as a, PROTOCOL_FEE_BPS as b, BPS_DENOM as c, DEFAULT_SLIPPAGE_BPS as d, DEMO_USER as f, GRADUATE_AT as g, FAUCET_CAP as h, AMM_FEE_BPS as i, CREATOR_FEE_BPS as l, FAUCET_AMOUNT as m, AGENT_FEE_USDC as n, ARC_TESTNET_ID as o, DEPLOYER as p, AGENT_FEE_VAULT_USDC as r, BOOK_MM as s, AGENT_FEE_ONCHAIN_USDC as t, DEAD as u, LAUNCH_FEE_USDC as v, VIRTUAL_USDC as w, TOTAL_SUPPLY as x, MIN_LP_TOKENS as y };
