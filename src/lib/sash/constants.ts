/** Sash product constants — Solana mainnet USDC + treasury ledger mode */

export const SASH = {
  name: "Sash",
  tagline: "Your logo on event clothes.",
  domain: "buysash.fun",
  handle: "@buysashdot",
  xUrl: "https://x.com/buysashdot",
  siteUrl: "https://buysash.fun",
} as const;

/** Circle USDC on Solana mainnet */
export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const SOLANA_CLUSTER = "mainnet-beta" as const;

export const SOLANA_RPC =
  (typeof process !== "undefined" && process.env.SOLANA_RPC_URL) ||
  "https://api.mainnet-beta.solana.com";

/**
 * Treasury pubkey for escrow when Anchor program is not configured.
 * Set SASH_TREASURY (server) / VITE_SASH_TREASURY (client display) on deploy.
 */
export const TREASURY_PUBKEY =
  (typeof process !== "undefined" && process.env.SASH_TREASURY) ||
  "SashTreasury1111111111111111111111111111111";

export const CLIENT_TREASURY_PUBKEY =
  (typeof import.meta !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).env?.VITE_SASH_TREASURY) ||
  TREASURY_PUBKEY;

export const PLATFORM_FEE_BPS = 500; // 5% on release only
export const CHALLENGE_HOURS = 48;

export const ALLOWED_ITEM_TYPES = [
  "hoodie",
  "tee",
  "dress",
  "tote",
  "cap",
  "jacket",
  "suitcase",
  "laptop",
  "sticker",
] as const;

export type ItemType = (typeof ALLOWED_ITEM_TYPES)[number];

export const OUT_OF_V1 = ["forehead", "tattoo", "underwear"] as const;
