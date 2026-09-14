/** Must match packages/contracts/src/launch/PairbandLaunchpad.sol (preview uses 18-dec USDC). */
export const WAD = 10n ** 18n;
export const BPS_DENOM = 10_000n;
export const PROTOCOL_FEE_BPS = 100n;
export const CREATOR_FEE_BPS = 50n;
export const AMM_FEE_BPS = 30n;
export const BOOK_TAKER_FEE_BPS = 10n;
export const MAX_FEE_BPS = 200n; // fee cap in bytecode — 2.00%

export const TOTAL_SUPPLY = 1_000_000_000n * WAD;
/** ~85% for sale on curve; ~15% reserved for Stage B LP (Pump/LaunchLab-style handoff). */
export const TOKENS_FOR_SALE_BPS = 8500n;
export const TOKENS_FOR_LP_BPS = 1500n;
export const VIRTUAL_USDC = 80n * WAD;
export const VIRTUAL_TOKENS = 1_000_000_000n * WAD;
export const MIN_LP_TOKENS = 150_000_000n * WAD; // ~15% reserved for LP
export const TOKENS_RESERVED_FOR_LP = MIN_LP_TOKENS;

/**
 * Testnet dual graduation: Stage A and Stage B fire in the same tx at $80
 * so faucet users can see a book. Mainnet MUST NOT ship the $80 constant.
 */
export const STAGE_A_USD_TESTNET = 80n * WAD;
export const STAGE_A_WALLETS_TESTNET = 1n;
export const STAGE_B_USD_TESTNET = 80n * WAD;
export const STAGE_B_WALLETS_MIN_TESTNET = 1n;
export const STAGE_B_USD_HARD_TESTNET = 80n * WAD;

/** Mainnet freeze defaults (18-dec preview units; on-chain uses 6-dec USDC × 1e6). */
export const STAGE_A_USD_MAINNET = 2_000n * WAD;
export const STAGE_A_WALLETS_MAINNET = 15n;
export const STAGE_B_USD_MAINNET = 12_000n * WAD;
export const STAGE_B_WALLETS_MIN_MAINNET = 25n;
export const STAGE_B_USD_HARD_MAINNET = 20_000n * WAD;

/** @deprecated Use STAGE_B_USD_* — alias for testnet Stage B threshold. */
export const GRADUATE_AT = STAGE_B_USD_TESTNET;

export const MINIMUM_LIQUIDITY = 1_000n;
/** Circuit breaker: single-block net USDC flow > 30% of vault+pool disables new limits for N blocks. */
export const CIRCUIT_FLOW_BPS = 3000n;
export const CIRCUIT_DISABLE_BLOCKS = 50n;
/** One address may not rest more than 20% of that market’s escrowed USDC. */
export const BOOK_ESCROW_CAP_BPS = 2000n;

export const USDC_DECIMALS = 18;
export const TOKEN_DECIMALS = 18;
export const ONCHAIN_USDC_DECIMALS = 6;

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

/** Agent proposals — disabled in v1 (parked for v2). */
export const AGENT_FEE_USDC = 25n * (WAD / 100n);
export const AGENT_FEE_ENABLED = false;

/** Same agent fee for 6-decimal USDC vault wallets (0.25 USDC). */
export const AGENT_FEE_VAULT_USDC = AGENT_FEE_USDC / 1_000_000_000_000n;

/** On-chain Arc USDC amounts (6 decimals) — must match PairbandLaunchpad / PairbandVault. */
export const LAUNCH_FEE_ONCHAIN_USDC = 1_000_000n;
export const AGENT_FEE_ONCHAIN_USDC = 250_000n;

export type StageThresholds = {
  aUsd: bigint;
  aWallets: bigint;
  bUsd: bigint;
  bWalletsMin: bigint;
  bUsdHard: bigint;
};

export function stageThresholds(chainId: number): StageThresholds {
  if (chainId === ARC_MAINNET_ID) {
    return {
      aUsd: STAGE_A_USD_MAINNET,
      aWallets: STAGE_A_WALLETS_MAINNET,
      bUsd: STAGE_B_USD_MAINNET,
      bWalletsMin: STAGE_B_WALLETS_MIN_MAINNET,
      bUsdHard: STAGE_B_USD_HARD_MAINNET,
    };
  }
  return {
    aUsd: STAGE_A_USD_TESTNET,
    aWallets: STAGE_A_WALLETS_TESTNET,
    bUsd: STAGE_B_USD_TESTNET,
    bWalletsMin: STAGE_B_WALLETS_MIN_TESTNET,
    bUsdHard: STAGE_B_USD_HARD_TESTNET,
  };
}
