export const ZERO = "0x0000000000000000000000000000000000000000";
export const DEAD = "0x000000000000000000000000000000000000dEaD";
export const DEMO_USER = "0xA11CE00000000000000000000000000000000A11";
export const DEMO_CURATOR = "0xC04A7000000000000000000000000000000C04A7";
export const DEMO_FACTORY = "0xFACea0000000000000000000000000000000FACE";
export const DEMO_HOOK = "0x0000000000000000000000000000000000002A40";
export const DEMO_POOL_ID = "0x1111111111111111111111111111111111111111111111111111111111111111";
export const DEMO_PROTOCOL = "0x7EA5000000000000000000000000000000007EA5";
export const DEMO_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const DEMO_USD1 = "0x8d0D00000000000000000000000000000008d0D1";
export const DEMO_VAULT = "0xBA2d00000000000000000000000000000000BA2d";
export const MIN_BOOTSTRAP = 1_000n;
export const MIN_DEAD_SHARES = 1_000n;

export class VaultError extends Error {
  code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = "VaultError";
    this.code = code;
  }
}

export type Band = {
  tickLower: number;
  tickUpper: number;
  positionId: number;
  lastRebalanceAt: number;
};

export type Policy = {
  curator: string;
  agent: string;
  maxWidth: number;
  maxShift: number;
  minCooldown: number;
  protocolFeeBps: number;
  performanceFeeBps: number;
  proposalDelay: number;
};

export type Proposal = {
  active: boolean;
  tickLower: number;
  tickUpper: number;
  postedAt: number;
  postedBy?: string;
  proposer?: string;
  amount0Min: bigint;
  amount1Min: bigint;
};

export type SparkPoint = { t: number; tick: number; price: number };

export type ActivityItem = {
  id: string;
  kind: string;
  actor: string;
  detail: string;
  time: number;
  hash: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

export type VaultSnapshot = {
  chainId: number;
  chainName: string;
  vault: string;
  hook: string;
  factory: string;
  poolId: string;
  name: string;
  symbol: string;
  token0: { address: string; symbol: string; name: string; decimals: number };
  token1: { address: string; symbol: string; name: string; decimals: number };
  tickSpacing: number;
  fee: number;
  sqrtPriceX96: bigint;
  tick: number;
  band: Band;
  policy: Policy;
  proposal: Proposal | null;
  totalSupply: bigint;
  totalLiquidity: bigint;
  idle0: bigint;
  idle1: bigint;
  protocolFeeRecipient: string;
  rebalanceUnlockBlock: number;
  blockNumber: number;
  timestamp: number;
  shares: Record<string, string>;
  wallets: Record<string, { t0: string; t1: string }>;
  spark: SparkPoint[];
  activity: ActivityItem[];
  demo: boolean;
};
