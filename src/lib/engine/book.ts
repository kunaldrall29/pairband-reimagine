import { WAD } from "./constants.ts";
import { getAmountOut } from "./amm.ts";
import { LaunchError, type Book, type Fill, type Launch, type RestingOrder } from "./types.ts";

export function emptyBook(): Book {
  return { bids: [], asks: [], nextId: 1 };
}

export function tokensToUsdc(tokens: bigint, price: bigint): bigint {
  return (tokens * price) / WAD;
}

export function usdcToTokens(usdc: bigint, price: bigint): bigint {
  if (price === 0n) return 0n;
  return (usdc * WAD) / price;
}

function sortBook(book: Book) {
  book.bids.sort((a, b) => (a.price === b.price ? a.id - b.id : a.price < b.price ? 1 : -1));
  book.asks.sort((a, b) => (a.price === b.price ? a.id - b.id : a.price > b.price ? 1 : -1));
}

export function insertOrder(book: Book, order: RestingOrder) {
  if (order.side === "bid") book.bids.push(order);
  else book.asks.push(order);
  sortBook(book);
}

export function matchAsks(
  book: Book,
  usdcIn: bigint,
  limitPrice?: bigint,
): { fills: Fill[]; leftoverUsdc: bigint; tokensOut: bigint } {
  const fills: Fill[] = [];
  let usdcLeft = usdcIn;
  let tokensOut = 0n;
  while (usdcLeft > 0n && book.asks.length > 0) {
    const o = book.asks[0]!;
    if (limitPrice !== undefined && o.price > limitPrice) break;
    const maxTok = usdcToTokens(usdcLeft, o.price);
    const fillTok = maxTok < o.remaining ? maxTok : o.remaining;
    const fillUsdc = tokensToUsdc(fillTok, o.price);
    if (fillTok === 0n || fillUsdc === 0n) break;
    fills.push({
      orderId: o.id,
      owner: o.owner,
      side: "ask",
      price: o.price,
      tokens: fillTok,
      usdc: fillUsdc,
    });
    o.remaining -= fillTok;
    o.escrow -= fillTok;
    usdcLeft -= fillUsdc;
    tokensOut += fillTok;
    if (o.remaining === 0n) book.asks.shift();
  }
  return { fills, leftoverUsdc: usdcLeft, tokensOut };
}

export function matchBids(
  book: Book,
  tokensIn: bigint,
  limitPrice?: bigint,
): { fills: Fill[]; leftoverTokens: bigint; usdcOut: bigint } {
  const fills: Fill[] = [];
  let tokensLeft = tokensIn;
  let usdcOut = 0n;
  while (tokensLeft > 0n && book.bids.length > 0) {
    const o = book.bids[0]!;
    if (limitPrice !== undefined && o.price < limitPrice) break;
    const fillTok = tokensLeft < o.remaining ? tokensLeft : o.remaining;
    const fillUsdc = tokensToUsdc(fillTok, o.price);
    if (fillTok === 0n || fillUsdc === 0n) break;
    fills.push({
      orderId: o.id,
      owner: o.owner,
      side: "bid",
      price: o.price,
      tokens: fillTok,
      usdc: fillUsdc,
    });
    o.remaining -= fillTok;
    o.escrow -= fillUsdc;
    tokensLeft -= fillTok;
    usdcOut += fillUsdc;
    if (o.remaining === 0n) book.bids.shift();
  }
  return { fills, leftoverTokens: tokensLeft, usdcOut };
}

export function previewMarketBuy(
  book: Book,
  launch: Launch,
  usdcIn: bigint,
): { tokensOut: bigint; bookUsdc: bigint; ammUsdc: bigint; impactBps: number } {
  const asks = book.asks.map((o) => ({ ...o }));
  const ghost: Book = { bids: [], asks, nextId: book.nextId };
  const m = matchAsks(ghost, usdcIn);
  let ammOut = 0n;
  if (m.leftoverUsdc > 0n && launch.reserveUsdc > 0n && launch.reserveToken > 0n) {
    try {
      ammOut = getAmountOut(m.leftoverUsdc, launch.reserveUsdc, launch.reserveToken);
    } catch {
      ammOut = 0n;
    }
  }
  const tokensOut = m.tokensOut + ammOut;
  const bookUsdc = usdcIn - m.leftoverUsdc;
  const ammUsdc = ammOut > 0n ? m.leftoverUsdc : 0n;
  const spent = bookUsdc + ammUsdc;
  const mid = bookMid(book) ?? (launch.reserveToken === 0n ? 0n : (launch.reserveUsdc * WAD) / launch.reserveToken);
  const fair = mid === 0n ? tokensOut : usdcToTokens(spent || usdcIn, mid);
  const impact =
    fair > tokensOut && fair > 0n ? Number(((fair - tokensOut) * 10_000n) / fair) : 0;
  return { tokensOut, bookUsdc, ammUsdc, impactBps: impact };
}

export function previewMarketSell(
  book: Book,
  launch: Launch,
  tokensIn: bigint,
): { usdcOut: bigint; bookTokens: bigint; ammTokens: bigint; impactBps: number } {
  const bids = book.bids.map((o) => ({ ...o }));
  const ghost: Book = { bids, asks: [], nextId: book.nextId };
  const m = matchBids(ghost, tokensIn);
  let ammOut = 0n;
  if (m.leftoverTokens > 0n && launch.reserveUsdc > 0n && launch.reserveToken > 0n) {
    try {
      ammOut = getAmountOut(m.leftoverTokens, launch.reserveToken, launch.reserveUsdc);
    } catch {
      ammOut = 0n;
    }
  }
  const usdcOut = m.usdcOut + ammOut;
  const mid = bookMid(book) ?? (launch.reserveToken === 0n ? 0n : (launch.reserveUsdc * WAD) / launch.reserveToken);
  const fair = mid === 0n ? usdcOut : tokensToUsdc(tokensIn, mid);
  const impact = fair > usdcOut && fair > 0n ? Number(((fair - usdcOut) * 10_000n) / fair) : 0;
  return {
    usdcOut,
    bookTokens: tokensIn - m.leftoverTokens,
    ammTokens: ammOut > 0n ? m.leftoverTokens : 0n,
    impactBps: impact,
  };
}

export function bookMid(book: Book | undefined): bigint | null {
  if (!book?.bids.length || !book.asks.length) return null;
  return (book.bids[0]!.price + book.asks[0]!.price) / 2n;
}

export function spreadBps(book: Book | undefined): number | null {
  if (!book?.bids.length || !book.asks.length) return null;
  const bid = book.bids[0]!.price;
  const ask = book.asks[0]!.price;
  if (bid === 0n) return null;
  return Number(((ask - bid) * 10_000n) / bid);
}

export type LadderLevel = { price: bigint; tokens: bigint; usdc: bigint; count: number };

export function ladder(book: Book | undefined, depth = 8): { bids: LadderLevel[]; asks: LadderLevel[] } {
  if (!book) return { bids: [], asks: [] };
  const group = (orders: RestingOrder[], n: number) => {
    const map = new Map<string, LadderLevel>();
    for (const o of orders) {
      const k = o.price.toString();
      const cur = map.get(k) ?? { price: o.price, tokens: 0n, usdc: 0n, count: 0 };
      cur.tokens += o.remaining;
      cur.usdc += tokensToUsdc(o.remaining, o.price);
      cur.count += 1;
      map.set(k, cur);
      if (map.size >= n) break;
    }
    return [...map.values()];
  };
  return { bids: group(book.bids, depth), asks: group(book.asks, depth) };
}

export function cancelOrder(book: Book, id: number, owner: string): RestingOrder {
  const fromBids = book.bids.findIndex((o) => o.id === id);
  const fromAsks = book.asks.findIndex((o) => o.id === id);
  const o = fromBids >= 0 ? book.bids[fromBids] : fromAsks >= 0 ? book.asks[fromAsks] : undefined;
  if (!o) throw new LaunchError("OrderNotFound");
  if (o.owner.toLowerCase() !== owner.toLowerCase()) throw new LaunchError("NotOwner");
  if (fromBids >= 0) book.bids.splice(fromBids, 1);
  else book.asks.splice(fromAsks, 1);
  return o;
}

export function seedBook(
  launch: Launch,
  makers: readonly string[],
  debitToken: (account: string, amount: bigint) => boolean,
  takeUsdc: (account: string, amount: bigint) => void,
  now: number,
): Book {
  const book = emptyBook();
  const mid =
    launch.reserveToken === 0n ? 0n : (launch.reserveUsdc * WAD) / launch.reserveToken;
  if (mid === 0n) return book;
  const bps = [15n, 40n, 80n, 130n, 200n, 300n];
  for (let i = 0; i < bps.length; i++) {
    const maker = makers[i % makers.length]!;
    const askP = mid + (mid * bps[i]!) / 10_000n;
    const bidP = mid - (mid * bps[i]!) / 10_000n;
    const usdcSize = (1n + BigInt(i)) * WAD;
    const askTok = usdcToTokens(usdcSize, askP);
    const bidTok = usdcToTokens(usdcSize, bidP);
    if (askTok > 0n && debitToken(maker, askTok)) {
      insertOrder(book, {
        id: book.nextId++,
        launchId: launch.id,
        owner: maker,
        side: "ask",
        price: askP,
        remaining: askTok,
        escrow: askTok,
        createdAt: now,
      });
    }
    if (bidTok > 0n && bidP > 0n) {
      const escrow = tokensToUsdc(bidTok, bidP);
      takeUsdc(maker, escrow);
      insertOrder(book, {
        id: book.nextId++,
        launchId: launch.id,
        owner: maker,
        side: "bid",
        price: bidP,
        remaining: bidTok,
        escrow,
        createdAt: now,
      });
    }
  }
  return book;
}
