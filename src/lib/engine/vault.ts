import { align, shift, validateBand } from "./bandMath.ts";
import { liquidityForShares, mulDivFloor, sharesForLiquidity } from "./shareMath.ts";
import { getSqrtRatioAtTick, getTickAtSqrtRatio, Q96 } from "./tickMath.ts";
import { amountsAtBand, liquidityAtBand, nextSqrtFromInput } from "./liquidity.ts";
import { AGENT_FEE_ENABLED, AGENT_FEE_VAULT_USDC } from "./constants.ts";
import {
  DEAD,
  DEMO_AGENT,
  DEMO_CURATOR,
  DEMO_FACTORY,
  DEMO_HOOK,
  DEMO_POOL_ID,
  DEMO_PROTOCOL,
  DEMO_USDC,
  DEMO_USD1,
  DEMO_USER,
  DEMO_VAULT,
  MIN_BOOTSTRAP,
  MIN_DEAD_SHARES,
  VaultError,
  ZERO,
  type ActivityItem,
  type Band,
  type Policy,
  type Proposal,
  type SparkPoint,
  type VaultSnapshot,
} from "./vaultTypes.ts";

export type EngineState = {
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
  shares: Map<string, bigint>;
  wallets: Map<string, { t0: bigint; t1: bigint }>;
  spark: SparkPoint[];
  activity: ActivityItem[];
  demo: boolean;
  txNonce: number;
};

function now() {
  return Math.floor(Date.now() / 1000);
}

function hash(n: number): string {
  const h = (0x9e3779b9 * (n + 1) * 0x85ebca6b) >>> 0;
  return `0x${h.toString(16).padStart(8, "0")}${(n * 0x27d4eb2d).toString(16).padStart(56, "0")}`.slice(0, 66);
}

function bump(state: EngineState) {
  state.blockNumber += 1;
  state.timestamp = now();
  state.txNonce += 1;
}

function shareOf(state: EngineState, who: string): bigint {
  return state.shares.get(who) ?? 0n;
}

function walletOf(state: EngineState, who: string): { t0: bigint; t1: bigint } {
  return state.wallets.get(who) ?? { t0: 0n, t1: 0n };
}

function mintShares(state: EngineState, to: string, amount: bigint) {
  state.totalSupply += amount;
  state.shares.set(to, shareOf(state, to) + amount);
}

function burnShares(state: EngineState, from: string, amount: bigint) {
  const bal = shareOf(state, from);
  if (bal < amount) throw new VaultError("ZeroAmount", "insufficient shares");
  state.shares.set(from, bal - amount);
  state.totalSupply -= amount;
}

function positionAmounts(state: EngineState): { amount0: bigint; amount1: bigint } {
  return amountsAtBand(
    state.tick,
    state.band.tickLower,
    state.band.tickUpper,
    state.totalLiquidity,
  );
}

function tvl(state: EngineState): { t0: bigint; t1: bigint } {
  const p = positionAmounts(state);
  return { t0: p.amount0 + state.idle0, t1: p.amount1 + state.idle1 };
}

function pushActivity(
  state: EngineState,
  kind: ActivityItem["kind"],
  actor: string,
  detail: string,
  extra?: Partial<ActivityItem>,
) {
  state.activity.unshift({
    id: `${state.txNonce}-${kind}`,
    kind,
    actor,
    hash: hash(state.txNonce),
    time: state.timestamp * 1000,
    detail,
    ...extra,
  });
  if (state.activity.length > 80) state.activity.length = 80;
}

function pushSpark(state: EngineState) {
  state.spark.push({
    t: state.timestamp,
    tick: state.tick,
    price: Math.pow(1.0001, state.tick),
  });
  if (state.spark.length > 120) state.spark.shift();
}

function chargeAgentFee(state: EngineState, agent: string) {
  if (!AGENT_FEE_ENABLED || AGENT_FEE_VAULT_USDC <= 0n) return;
  const w = walletOf(state, agent);
  if (w.t0 < AGENT_FEE_VAULT_USDC) {
    throw new VaultError("InsufficientBalance", "agent fee — need USDC on Arc");
  }
  state.wallets.set(agent, { ...w, t0: w.t0 - AGENT_FEE_VAULT_USDC });
  const treasury = walletOf(state, state.protocolFeeRecipient);
  state.wallets.set(state.protocolFeeRecipient, {
    ...treasury,
    t0: treasury.t0 + AGENT_FEE_VAULT_USDC,
  });
}

export function createDemoState(): EngineState {
  const timestamp = now();
  const policy: Policy = {
    curator: DEMO_CURATOR,
    agent: ZERO,
    maxWidth: 400,
    maxShift: 200,
    minCooldown: 20,
    protocolFeeBps: 50,
    performanceFeeBps: 1000,
    proposalDelay: 15,
  };
  const state: EngineState = {
    chainId: 1301,
    chainName: "Unichain Sepolia",
    vault: DEMO_VAULT,
    hook: DEMO_HOOK,
    factory: DEMO_FACTORY,
    poolId: DEMO_POOL_ID,
    name: "Pairband USDC-USD1",
    symbol: "pb-USDC-USD1",
    token0: { address: DEMO_USDC, symbol: "USDC", name: "USD Coin", decimals: 6 },
    token1: { address: DEMO_USD1, symbol: "USD1", name: "USD1", decimals: 6 },
    tickSpacing: 10,
    fee: 500,
    sqrtPriceX96: getSqrtRatioAtTick(0),
    tick: 0,
    band: { tickLower: -100, tickUpper: 100, positionId: 1, lastRebalanceAt: 0 },
    policy,
    proposal: null,
    totalSupply: 0n,
    totalLiquidity: 0n,
    idle0: 0n,
    idle1: 0n,
    protocolFeeRecipient: DEMO_PROTOCOL,
    rebalanceUnlockBlock: 0,
    blockNumber: 1_842_200,
    timestamp,
    shares: new Map(),
    wallets: new Map([
      [DEMO_USER, { t0: 10_000n * 1_000_000n, t1: 10_000n * 1_000_000n }],
      [DEMO_PROTOCOL, { t0: 0n, t1: 0n }],
    ]),
    spark: [{ t: timestamp - 3600, tick: 0, price: 1 }],
    activity: [],
    demo: true,
    txNonce: 1,
  };

  // Curator seed so the public pool has a live band. Honest $200, not a fake $24M.
  const seed0 = 100n * 1_000_000n;
  const seed1 = 100n * 1_000_000n;
  const w = walletOf(state, DEMO_USER);
  state.wallets.set(DEMO_CURATOR, {
    t0: w.t0 + seed0,
    t1: w.t1 + seed1,
  });
  deposit(state, DEMO_CURATOR, seed0, seed1);
  const last = state.activity[0];
  if (last) last.kind = "Seed";
  last && (last.detail = "Curator seed · 100 USDC + 100 USD1 into the live band");
  return state;
}

export function deposit(state: EngineState, from: string, amount0: bigint, amount1: bigint): { shares: bigint; hash: string } {
  if (amount0 === 0n || amount1 === 0n) throw new VaultError("ZeroAmount", "both tokens required");
  if (state.blockNumber <= state.rebalanceUnlockBlock) {
    throw new VaultError("Locked", "rebalance lock — wait 3 blocks");
  }
  const w = walletOf(state, from);
  if (w.t0 < amount0 || w.t1 < amount1) throw new VaultError("ZeroAmount", "insufficient wallet balance");

  const liq = liquidityAtBand(state.tick, state.band.tickLower, state.band.tickUpper, amount0, amount1);
  if (liq === 0n) throw new VaultError("ZeroAmount", "zero liquidity");

  let shares: bigint;
  if (state.totalSupply === 0n) {
    if (liq < MIN_BOOTSTRAP) throw new VaultError("ZeroAmount", "below MIN_BOOTSTRAP");
    mintShares(state, DEAD, MIN_DEAD_SHARES);
    shares = liq;
  } else {
    shares = sharesForLiquidity(liq, state.totalSupply, state.totalLiquidity);
    if (shares === 0n) throw new VaultError("ZeroAmount", "zero shares");
  }

  state.wallets.set(from, { t0: w.t0 - amount0, t1: w.t1 - amount1 });
  mintShares(state, from, shares);
  state.totalLiquidity += liq;
  bump(state);
  pushActivity(state, "Deposit", from, `PairbandVault.deposit · ${shares} shares`, {
    amount0: amount0.toString(),
    amount1: amount1.toString(),
  });
  return { shares, hash: state.activity[0]!.hash };
}

export function withdraw(state: EngineState, from: string, shares: bigint): { amount0: bigint; amount1: bigint; hash: string } {
  if (shares === 0n) throw new VaultError("ZeroAmount", "zero shares");
  if (state.blockNumber <= state.rebalanceUnlockBlock) {
    throw new VaultError("Locked", "rebalance lock — wait 3 blocks");
  }
  if (shareOf(state, from) < shares) throw new VaultError("ZeroAmount", "insufficient shares");

  const liqOut = liquidityForShares(shares, state.totalSupply, state.totalLiquidity);
  if (liqOut === 0n) throw new VaultError("ZeroAmount", "zero liquidity out");
  const pos = amountsAtBand(state.tick, state.band.tickLower, state.band.tickUpper, liqOut);
  const extra0 = mulDivFloor(state.idle0, shares, state.totalSupply);
  const extra1 = mulDivFloor(state.idle1, shares, state.totalSupply);

  burnShares(state, from, shares);
  state.totalLiquidity -= liqOut;
  state.idle0 -= extra0;
  state.idle1 -= extra1;

  const amount0 = pos.amount0 + extra0;
  const amount1 = pos.amount1 + extra1;
  const w = walletOf(state, from);
  state.wallets.set(from, { t0: w.t0 + amount0, t1: w.t1 + amount1 });
  bump(state);
  pushActivity(state, "Withdraw", from, `PairbandVault.withdraw · burned ${shares} shares`, {
    amount0: amount0.toString(),
    amount1: amount1.toString(),
  });
  return { amount0, amount1, hash: state.activity[0]!.hash };
}

export function proposeRebalance(
  state: EngineState,
  from: string,
  tickLower: number,
  tickUpper: number,
  amount0Min: bigint,
  amount1Min: bigint,
): { hash: string } {
  const p = state.policy;
  if (p.agent !== ZERO && from.toLowerCase() !== p.agent.toLowerCase() && from.toLowerCase() !== p.curator.toLowerCase()) {
    throw new VaultError("NotAgent", "policy.agent is set — stranger cannot propose");
  }
  if (p.agent !== ZERO && from.toLowerCase() === p.agent.toLowerCase()) {
    chargeAgentFee(state, from);
  }
  const spacing = state.tickSpacing;
  tickLower = align(tickLower, spacing);
  tickUpper = align(tickUpper, spacing);
  try {
    validateBand(tickLower, tickUpper, spacing, p.maxWidth);
  } catch (e) {
    const err = e as { code?: string };
    if (err.code === "TooWide") throw new VaultError("TooWide", "width > policy.maxWidth");
    throw new VaultError("InvalidTicks", "ticks failed validation");
  }
  state.proposal = {
    tickLower,
    tickUpper,
    amount0Min,
    amount1Min,
    proposer: from,
    postedAt: now(),
    active: true,
  };
  bump(state);
  pushActivity(
    state,
    "Propose",
    from,
    `PairbandVault.proposeRebalance · [${tickLower}, ${tickUpper})`,
  );
  return { hash: state.activity[0]!.hash };
}

export function rejectProposal(state: EngineState, from: string): { hash: string } {
  if (from.toLowerCase() !== state.policy.curator.toLowerCase()) {
    throw new VaultError("NotCurator", "only the named curator");
  }
  if (!state.proposal?.active) throw new VaultError("NoProposal", "no active proposal");
  state.proposal.active = false;
  bump(state);
  pushActivity(state, "Reject", from, "PairbandVault.rejectProposal");
  return { hash: state.activity[0]!.hash };
}

export function executeRebalance(state: EngineState, from: string): { hash: string; protocol0: bigint; protocol1: bigint; curatorShares: bigint } {
  if (from.toLowerCase() !== state.policy.curator.toLowerCase()) {
    throw new VaultError("NotCurator", "only the named curator can execute");
  }
  const prop = state.proposal;
  if (!prop?.active) throw new VaultError("NoProposal", "no active proposal");
  const p = state.policy;
  const ts = now();
  if (ts < prop.postedAt + p.proposalDelay) throw new VaultError("DelayPending", "proposal delay");
  if (state.band.lastRebalanceAt !== 0 && ts < state.band.lastRebalanceAt + p.minCooldown) {
    throw new VaultError("CooldownPending", "minCooldown");
  }
  const s = shift(state.band.tickLower, state.band.tickUpper, prop.tickLower, prop.tickUpper);
  if (s > p.maxShift) throw new VaultError("ShiftCapped", `L1 shift ${s} > maxShift ${p.maxShift}`);

  // Collect idle fees already sitting on the vault (credited by swap()).
  const fee0 = state.idle0;
  const fee1 = state.idle1;
  const proto0 = (fee0 * BigInt(p.protocolFeeBps)) / 10_000n;
  const proto1 = (fee1 * BigInt(p.protocolFeeBps)) / 10_000n;
  const protoW = walletOf(state, state.protocolFeeRecipient);
  state.wallets.set(state.protocolFeeRecipient, { t0: protoW.t0 + proto0, t1: protoW.t1 + proto1 });
  state.idle0 -= proto0;
  state.idle1 -= proto1;

  const remain0 = (state.idle0 * BigInt(p.performanceFeeBps)) / 10_000n;
  const remain1 = (state.idle1 * BigInt(p.performanceFeeBps)) / 10_000n;
  let curatorShares = 0n;
  const curatorValue = remain0 + remain1; // 6-dec stables, 1:1
  const assets = tvl(state);
  const totalValue = assets.t0 + assets.t1;
  if (curatorValue > 0n && state.totalSupply > 0n && totalValue > curatorValue) {
    curatorShares = mulDivFloor(curatorValue, state.totalSupply, totalValue - curatorValue);
    if (curatorShares > 0n) mintShares(state, p.curator, curatorShares);
  }

  const recovered = positionAmounts(state);
  state.idle0 += recovered.amount0;
  state.idle1 += recovered.amount1;
  state.totalLiquidity = 0n;

  if (state.idle0 < prop.amount0Min || state.idle1 < prop.amount1Min) {
    throw new VaultError("ZeroAmount", "amountMin failed — sandwich / price move");
  }

  const newLiq = liquidityAtBand(state.tick, prop.tickLower, prop.tickUpper, state.idle0, state.idle1);
  if (newLiq === 0n) throw new VaultError("ZeroAmount", "zero liquidity at new band");
  const consumed = amountsAtBand(state.tick, prop.tickLower, prop.tickUpper, newLiq);
  state.idle0 -= consumed.amount0;
  state.idle1 -= consumed.amount1;
  if (state.idle0 < 0n) state.idle0 = 0n;
  if (state.idle1 < 0n) state.idle1 = 0n;
  state.totalLiquidity = newLiq;
  state.band = {
    tickLower: prop.tickLower,
    tickUpper: prop.tickUpper,
    positionId: 1,
    lastRebalanceAt: ts,
  };
  state.proposal = { ...prop, active: false };
  state.rebalanceUnlockBlock = state.blockNumber + 3;
  bump(state);
  pushActivity(
    state,
    "Execute",
    from,
    `PairbandVault.executeRebalance · band [${prop.tickLower}, ${prop.tickUpper})`,
  );
  return { hash: state.activity[0]!.hash, protocol0: proto0, protocol1: proto1, curatorShares };
}

export function swap(state: EngineState, from: string, zeroForOne: boolean, amountIn: bigint): { amountOut: bigint; hash: string } {
  if (amountIn === 0n) throw new VaultError("ZeroAmount", "zero swap");
  const w = walletOf(state, from);
  if (zeroForOne && w.t0 < amountIn) throw new VaultError("ZeroAmount", "insufficient token0");
  if (!zeroForOne && w.t1 < amountIn) throw new VaultError("ZeroAmount", "insufficient token1");

  const feeAmount = (amountIn * BigInt(state.fee)) / 1_000_000n;
  const amountAfterFee = amountIn - feeAmount;
  if (state.totalLiquidity === 0n) throw new VaultError("ZeroAmount", "no liquidity in band");

  const lowerSqrt = getSqrtRatioAtTick(state.band.tickLower);
  const upperSqrt = getSqrtRatioAtTick(state.band.tickUpper);
  let next = nextSqrtFromInput(state.sqrtPriceX96, state.totalLiquidity, amountAfterFee, zeroForOne);
  if (zeroForOne && next < lowerSqrt) next = lowerSqrt;
  if (!zeroForOne && next > upperSqrt) next = upperSqrt;

  // Approximate out using virtual reserves at current liquidity.
  const dx = zeroForOne
    ? amountAfterFee
    : mulDivFloor(state.totalLiquidity * (next - state.sqrtPriceX96), 1n, Q96);
  const dy = zeroForOne
    ? mulDivFloor(state.totalLiquidity * (state.sqrtPriceX96 - next), 1n, Q96)
    : amountAfterFee;

  let amountOut = zeroForOne ? dy : dx;
  // Bound by position inventory
  const pos = positionAmounts(state);
  if (zeroForOne && amountOut > pos.amount1) amountOut = pos.amount1;
  if (!zeroForOne && amountOut > pos.amount0) amountOut = pos.amount0;

  if (zeroForOne) {
    state.wallets.set(from, { t0: w.t0 - amountIn, t1: w.t1 + amountOut });
    state.idle0 += feeAmount;
  } else {
    state.wallets.set(from, { t0: w.t0 + amountOut, t1: w.t1 - amountIn });
    state.idle1 += feeAmount;
  }

  state.sqrtPriceX96 = next;
  state.tick = getTickAtSqrtRatio(next);
  bump(state);
  pushSpark(state);
  pushActivity(
    state,
    "SwapTouched",
    from,
    `afterSwap · tick ${state.tick} · public PoolManager`,
  );
  return { amountOut, hash: state.activity[0]!.hash };
}

export function previewDeposit(state: EngineState, amount0: bigint, amount1: bigint): { shares: bigint; liquidity: bigint } {
  const liq = liquidityAtBand(state.tick, state.band.tickLower, state.band.tickUpper, amount0, amount1);
  const shares =
    state.totalSupply === 0n ? liq : sharesForLiquidity(liq, state.totalSupply, state.totalLiquidity);
  return { shares, liquidity: liq };
}

export function previewWithdraw(state: EngineState, shares: bigint): { amount0: bigint; amount1: bigint } {
  if (shares === 0n || state.totalSupply === 0n) return { amount0: 0n, amount1: 0n };
  const liqOut = liquidityForShares(shares, state.totalSupply, state.totalLiquidity);
  const pos = amountsAtBand(state.tick, state.band.tickLower, state.band.tickUpper, liqOut);
  return {
    amount0: pos.amount0 + mulDivFloor(state.idle0, shares, state.totalSupply),
    amount1: pos.amount1 + mulDivFloor(state.idle1, shares, state.totalSupply),
  };
}

export function snapshot(state: EngineState): VaultSnapshot {
  const shares: Record<string, string> = {};
  for (const [k, v] of state.shares) shares[k] = v.toString();
  const wallets: Record<string, { t0: string; t1: string }> = {};
  for (const [k, v] of state.wallets) wallets[k] = { t0: v.t0.toString(), t1: v.t1.toString() };
  return {
    chainId: state.chainId,
    chainName: state.chainName,
    vault: state.vault,
    hook: state.hook,
    factory: state.factory,
    poolId: state.poolId,
    name: state.name,
    symbol: state.symbol,
    token0: state.token0,
    token1: state.token1,
    tickSpacing: state.tickSpacing,
    fee: state.fee,
    sqrtPriceX96: state.sqrtPriceX96,
    tick: state.tick,
    band: { ...state.band },
    policy: { ...state.policy },
    proposal: state.proposal ? { ...state.proposal } : null,
    totalSupply: state.totalSupply,
    totalLiquidity: state.totalLiquidity,
    idle0: state.idle0,
    idle1: state.idle1,
    protocolFeeRecipient: state.protocolFeeRecipient,
    rebalanceUnlockBlock: state.rebalanceUnlockBlock,
    blockNumber: state.blockNumber,
    timestamp: state.timestamp,
    shares,
    wallets,
    spark: [...state.spark],
    activity: [...state.activity],
    demo: state.demo,
  };
}

export function tvlOf(state: EngineState): bigint {
  const a = tvl(state);
  return a.t0 + a.t1;
}

export function positionOf(state: EngineState) {
  return positionAmounts(state);
}
