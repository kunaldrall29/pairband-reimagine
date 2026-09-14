import { ARC_CCTP_DOMAIN, ALLOWED_DOMAINS, isArc } from "./cctp.ts";
import {
  ARC_TESTNET_ID,
  BOOK_MM,
  DEAD,
  DEMO_USER,
  FAUCET_AMOUNT,
  FAUCET_CAP,
  GRADUATE_AT,
  LAUNCH_FEE_USDC,
  MIN_LP_TOKENS,
  MINIMUM_LIQUIDITY,
  TOTAL_SUPPLY,
  TREASURY,
  VIRTUAL_TOKENS,
  VIRTUAL_USDC,
  WAD,
} from "./constants.ts";
import { getAmountOut, priceImpactBps, sqrt } from "./amm.ts";
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
import { seedLaunches } from "./seed.ts";
import type { Book, BuyPreview, EngineState, Launch, SellPreview, Side, Trade } from "./types.ts";
import { LaunchError } from "./types.ts";

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
    price:
      launch.status === "graduated"
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
  const s: EngineState = {
    chainId: ARC_TESTNET_ID,
    usdc: { [DEMO_USER]: 10_000n * WAD, [TREASURY]: 0n, [BOOK_MM]: 25_000n * WAD },
    remoteUsdc: {
      "0": { [DEMO_USER]: 2_500n * WAD },
      "6": { [DEMO_USER]: 1_800n * WAD },
      "10": { [DEMO_USER]: 900n * WAD },
      "3": { [DEMO_USER]: 1_200n * WAD },
      "2": { [DEMO_USER]: 400n * WAD },
      "5": { [DEMO_USER]: 750n * WAD },
    },
    tokens: {},
    launches: [],
    trades: [],
    books: {},
    created: [],
    nextId: 1,
    cctpNonce: 1,
  };
  seedLaunches(s, { addr, hueOf, creditToken, creditUsdc, pushTrade, now });
  return s;
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
  if (launch.status === "graduated") {
    const b = book ?? emptyBook();
    const q = previewMarketBuy(b, launch, usdcIn);
    if (q.tokensOut <= 0n) throw new LaunchError("InsufficientLiquidity");
    const venue: BuyPreview["venue"] = q.bookUsdc > 0n && q.ammUsdc === 0n ? "book" : q.bookUsdc === 0n ? "uniswap" : "book";
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
  const fees = splitFees(usdcIn);
  const tokensOut = getTokensOut(launch.virtualUsdc, launch.virtualTokens, fees.net);
  if (launch.virtualTokens - tokensOut < MIN_LP_TOKENS) throw new LaunchError("BelowMinLp");
  const mid = (fees.net * launch.virtualTokens) / launch.virtualUsdc;
  return { tokensOut, ...fees, impactBps: impactFromK(mid, tokensOut), venue: "curve" };
}

export function previewSell(launch: Launch, tokensIn: bigint, book?: Book): SellPreview {
  if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
  if (launch.status === "graduated") {
    const b = book ?? emptyBook();
    const q = previewMarketSell(b, launch, tokensIn);
    if (q.usdcOut <= 0n) throw new LaunchError("InsufficientLiquidity");
    const venue: SellPreview["venue"] = q.bookTokens > 0n && q.ammTokens === 0n ? "book" : q.bookTokens === 0n ? "uniswap" : "book";
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
  const gross = getUsdcOut(launch.virtualUsdc, launch.virtualTokens, tokensIn);
  const fees = splitFees(gross);
  if (gross > launch.realUsdc) throw new LaunchError("InsufficientRealUsdc");
  const mid = (tokensIn * launch.virtualUsdc) / launch.virtualTokens;
  return { usdcOut: fees.net, ...fees, impactBps: impactFromK(mid, gross), venue: "curve" };
}

function graduate(s: EngineState, launch: Launch, account: string) {
  if (launch.status === "graduated") throw new LaunchError("AlreadyGraduated");
  if (launch.realUsdc < GRADUATE_AT) throw new LaunchError("NotGraduated");
  const remaining = launch.virtualTokens;
  launch.reserveUsdc = launch.realUsdc;
  launch.reserveToken = remaining;
  const liq = sqrt(launch.reserveUsdc * launch.reserveToken);
  launch.lpBurned = liq;
  launch.lpSupply = 0n;
  launch.pair = addr("pair", s.nextId++);
  launch.book = addr("book", s.nextId++);
  launch.status = "graduated";
  launch.graduatedAt = now();
  launch.realUsdc = 0n;
  void DEAD;
  void MINIMUM_LIQUIDITY;
  pushTrade(s, launch, "graduate", account, launch.reserveUsdc, remaining);
  const mmTok = 80_000_000n * WAD;
  creditToken(s, launch.id, BOOK_MM, mmTok);
  s.books[launch.id] = seedBook(
    launch,
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

  if (launch.status === "graduated") {
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
  recountHolders(next, launch);
  pushTrade(next, launch, "buy", account, usdcIn, tokensOut, now(), ARC_CCTP_DOMAIN, sourceDomain);

  if (launch.realUsdc >= GRADUATE_AT) graduate(next, launch, account);
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

  if (launch.status === "graduated") {
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
  if (launch.status !== "graduated") throw new LaunchError("NotGraduated");
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
  if (launch.status !== "graduated") throw new LaunchError("NotGraduated");
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
  if (launch.status === "graduated") {
    const mid = bookMid(book);
    if (mid) return mid;
    if (launch.reserveToken === 0n) return 0n;
    return (launch.reserveUsdc * WAD) / launch.reserveToken;
  }
  return spotPrice(launch.virtualUsdc, launch.virtualTokens);
}

export function graduateProgress(launch: Launch): number {
  if (launch.status === "graduated") return 1;
  const bps = Number((launch.realUsdc * 10_000n) / GRADUATE_AT);
  return Math.min(1, bps / 10_000);
}

export function raisedOf(launch: Launch): bigint {
  return launch.status === "graduated" ? launch.reserveUsdc : launch.realUsdc;
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
  raised: bigint;
  volume: bigint;
} {
  let raised = 0n;
  let volume = 0n;
  let graduated = 0;
  for (const l of s.launches) {
    raised += raisedOf(l);
    volume += l.volumeUsdc;
    if (l.status === "graduated") graduated += 1;
  }
  return { count: s.launches.length, graduated, raised, volume };
}

export function minOut(quoted: bigint, slippageBps: bigint): bigint {
  return (quoted * (10_000n - slippageBps)) / 10_000n;
}

export function venueOf(launch: Launch): "curve" | "uniswap" | "book" {
  return launch.status === "graduated" ? "book" : "curve";
}
