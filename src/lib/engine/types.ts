export * from "./vaultTypes.ts";

/** Dual graduation: Curve → Stage A (book) → Stage B (locked Uniswap). */
export type LaunchStatus = "curve" | "stage_a" | "stage_b";
export type Side =
  | "buy"
  | "sell"
  | "create"
  | "graduate"
  | "stage_a"
  | "stage_b"
  | "swap"
  | "fill"
  | "limit"
  | "cancel"
  | "bridge";
export type Venue = "curve" | "uniswap" | "book";
export type BookSide = "bid" | "ask";

export type LaunchErrorCode =
  | "ZeroAmount"
  | "Slippage"
  | "BelowMinLp"
  | "InsufficientRealUsdc"
  | "InsufficientBalance"
  | "AlreadyGraduated"
  | "NotGraduated"
  | "BookNotOpen"
  | "CurveClosed"
  | "PriceContinuity"
  | "UnknownLaunch"
  | "InvalidMeta"
  | "InsufficientLiquidity"
  | "FaucetCapped"
  | "NotOwner"
  | "OrderNotFound"
  | "UnknownDomain"
  | "SameDomain"
  | "EscrowCap"
  | "CircuitOpen";

export class LaunchError extends Error {
  code: LaunchErrorCode;
  constructor(code: LaunchErrorCode, message?: string) {
    super(message ?? code);
    this.name = "LaunchError";
    this.code = code;
  }
}

export interface RestingOrder {
  id: number;
  launchId: string;
  owner: string;
  side: BookSide;
  price: bigint;
  remaining: bigint;
  escrow: bigint;
  createdAt: number;
}

export interface Fill {
  orderId: number;
  owner: string;
  side: BookSide;
  price: bigint;
  tokens: bigint;
  usdc: bigint;
}

export interface Book {
  bids: RestingOrder[];
  asks: RestingOrder[];
  nextId: number;
}

export interface Trade {
  id: string;
  launchId: string;
  side: Side;
  account: string;
  usdc: bigint;
  tokens: bigint;
  price: bigint;
  at: number;
  sourceDomain: number;
  destDomain: number;
}

export type LaunchMeta = {
  imageUrl?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  websiteVerified?: boolean;
  twitterVerified?: boolean;
};

export interface Launch {
  id: string;
  token: string;
  curve: string;
  pair: string | null;
  book: string | null;
  name: string;
  symbol: string;
  description: string;
  /** Optional logo as data URL or https URL (client-side / demo). */
  imageUrl?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  websiteVerified?: boolean;
  twitterVerified?: boolean;
  hue: number;
  creator: string;
  createdAt: number;
  status: LaunchStatus;
  virtualUsdc: bigint;
  virtualTokens: bigint;
  realUsdc: bigint;
  tokensSold: bigint;
  reserveUsdc: bigint;
  reserveToken: bigint;
  lpSupply: bigint;
  lpBurned: bigint;
  /** @deprecated Use stageBAt — kept for hydrate compat. */
  graduatedAt: number | null;
  stageAAt: number | null;
  stageBAt: number | null;
  /** Addresses that bought ≥ 1 USDC notional on the curve (excl. creator). */
  uniqueBuyers: string[];
  protocolFees: bigint;
  creatorFees: bigint;
  holders: number;
  volumeUsdc: bigint;
  txCount: number;
  lastTradeAt: number;
}

export interface EngineState {
  chainId: number;
  usdc: Record<string, bigint>;
  remoteUsdc: Record<string, Record<string, bigint>>;
  tokens: Record<string, Record<string, bigint>>;
  launches: Launch[];
  trades: Trade[];
  books: Record<string, Book>;
  created: string[];
  nextId: number;
  cctpNonce: number;
}

export interface LaunchEvent {
  kind: "graduate" | "stage_a" | "stage_b" | "create" | "trade";
  id: string;
  symbol: string;
}

export interface BuyPreview {
  tokensOut: bigint;
  protocol: bigint;
  creator: bigint;
  net: bigint;
  impactBps: number;
  venue: Venue;
  bookUsdc?: bigint;
  ammUsdc?: bigint;
}

export interface SellPreview {
  usdcOut: bigint;
  protocol: bigint;
  creator: bigint;
  net: bigint;
  impactBps: number;
  venue: Venue;
  bookTokens?: bigint;
  ammTokens?: bigint;
}
