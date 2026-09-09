/** Must match packages/contracts/src/launch/PairbandLaunchpad.sol */
export const WAD = 10n ** 18n;
export const BPS_DENOM = 10_000n;
export const PROTOCOL_FEE_BPS = 100n;
export const CREATOR_FEE_BPS = 50n;
export const AMM_FEE_BPS = 30n;
export const MAX_FEE_BPS = 200n;

export const TOTAL_SUPPLY = 1_000_000_000n * WAD;
export const VIRTUAL_USDC = 80n * WAD;
export const VIRTUAL_TOKENS = 1_000_000_000n * WAD;
export const MIN_LP_TOKENS = 200_000_000n * WAD;
export const GRADUATE_AT = 80n * WAD;
export const MINIMUM_LIQUIDITY = 1_000n;

export const USDC_DECIMALS = 18;
export const TOKEN_DECIMALS = 18;

export const DEMO_USER = "0xA11CE00000000000000000000000000000000A11";
export const TREASURY = "0x7EA5000000000000000000000000000000007EA5";
export const DEAD = "0x000000000000000000000000000000000000dEaD";

export const FAUCET_AMOUNT = 2_000n * WAD;
export const FAUCET_CAP = 50_000n * WAD;
export const DEFAULT_SLIPPAGE_BPS = 50n;

export const ARC_TESTNET_ID = 5042002;
export const ARC_MAINNET_ID = 5042;
export const ARC_USDC = "0x3600000000000000000000000000000000000000";

export const BOOK_MM = "0xB00C00000000000000000000000000000000B00C";
export const DEPLOYER = "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23";

/** One-time token launch registration — paid in native Arc USDC (18 decimals in preview). */
export const LAUNCH_FEE_USDC = 1n * WAD;

/** Per vault rebalance proposal when an on-chain agent is configured (18-decimal preview USDC). */
export const AGENT_FEE_USDC = 25n * (WAD / 100n);

/** Same agent fee for 6-decimal USDC vault wallets (0.25 USDC). */
export const AGENT_FEE_VAULT_USDC = AGENT_FEE_USDC / 1_000_000_000_000n;

/** On-chain Arc USDC amounts (6 decimals) — must match PairbandLaunchpad / PairbandVault. */
export const LAUNCH_FEE_ONCHAIN_USDC = 1_000_000n;
export const AGENT_FEE_ONCHAIN_USDC = 250_000n;
