import { ARC_CCTP_DOMAIN, ALLOWED_DOMAINS, isArc } from "./cctp.ts";
import {
  ARC_TESTNET_ID,
  BOOK_MM,
  DEAD,
  FAUCET_AMOUNT,
  FAUCET_CAP,
  LAUNCH_FEE_USDC,
  MIN_LP_TOKENS,
  MINIMUM_LIQUIDITY,
  stageThresholds,
  TOTAL_SUPPLY,
  TREASURY,
  VIRTUAL_TOKENS,
  VIRTUAL_USDC,
  WAD,
} from "./constants.ts";
import { getAmountOut, sqrt } from "./amm.ts";
import {
  bookMid,
  cancelOrder,
  emptyBook,
  insertOrder,
  matchAsks,
  matchBids,
  previewMarketBuy,
  previewMarketSell,
  seedBook,
  tokensToUsdc,
  usdcToTokens,
} from "./book.ts";
import { getTokensOut, getUsdcOut, splitFees, spotPrice } from "./curve.ts";
import { hasBook, isCurveOpen, isStageB, normalizeStatus } from "./status.ts";
import type { Book, BuyPreview, EngineState, Launch, SellPreview, Side, Trade } from "./types.ts";
import { LaunchError } from "./types.ts";

/** Unique-buyer notional floor: ≥ 1 USDC on the curve, not the creator. */
const UNIQUE_BUY_MIN = 1n * WAD;

function addr(kind: string, n: number): string {
  const hex = n.toString(16).padStart(8, "0");
  const pad = kind === "token" ? "70" : kind === "curve" ? "C0" : kind === "pair" ? "A0" : "D0";
  return `0x${pad}${hex}${"0".repeat(30)}`.slice(0, 42);
}

function hueOf(symbol: string): number {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 33 + symbol.charCodeAt(i)) >>> 0;
  return h % 360;
}

function now(): number {
  return Date.now();
}

function clone<T>(v: T): T {
  return structuredClone(v);
}

function creditToken(s: EngineState, launchId: string, account: string, amount: bigint) {
  const bag = s.tokens[launchId] ?? (s.tokens[launchId] = {});
  bag[account] = (bag[account] ?? 0n) + amount;
}

function debitToken(s: EngineState, launchId: string, account: string, amount: bigint) {
  const bag = s.tokens[launchId] ?? (s.tokens[launchId] = {});
  const prev = bag[account] ?? 0n;
  if (prev < amount) throw new LaunchError("InsufficientBalance");
  bag[account] = prev - amount;
}

function debitUsdc(s: EngineState, account: string, amount: bigint) {
  const prev = s.usdc[account] ?? 0n;
  if (prev < amount) throw new LaunchError("InsufficientBalance");
  s.usdc[account] = prev - amount;
}

function creditUsdc(s: EngineState, account: string, amount: bigint) {
  s.usdc[account] = (s.usdc[account] ?? 0n) + amount;
}

function impactFromK(midOut: bigint, execOut: bigint): number {
  if (midOut <= 0n) return 0;
  if (execOut >= midOut) return 0;
  return Number(((midOut - execOut) * 10_000n) / midOut);
}

function pushTrade(
  s: EngineState,
  launch: Launch,
  side: Side,
  account: string,
  usdc: bigint,
  tokens: bigint,
  at = now(),
  destDomain: number = ARC_CCTP_DOMAIN,
  sourceDomain: number = ARC_CCTP_DOMAIN,
): Trade {
  const t: Trade = {
    id: `t${s.trades.length + 1}`,
    launchId: launch.id,
    side,
    account,
    usdc,
    tokens,
    price: isStageB(launch)
      ? launch.reserveToken === 0n
        ? 0n
        : (launch.reserveUsdc * WAD) / launch.reserveToken
      : spotPrice(launch.virtualUsdc, launch.virtualTokens),
    at,
    sourceDomain,
    destDomain,
  };
  if (side === "buy" || side === "sell" || side === "swap" || side === "fill") {
    launch.volumeUsdc += usdc;
    launch.txCount += 1;
    launch.lastTradeAt = at;
  }
  s.trades = [t, ...s.trades].slice(0, 500);
  return t;
}

function recountHolders(s: EngineState, launch: Launch) {
  const bag = s.tokens[launch.id] ?? {};
  launch.holders = Object.values(bag).filter((v) => v > 0n).length;
}

export function createEngine(): EngineState {
  return {
    chainId: ARC_TESTNET_ID,
    usdc: { [TREASURY]: 0n, [BOOK_MM]: 0n },
    remoteUsdc: {},
    tokens: {},
    launches: [],
    trades: [],
    books: {},
    created: [],
    nextId: 1,
    cctpNonce: 1,
  };
}

/** On-chain launches use numeric ids from the factory index. */
export function isOnchainLaunchId(id: string): boolean {
  return /^\d+$/.test(id);
}

export function findLaunch(s: EngineState, id: string): Launch {
  const l = s.launches.find((x) => x.id === id);
  if (!l) throw new LaunchError("UnknownLaunch");
  return l;
}

export function getBook(s: EngineState, id: string): Book {
  return s.books[id] ?? emptyBook();
}

export function previewBuy(launch: Launch, usdcIn: bigint, book?: Book): BuyPreview {
  if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
  if (isStageB(launch)) {
    const b = book ?? emptyBook();
    const q = previewMarketBuy(b, launch, usdcIn);
    if (q.tokensOut <= 0n) throw new LaunchError("InsufficientLiquidity");
    const venue: BuyPreview["venue"] =
      q.bookUsdc > 0n && q.ammUsdc === 0n ? "book" : q.bookUsdc === 0n ? "uniswap" : "book";
    return {
      tokensOut: q.tokensOut,
      protocol: 0n,
      creator: 0n,
      net: usdcIn,
      impactBps: q.impactBps,
      venue,
      bookUsdc: q.bookUsdc,
      ammUsdc: q.ammUsdc,
    };
  }
  if (launch.status === "stage_a") {
    const b = book ?? emptyBook();
    const m = matchAsks(
      { bids: [], asks: b.asks.map((o) => ({ ...o })), nextId: b.nextId },
      usdcIn,
    );
    let tokensOut = m.tokensOut;
    let protocol = 0n;
    let creator = 0n;
    let net = usdcIn;
    if (m.leftoverUsdc > 0n) {
      const fees = splitFees(m.leftoverUsdc);
      protocol = fees.protocol;
      creator = fees.creator;
      net = fees.net;
      const curveOut = getTokensOut(launch.virtualUsdc, launch.virtualTokens, fees.net);
      if (launch.virtualTokens - curveOut < MIN_LP_TOKENS) throw new LaunchError("BelowMinLp");
      tokensOut += curveOut;
    }
    if (tokensOut <= 0n) throw new LaunchError("InsufficientLiquidity");
    return {
      tokensOut,
      protocol,
      creator,
      net,
      impactBps: 0,
      venue: m.tokensOut > 0n ? "book" : "curve",
      bookUsdc: usdcIn - m.leftoverUsdc,
    };
  }
  const fees = splitFees(usdcIn);
  const tokensOut = getTokensOut(launch.virtualUsdc, launch.virtualTokens, fees.net);
  if (launch.virtualTokens - tokensOut < MIN_LP_TOKENS) throw new LaunchError("BelowMinLp");
  const mid = (fees.net * launch.virtualTokens) / launch.virtualUsdc;
  return { tokensOut, ...fees, impactBps: impactFromK(mid, tokensOut), venue: "curve" };
}

export function previewSell(launch: Launch, tokensIn: bigint, book?: Book): SellPreview {
  if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
  if (isStageB(launch)) {
    const b = book ?? emptyBook();
    const q = previewMarketSell(b, launch, tokensIn);
    if (q.usdcOut <= 0n) throw new LaunchError("InsufficientLiquidity");
    const venue: SellPreview["venue"] =
      q.bookTokens > 0n && q.ammTokens === 0n ? "book" : q.bookTokens === 0n ? "uniswap" : "book";
    return {
      usdcOut: q.usdcOut,
      protocol: 0n,
      creator: 0n,
      net: q.usdcOut,
      impactBps: q.impactBps,
      venue,
      bookTokens: q.bookTokens,
      ammTokens: q.ammTokens,
    };
  }
  if (launch.status === "stage_a") {
    const b = book ?? emptyBook();
    const m = matchBids(
      { bids: b.bids.map((o) => ({ ...o })), asks: [], nextId: b.nextId },
      tokensIn,
    );
    let usdcOut = m.usdcOut;
    let protocol = 0n;
    let creator = 0n;
    if (m.leftoverTokens > 0n) {
      const gross = getUsdcOut(launch.virtualUsdc, launch.virtualTokens, m.leftoverTokens);
      const fees = splitFees(gross);
      if (gross > launch.realUsdc) throw new LaunchError("InsufficientRealUsdc");
      protocol = fees.protocol;
      creator = fees.creator;
      usdcOut += fees.net;
    }
    if (usdcOut <= 0n) throw new LaunchError("InsufficientLiquidity");
    return {
      usdcOut,
      protocol,
      creator,
      net: usdcOut,
      impactBps: 0,
      venue: m.usdcOut > 0n ? "book" : "curve",
      bookTokens: tokensIn - m.leftoverTokens,
    };
  }
  const gross = getUsdcOut(launch.virtualUsdc, launch.virtualTokens, tokensIn);
  const fees = splitFees(gross);
  if (gross > launch.realUsdc) throw new LaunchError("InsufficientRealUsdc");
  const mid = (tokensIn * launch.virtualUsdc) / launch.virtualTokens;
  return { usdcOut: fees.net, ...fees, impactBps: impactFromK(mid, gross), venue: "curve" };
}

function seedMarketBook(s: EngineState, launch: Launch) {
  const mmTok = 80_000_000n * WAD;
  creditToken(s, launch.id, BOOK_MM, mmTok);
  // Seed mid from curve spot when Stage A opens before AMM reserves exist.
  const ghost: Launch = {
    ...launch,
    reserveUsdc: launch.reserveUsdc > 0n ? launch.reserveUsdc : launch.virtualUsdc,
    reserveToken: launch.reserveToken > 0n ? launch.reserveToken : launch.virtualTokens,
  };
  s.books[launch.id] = seedBook(
    ghost,
    [BOOK_MM],
    (who, amt) => {
      const bag = s.tokens[launch.id] ?? (s.tokens[launch.id] = {});
      if ((bag[who] ?? 0n) < amt) return false;
      bag[who] -= amt;
      return true;
    },
    (who, amt) => {
      debitUsdc(s, who, amt);
    },
    now(),
  );
}

/** Stage A — discovery book opens; curve stays open until Stage B. */
function openStageA(s: EngineState, launch: Launch, account: string) {
  if (launch.status !== "curve") return;
  launch.status = "stage_a";
  launch.stageAAt = now();
  launch.book = addr("book", s.nextId++);
  pushTrade(s, launch, "stage_a", account, launch.realUsdc, 0n);
  seedMarketBook(s, launch);
}

/**
 * Stage B — locked spot venue. Price continuity: AMM opening ≈ curve spot within 1 bps.
 * LP → 0xdead. Minting conceptually revoked (engine stops minting after this).
 */
function openStageB(s: EngineState, launch: Launch, account: string) {
  if (isStageB(launch)) throw new LaunchError("AlreadyGraduated");
  if (launch.status === "curve") openStageA(s, launch, account);

  const spot = spotPrice(launch.virtualUsdc, launch.virtualTokens);
  const ammUsdc = launch.realUsdc;
  if (ammUsdc === 0n || spot === 0n) throw new LaunchError("InsufficientLiquidity");
  // Size token reserve so pool open price equals curve spot (continuity by construction).
  const ammToken = (ammUsdc * WAD) / spot;
  if (ammToken > launch.virtualTokens || ammToken < MIN_LP_TOKENS) {
    throw new LaunchError("PriceContinuity");
  }
  const openPx = (ammUsdc * WAD) / ammToken;
  const diff = openPx > spot ? openPx - spot : spot - openPx;
  if ((diff * 10_000n) / spot > 1n) throw new LaunchError("PriceContinuity");

  launch.reserveUsdc = ammUsdc;
  launch.reserveToken = ammToken;
  launch.virtualTokens -= ammToken;
  const liq = sqrt(launch.reserveUsdc * launch.reserveToken);
  launch.lpBurned = liq;
  launch.lpSupply = 0n;
  launch.pair = addr("pair", s.nextId++);
  if (!launch.book) launch.book = addr("book", s.nextId++);
  launch.status = "stage_b";
  const t = now();
  launch.stageBAt = t;
  launch.graduatedAt = t;
  launch.realUsdc = 0n;
  void DEAD;
  void MINIMUM_LIQUIDITY;
  pushTrade(s, launch, "stage_b", account, launch.reserveUsdc, ammToken);
  pushTrade(s, launch, "graduate", account, launch.reserveUsdc, ammToken);
  if (!s.books[launch.id]?.asks.length) seedMarketBook(s, launch);
}

function maybeAdvanceStages(s: EngineState, launch: Launch, account: string) {
  if (isStageB(launch)) return;
  const th = stageThresholds(s.chainId);
  const buyers = BigInt(launch.uniqueBuyers.length);
  const raised = launch.realUsdc;

  if (launch.status === "curve" && raised >= th.aUsd && buyers >= th.aWallets) {
    openStageA(s, launch, account);
  }
  const stageBOk =
    (raised >= th.bUsd && buyers >= th.bWalletsMin) || raised >= th.bUsdHard;
  if (!isStageB(launch) && stageBOk) {
    openStageB(s, launch, account);
  }
}

function recordUniqueBuyer(launch: Launch, account: string, usdcNotional: bigint) {
  if (usdcNotional < UNIQUE_BUY_MIN) return;
  if (account.toLowerCase() === launch.creator.toLowerCase()) return;
  const key = account.toLowerCase();
  if (!launch.uniqueBuyers.some((a) => a.toLowerCase() === key)) {
    launch.uniqueBuyers.push(account);
  }
}

/** @deprecated Prefer maybeAdvanceStages — kept for tests / force path. */
function graduate(s: EngineState, launch: Launch, account: string) {
  if (isStageB(launch)) throw new LaunchError("AlreadyGraduated");
  if (launch.realUsdc === 0n) throw new LaunchError("NotGraduated");
  openStageB(s, launch, account);
}

export function createLaunch(
  s: EngineState,
  account: string,
  name: string,
  symbol: string,
  description: string,
  meta?: {
    imageUrl?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    websiteVerified?: boolean;
    twitterVerified?: boolean;
    /** Skip demo launch fee (e.g. mirroring an on-chain create). */
    skipFee?: boolean;
  },
): { state: EngineState; launch: Launch } {
  const n = name.trim();
  const sym = symbol.trim().toUpperCase();
  const d = description.trim();
  if (n.length < 2 || n.length > 32 || !/^[A-Z0-9]{2,12}$/.test(sym) || d.length > 280) {
    throw new LaunchError("InvalidMeta");
  }
  const website = meta?.website?.trim() || undefined;
  const twitter = meta?.twitter?.trim().replace(/^@/, "") || undefined;
  const telegram = meta?.telegram?.trim().replace(/^@/, "") || undefined;
  const discord = meta?.discord?.trim() || undefined;
  const imageUrl = meta?.imageUrl?.trim() || undefined;
  if (website && !/^https?:\/\//i.test(website) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(website)) {
    throw new LaunchError("InvalidMeta");
  }
  if (imageUrl && imageUrl.length > 350_000) {
    throw new LaunchError("InvalidMeta");
  }
  const next = clone(s);
  if (!meta?.skipFee && LAUNCH_FEE_USDC > 0n) {
    debitUsdc(next, account, LAUNCH_FEE_USDC);
    creditUsdc(next, TREASURY, LAUNCH_FEE_USDC);
  }
  const id = `${sym.toLowerCase()}-${next.nextId}`;
  const createdAt = now();
  const launch: Launch = {
    id,
    token: addr("token", next.nextId),
    curve: addr("curve", next.nextId),
    pair: null,
    book: null,
    name: n,
    symbol: sym,
    description: d,
    imageUrl,
    website: website
      ? /^https?:\/\//i.test(website)
        ? website
        : `https://${website}`
      : undefined,
    twitter,
    telegram,
    discord,
    websiteVerified: Boolean(meta?.websiteVerified && website),
    twitterVerified: Boolean(meta?.twitterVerified && twitter),
    hue: hueOf(sym + String(next.nextId)),
    creator: account,
    createdAt,
    status: "curve",
    virtualUsdc: VIRTUAL_USDC,
    virtualTokens: VIRTUAL_TOKENS,
    realUsdc: 0n,
    tokensSold: 0n,
    reserveUsdc: 0n,
    reserveToken: 0n,
    lpSupply: 0n,
    lpBurned: 0n,
    graduatedAt: null,
    stageAAt: null,
    stageBAt: null,
    uniqueBuyers: [],
    protocolFees: 0n,
    creatorFees: 0n,
    holders: 0,
    volumeUsdc: 0n,
    txCount: 0,
    lastTradeAt: createdAt,
  };
  next.nextId += 1;
  next.launches = [launch, ...next.launches];
  next.created = [id, ...next.created];
  next.tokens[id] = {};
  next.books[id] = emptyBook();
  creditUsdc(next, account, 0n);
  pushTrade(next, launch, "create", account, 0n, TOTAL_SUPPLY);
  return { state: next, launch };
}

function debitSource(s: EngineState, account: string, domain: number, amount: bigint) {
  if (isArc(domain)) {
    debitUsdc(s, account, amount);
    return;
  }
  if (!ALLOWED_DOMAINS.has(domain)) throw new LaunchError("UnknownDomain");
  const key = String(domain);
  const bag = s.remoteUsdc[key] ?? (s.remoteUsdc[key] = {});
  const prev = bag[account] ?? 0n;
  if (prev < amount) throw new LaunchError("InsufficientBalance");
  bag[account] = prev - amount;
}

function creditSource(s: EngineState, account: string, domain: number, amount: bigint) {
  if (isArc(domain)) {
    creditUsdc(s, account, amount);
    return;
  }
  if (!ALLOWED_DOMAINS.has(domain)) throw new LaunchError("UnknownDomain");
  const key = String(domain);
  const bag = s.remoteUsdc[key] ?? (s.remoteUsdc[key] = {});
  bag[account] = (bag[account] ?? 0n) + amount;
}

function mintToArc(s: EngineState, account: string, amount: bigint, sourceDomain: number) {
  if (isArc(sourceDomain)) return;
  debitSource(s, account, sourceDomain, amount);
  creditUsdc(s, account, amount);
  s.cctpNonce += 1;
}

export function buy(
  s: EngineState,
  account: string,
  launchId: string,
  usdcIn: bigint,
  minTokensOut = 0n,
  sourceDomain = ARC_CCTP_DOMAIN,
): EngineState {
  if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
  if (!ALLOWED_DOMAINS.has(sourceDomain)) throw new LaunchError("UnknownDomain");
  const next = clone(s);
  const launch = findLaunch(next, launchId);
  mintToArc(next, account, usdcIn, sourceDomain);
  debitUsdc(next, account, usdcIn);

  // Stage B: walk book → Uniswap residual
  if (isStageB(launch)) {
    const book = next.books[launchId] ?? (next.books[launchId] = emptyBook());
    const m = matchAsks(book, usdcIn);
    for (const f of m.fills) {
      creditUsdc(next, f.owner, f.usdc);
      creditToken(next, launchId, account, f.tokens);
    }
    let ammOut = 0n;
    if (m.leftoverUsdc > 0n) {
      try {
        ammOut = getAmountOut(m.leftoverUsdc, launch.reserveUsdc, launch.reserveToken);
        launch.reserveUsdc += m.leftoverUsdc;
        launch.reserveToken -= ammOut;
        creditToken(next, launchId, account, ammOut);
      } catch {
        creditUsdc(next, account, m.leftoverUsdc);
      }
    }
    const out = m.tokensOut + ammOut;
    if (out < minTokensOut) throw new LaunchError("Slippage");
    if (out <= 0n) throw new LaunchError("InsufficientLiquidity");
    recountHolders(next, launch);
    if (m.fills.length) {
      pushTrade(next, launch, "fill", account, usdcIn - m.leftoverUsdc, m.tokensOut, now(), ARC_CCTP_DOMAIN, sourceDomain);
    }
    if (ammOut > 0n) {
      pushTrade(next, launch, "swap", account, m.leftoverUsdc, ammOut, now(), ARC_CCTP_DOMAIN, sourceDomain);
    }
    return next;
  }

  // Stage A: walk book → curve residual (curve still open)
  if (launch.status === "stage_a") {
    const book = next.books[launchId] ?? (next.books[launchId] = emptyBook());
    const m = matchAsks(book, usdcIn);
    for (const f of m.fills) {
      creditUsdc(next, f.owner, f.usdc);
      creditToken(next, launchId, account, f.tokens);
    }
    let curveOut = 0n;
    let leftover = m.leftoverUsdc;
    if (leftover > 0n) {
      const { protocol, creator, net } = splitFees(leftover);
      curveOut = getTokensOut(launch.virtualUsdc, launch.virtualTokens, net);
      if (launch.virtualTokens - curveOut < MIN_LP_TOKENS) throw new LaunchError("BelowMinLp");
      launch.virtualUsdc += net;
      launch.virtualTokens -= curveOut;
      launch.realUsdc += net;
      launch.tokensSold += curveOut;
      launch.protocolFees += protocol;
      launch.creatorFees += creator;
      creditUsdc(next, TREASURY, protocol);
      creditUsdc(next, launch.creator, creator);
      creditToken(next, launchId, account, curveOut);
      recordUniqueBuyer(launch, account, leftover);
    }
    const out = m.tokensOut + curveOut;
    if (out < minTokensOut) throw new LaunchError("Slippage");
    if (out <= 0n) throw new LaunchError("InsufficientLiquidity");
    recountHolders(next, launch);
    if (m.fills.length) {
      pushTrade(next, launch, "fill", account, usdcIn - leftover, m.tokensOut, now(), ARC_CCTP_DOMAIN, sourceDomain);
    }
    if (curveOut > 0n) {
      pushTrade(next, launch, "buy", account, leftover, curveOut, now(), ARC_CCTP_DOMAIN, sourceDomain);
    }
    maybeAdvanceStages(next, launch, account);
    return next;
  }

  // Stage 0 curve
  const { protocol, creator, net } = splitFees(usdcIn);
  const tokensOut = getTokensOut(launch.virtualUsdc, launch.virtualTokens, net);
  if (launch.virtualTokens - tokensOut < MIN_LP_TOKENS) throw new LaunchError("BelowMinLp");
  if (tokensOut < minTokensOut) throw new LaunchError("Slippage");

  launch.virtualUsdc += net;
  launch.virtualTokens -= tokensOut;
  launch.realUsdc += net;
  launch.tokensSold += tokensOut;
  launch.protocolFees += protocol;
  launch.creatorFees += creator;
  creditUsdc(next, TREASURY, protocol);
  creditUsdc(next, launch.creator, creator);
  creditToken(next, launchId, account, tokensOut);
  recordUniqueBuyer(launch, account, usdcIn);
  recountHolders(next, launch);
  pushTrade(next, launch, "buy", account, usdcIn, tokensOut, now(), ARC_CCTP_DOMAIN, sourceDomain);

  maybeAdvanceStages(next, launch, account);
  return next;
}

export function sell(
  s: EngineState,
  account: string,
  launchId: string,
  tokensIn: bigint,
  minUsdcOut = 0n,
): EngineState {
  if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
  const next = clone(s);
  const launch = findLaunch(next, launchId);
  debitToken(next, launchId, account, tokensIn);

  if (isStageB(launch)) {
    const book = next.books[launchId] ?? (next.books[launchId] = emptyBook());
    const m = matchBids(book, tokensIn);
    for (const f of m.fills) {
      creditToken(next, launchId, f.owner, f.tokens);
      creditUsdc(next, account, f.usdc);
    }
    let ammOut = 0n;
    if (m.leftoverTokens > 0n) {
      try {
        ammOut = getAmountOut(m.leftoverTokens, launch.reserveToken, launch.reserveUsdc);
        launch.reserveToken += m.leftoverTokens;
        launch.reserveUsdc -= ammOut;
        creditUsdc(next, account, ammOut);
      } catch {
        creditToken(next, launchId, account, m.leftoverTokens);
      }
    }
    const out = m.usdcOut + ammOut;
    if (out < minUsdcOut) throw new LaunchError("Slippage");
    if (out <= 0n) throw new LaunchError("InsufficientLiquidity");
    recountHolders(next, launch);
    if (m.fills.length) {
      pushTrade(next, launch, "fill", account, m.usdcOut, tokensIn - m.leftoverTokens);
    }
    if (ammOut > 0n) {
      pushTrade(next, launch, "swap", account, ammOut, m.leftoverTokens);
    }
    return next;
  }

  if (launch.status === "stage_a") {
    const book = next.books[launchId] ?? (next.books[launchId] = emptyBook());
    const m = matchBids(book, tokensIn);
    for (const f of m.fills) {
      creditToken(next, launchId, f.owner, f.tokens);
      creditUsdc(next, account, f.usdc);
    }
    let curveNet = 0n;
    if (m.leftoverTokens > 0n) {
      const gross = getUsdcOut(launch.virtualUsdc, launch.virtualTokens, m.leftoverTokens);
      const { protocol, creator, net } = splitFees(gross);
      if (gross > launch.realUsdc) throw new LaunchError("InsufficientRealUsdc");
      launch.virtualTokens += m.leftoverTokens;
      launch.virtualUsdc -= gross;
      launch.realUsdc -= gross;
      launch.tokensSold -= m.leftoverTokens;
      if (launch.tokensSold < 0n) launch.tokensSold = 0n;
      launch.protocolFees += protocol;
      launch.creatorFees += creator;
      creditUsdc(next, TREASURY, protocol);
      creditUsdc(next, launch.creator, creator);
      creditUsdc(next, account, net);
      curveNet = net;
    }
    const out = m.usdcOut + curveNet;
    if (out < minUsdcOut) throw new LaunchError("Slippage");
    if (out <= 0n) throw new LaunchError("InsufficientLiquidity");
    recountHolders(next, launch);
    if (m.fills.length) {
      pushTrade(next, launch, "fill", account, m.usdcOut, tokensIn - m.leftoverTokens);
    }
    if (curveNet > 0n) {
      pushTrade(next, launch, "sell", account, curveNet, m.leftoverTokens);
    }
    return next;
  }

  const gross = getUsdcOut(launch.virtualUsdc, launch.virtualTokens, tokensIn);
  const { protocol, creator, net } = splitFees(gross);
  if (gross > launch.realUsdc) throw new LaunchError("InsufficientRealUsdc");
  if (net < minUsdcOut) throw new LaunchError("Slippage");

  launch.virtualTokens += tokensIn;
  launch.virtualUsdc -= gross;
  launch.realUsdc -= gross;
  launch.tokensSold -= tokensIn;
  if (launch.tokensSold < 0n) launch.tokensSold = 0n;
  launch.protocolFees += protocol;
  launch.creatorFees += creator;
  creditUsdc(next, TREASURY, protocol);
  creditUsdc(next, launch.creator, creator);
  creditUsdc(next, account, net);
  recountHolders(next, launch);
  pushTrade(next, launch, "sell", account, net, tokensIn);
  return next;
}

export function forceGraduate(s: EngineState, account: string, launchId: string): EngineState {
  const next = clone(s);
  const launch = findLaunch(next, launchId);
  graduate(next, launch, account);
  return next;
}

export function limitBuy(
  s: EngineState,
  account: string,
  launchId: string,
  price: bigint,
  usdcIn: bigint,
  sourceDomain = ARC_CCTP_DOMAIN,
): EngineState {
  if (usdcIn <= 0n || price <= 0n) throw new LaunchError("ZeroAmount");
  if (!ALLOWED_DOMAINS.has(sourceDomain)) throw new LaunchError("UnknownDomain");
  const next = clone(s);
  const launch = findLaunch(next, launchId);
  if (!hasBook(launch)) throw new LaunchError("BookNotOpen");
  mintToArc(next, account, usdcIn, sourceDomain);
  debitUsdc(next, account, usdcIn);
  const book = next.books[launchId] ?? (next.books[launchId] = emptyBook());
  const m = matchAsks(book, usdcIn, price);
  for (const f of m.fills) {
    creditUsdc(next, f.owner, f.usdc);
    creditToken(next, launchId, account, f.tokens);
  }
  if (m.fills.length) {
    pushTrade(next, launch, "fill", account, usdcIn - m.leftoverUsdc, m.tokensOut, now(), ARC_CCTP_DOMAIN, sourceDomain);
  }
  const restTok = usdcToTokens(m.leftoverUsdc, price);
  const restUsdc = tokensToUsdc(restTok, price);
  if (restTok > 0n && restUsdc > 0n) {
    insertOrder(book, {
      id: book.nextId++,
      launchId,
      owner: account,
      side: "bid",
      price,
      remaining: restTok,
      escrow: restUsdc,
      createdAt: now(),
    });
    if (m.leftoverUsdc > restUsdc) creditUsdc(next, account, m.leftoverUsdc - restUsdc);
    pushTrade(next, launch, "limit", account, restUsdc, restTok, now(), ARC_CCTP_DOMAIN, sourceDomain);
  } else if (m.leftoverUsdc > 0n) {
    creditUsdc(next, account, m.leftoverUsdc);
  }
  recountHolders(next, launch);
  return next;
}

export function limitSell(
  s: EngineState,
  account: string,
  launchId: string,
  price: bigint,
  tokensIn: bigint,
): EngineState {
  if (tokensIn <= 0n || price <= 0n) throw new LaunchError("ZeroAmount");
  const next = clone(s);
  const launch = findLaunch(next, launchId);
  if (!hasBook(launch)) throw new LaunchError("BookNotOpen");
  debitToken(next, launchId, account, tokensIn);
  const book = next.books[launchId] ?? (next.books[launchId] = emptyBook());
  const m = matchBids(book, tokensIn, price);
  for (const f of m.fills) {
    creditToken(next, launchId, f.owner, f.tokens);
    creditUsdc(next, account, f.usdc);
  }
  if (m.fills.length) {
    pushTrade(next, launch, "fill", account, m.usdcOut, tokensIn - m.leftoverTokens);
  }
  if (m.leftoverTokens > 0n) {
    insertOrder(book, {
      id: book.nextId++,
      launchId,
      owner: account,
      side: "ask",
      price,
      remaining: m.leftoverTokens,
      escrow: m.leftoverTokens,
      createdAt: now(),
    });
    pushTrade(next, launch, "limit", account, tokensToUsdc(m.leftoverTokens, price), m.leftoverTokens);
  }
  recountHolders(next, launch);
  return next;
}

export function cancel(
  s: EngineState,
  account: string,
  launchId: string,
  orderId: number,
): EngineState {
  const next = clone(s);
  const launch = findLaunch(next, launchId);
  const book = next.books[launchId] ?? emptyBook();
  const o = cancelOrder(book, orderId, account);
  if (o.side === "bid") creditUsdc(next, account, o.escrow);
  else creditToken(next, launchId, account, o.remaining);
  next.books[launchId] = book;
  pushTrade(next, launch, "cancel", account, o.side === "bid" ? o.escrow : 0n, o.remaining);
  recountHolders(next, launch);
  return next;
}

export function openOrders(s: EngineState, launchId: string, account: string) {
  const book = s.books[launchId];
  if (!book) return [];
  return [...book.bids, ...book.asks].filter((o) => o.owner.toLowerCase() === account.toLowerCase());
}

export function faucet(s: EngineState, account: string): EngineState {
  const next = clone(s);
  const cur = next.usdc[account] ?? 0n;
  if (cur >= FAUCET_CAP) throw new LaunchError("FaucetCapped");
  const room = FAUCET_CAP - cur;
  const add = room < FAUCET_AMOUNT ? room : FAUCET_AMOUNT;
  if (add <= 0n) throw new LaunchError("FaucetCapped");
  next.usdc[account] = cur + add;
  return next;
}

export function tokenBalance(s: EngineState, launchId: string, account: string): bigint {
  return s.tokens[launchId]?.[account] ?? 0n;
}

export function usdcBalance(s: EngineState, account: string): bigint {
  return s.usdc[account] ?? 0n;
}

export function sourceBalance(s: EngineState, account: string, domain: number): bigint {
  if (isArc(domain)) return s.usdc[account] ?? 0n;
  return s.remoteUsdc[String(domain)]?.[account] ?? 0n;
}

export function totalUsdc(s: EngineState, account: string): bigint {
  let t = s.usdc[account] ?? 0n;
  for (const bag of Object.values(s.remoteUsdc ?? {})) t += bag[account] ?? 0n;
  return t;
}

export function bridgeOut(
  s: EngineState,
  account: string,
  destDomain: number,
  amount: bigint,
): EngineState {
  if (amount <= 0n) throw new LaunchError("ZeroAmount");
  if (!ALLOWED_DOMAINS.has(destDomain)) throw new LaunchError("UnknownDomain");
  if (isArc(destDomain)) throw new LaunchError("SameDomain");
  const next = clone(s);
  debitUsdc(next, account, amount);
  creditSource(next, account, destDomain, amount);
  next.cctpNonce += 1;
  const ghost: Launch = findLaunch(next, next.launches[0]!.id);
  pushTrade(next, ghost, "bridge", account, amount, 0n, now(), destDomain, ARC_CCTP_DOMAIN);
  next.trades[0]!.launchId = "cctp";
  next.trades[0]!.price = 0n;
  return next;
}

export function marketCap(launch: Launch, book?: Book): bigint {
  const px = priceOf(launch, book);
  if (px === 0n) return 0n;
  return (px * TOTAL_SUPPLY) / WAD;
}

export function priceOf(launch: Launch, book?: Book): bigint {
  if (isStageB(launch)) {
    const mid = bookMid(book);
    if (mid) return mid;
    if (launch.reserveToken === 0n) return 0n;
    return (launch.reserveUsdc * WAD) / launch.reserveToken;
  }
  return spotPrice(launch.virtualUsdc, launch.virtualTokens);
}

export function graduateProgress(launch: Launch, chainId = ARC_TESTNET_ID): number {
  if (isStageB(launch)) return 1;
  const th = stageThresholds(chainId);
  const target = th.bUsdHard > th.bUsd ? th.bUsdHard : th.bUsd;
  if (target === 0n) return 0;
  const bps = Number((launch.realUsdc * 10_000n) / target);
  return Math.min(1, bps / 10_000);
}

export function raisedOf(launch: Launch): bigint {
  return isStageB(launch) ? launch.reserveUsdc : launch.realUsdc;
}

export function holdersOf(
  s: EngineState,
  launchId: string,
): Array<{ account: string; amount: bigint }> {
  const bag = s.tokens[launchId] ?? {};
  return Object.entries(bag)
    .filter(([, amount]) => amount > 0n)
    .map(([account, amount]) => ({ account, amount }))
    .sort((a, b) => (a.amount < b.amount ? 1 : -1));
}

export function priceSeries(
  s: EngineState,
  launchId: string,
): Array<{ t: number; p: number; side: Side }> {
  return s.trades
    .filter((t) => t.launchId === launchId && t.price > 0n)
    .slice()
    .reverse()
    .map((t) => ({ t: t.at, p: Number(t.price) / Number(WAD), side: t.side }));
}

export function protocolStats(s: EngineState): {
  count: number;
  graduated: number;
  stageA: number;
  raised: bigint;
  volume: bigint;
} {
  let raised = 0n;
  let volume = 0n;
  let graduated = 0;
  let stageA = 0;
  for (const l of s.launches) {
    raised += raisedOf(l);
    volume += l.volumeUsdc;
    if (isStageB(l)) graduated += 1;
    else if (l.status === "stage_a") stageA += 1;
  }
  return { count: s.launches.length, graduated, stageA, raised, volume };
}

export function minOut(quoted: bigint, slippageBps: bigint): bigint {
  return (quoted * (10_000n - slippageBps)) / 10_000n;
}

export function venueOf(launch: Launch): "curve" | "uniswap" | "book" {
  if (isStageB(launch)) return "book";
  if (launch.status === "stage_a") return "book";
  return "curve";
}

export { hasBook, isCurveOpen, isStageB, normalizeStatus };
