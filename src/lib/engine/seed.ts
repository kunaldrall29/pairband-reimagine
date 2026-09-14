import { getAmountOut, sqrt } from "./amm.ts";
import { seedBook } from "./book.ts";
import {
  BOOK_MM,
  DEMO_USER,
  GRADUATE_AT,
  TOTAL_SUPPLY,
  VIRTUAL_TOKENS,
  VIRTUAL_USDC,
  WAD,
} from "./constants.ts";
import { getTokensOut, splitFees } from "./curve.ts";
import type { EngineState, Launch, Side, Trade } from "./types.ts";
import { createEngine } from "./launchpad.ts";

type Helpers = {
  addr: (kind: string, n: number) => string;
  hueOf: (symbol: string) => number;
  creditToken: (s: EngineState, launchId: string, account: string, amount: bigint) => void;
  creditUsdc: (s: EngineState, account: string, amount: bigint) => void;
  pushTrade: (
    s: EngineState,
    launch: Launch,
    side: Side,
    account: string,
    usdc: bigint,
    tokens: bigint,
    at?: number,
  ) => Trade;
  now: () => number;
};

const MAKERS = [
  DEMO_USER,
  "0xB0B0000000000000000000000000000000000B0B",
  "0xC0FFEE0000000000000000000000000000000CE",
  "0xD00D0000000000000000000000000000000D00D",
] as const;

const CATALOG: Array<{
  name: string;
  symbol: string;
  description: string;
  raised: bigint;
  graduated: boolean;
  hoursAgo: number;
}> = [
  {
    name: "Paperclip",
    symbol: "PAPER",
    description: "Office-supply maximalism. One clip, infinite USDC.",
    raised: 4n * WAD,
    graduated: false,
    hoursAgo: 1,
  },
  {
    name: "Teal Machine",
    symbol: "TEAL",
    description: "One buy from Uniswap. $72 of $80 on the curve.",
    raised: 72n * WAD,
    graduated: false,
    hoursAgo: 6,
  },
  {
    name: "Ink Protocol",
    symbol: "INK",
    description: "Editorial liquidity. Writes itself into the pool.",
    raised: 28n * WAD,
    graduated: false,
    hoursAgo: 14,
  },
  {
    name: "Pairband",
    symbol: "BAND",
    description: "The house token. Curve, then locked Uniswap.",
    raised: 36n * WAD,
    graduated: false,
    hoursAgo: 20,
  },
  {
    name: "Clayform",
    symbol: "CLAY",
    description: "Warm clay, cold settlement. Quote is always USDC.",
    raised: 12n * WAD,
    graduated: false,
    hoursAgo: 30,
  },
  {
    name: "Glassfield",
    symbol: "GLASS",
    description: "Frosted range. You can see the other side.",
    raised: 51n * WAD,
    graduated: false,
    hoursAgo: 40,
  },
  {
    name: "Nexus",
    symbol: "NEXUS",
    description: "Graduated. LP burned to 0xdead. Trade the Uniswap pair.",
    raised: GRADUATE_AT,
    graduated: true,
    hoursAgo: 72,
  },
  {
    name: "Arc US",
    symbol: "ARCUS",
    description: "USDC-native from block one. Already on the AMM.",
    raised: 96n * WAD,
    graduated: true,
    hoursAgo: 90,
  },
];

function applyRaise(launch: Launch, netUsdc: bigint): bigint {
  const tokensOut = getTokensOut(launch.virtualUsdc, launch.virtualTokens, netUsdc);
  launch.virtualUsdc += netUsdc;
  launch.virtualTokens -= tokensOut;
  launch.realUsdc += netUsdc;
  launch.tokensSold += tokensOut;
  return tokensOut;
}

export function seedLaunches(s: EngineState, h: Helpers) {
  for (const row of CATALOG) {
    const n = s.nextId++;
    const id = `${row.symbol.toLowerCase()}-${n}`;
    const creator = MAKERS[n % MAKERS.length]!;
    const createdAt = h.now() - row.hoursAgo * 3600_000;
    const launch: Launch = {
      id,
      token: h.addr("token", n),
      curve: h.addr("curve", n),
      pair: null,
      book: null,
      name: row.name,
      symbol: row.symbol,
      description: row.description,
      hue: h.hueOf(row.symbol + String(n)),
      creator,
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

    const fees = splitFees(row.raised);
    launch.protocolFees = fees.protocol;
    launch.creatorFees = fees.creator;
    h.creditUsdc(s, launch.creator, fees.creator);

    const STEPS = 6;
    let remaining = fees.net;
    h.pushTrade(s, launch, "create", creator, 0n, TOTAL_SUPPLY, createdAt);

    for (let i = 0; i < STEPS; i++) {
      const chunk = i === STEPS - 1 ? remaining : remaining / BigInt(STEPS - i);
      if (chunk <= 0n) continue;
      remaining -= chunk;
      const tok = applyRaise(launch, chunk);
      const maker = MAKERS[(n + i) % MAKERS.length]!;
      const giveDemo =
        (row.symbol === "PAPER" || row.symbol === "TEAL") && maker !== DEMO_USER ? tok / 5n : 0n;
      h.creditToken(s, id, maker, tok - giveDemo);
      if (giveDemo > 0n) h.creditToken(s, id, DEMO_USER, giveDemo);
      const at = createdAt + (i + 1) * 11 * 60_000;
      h.pushTrade(s, launch, "buy", maker, chunk, tok, at);
    }

    if (row.graduated) {
      launch.reserveUsdc = launch.realUsdc;
      launch.reserveToken = launch.virtualTokens;
      const liq = sqrt(launch.reserveUsdc * launch.reserveToken);
      launch.lpBurned = liq;
      launch.lpSupply = 0n;
      launch.pair = h.addr("pair", n);
      launch.status = "graduated";
      launch.graduatedAt = createdAt + 70 * 60_000;
      launch.realUsdc = 0n;
      h.pushTrade(
        s,
        launch,
        "graduate",
        creator,
        launch.reserveUsdc,
        launch.reserveToken,
        launch.graduatedAt,
      );

      const swapIn = 3n * WAD;
      const out = getAmountOut(swapIn, launch.reserveUsdc, launch.reserveToken);
      launch.reserveUsdc += swapIn;
      launch.reserveToken -= out;
      const taker = MAKERS[(n + 2) % MAKERS.length]!;
      h.creditToken(s, id, taker, out);
      h.pushTrade(s, launch, "swap", taker, swapIn, out, launch.graduatedAt + 30 * 60_000);

      h.creditToken(s, id, BOOK_MM, 80_000_000n * WAD);
      s.books[id] = seedBook(
        launch,
        [BOOK_MM],
        (who, amt) => {
          const bag = s.tokens[id] ?? (s.tokens[id] = {});
          if ((bag[who] ?? 0n) < amt) return false;
          bag[who] -= amt;
          return true;
        },
        (who, amt) => {
          const prev = s.usdc[who] ?? 0n;
          if (prev < amt) s.usdc[who] = amt;
          s.usdc[who] = (s.usdc[who] ?? 0n) - amt;
        },
        launch.graduatedAt,
      );
      launch.book = h.addr("book", n);
    }

    const bag = s.tokens[id] ?? {};
    launch.holders = Object.values(bag).filter((v) => v > 0n).length;
    s.launches.push(launch);
    s.tokens[id] ??= {};
    s.books[id] ??= { bids: [], asks: [], nextId: 1 };
  }
  s.launches.sort((a, b) => b.createdAt - a.createdAt);
}



/** Test/fixture engine with the offline demo catalog. Not used by the live app. */
export function createSeededEngine(): EngineState {
  const s = createEngine();
  s.usdc[DEMO_USER] = 10_000n * WAD;
  s.usdc[BOOK_MM] = 25_000n * WAD;
  s.remoteUsdc = {
    "0": { [DEMO_USER]: 2_500n * WAD },
    "6": { [DEMO_USER]: 1_800n * WAD },
    "10": { [DEMO_USER]: 900n * WAD },
    "3": { [DEMO_USER]: 1_200n * WAD },
    "2": { [DEMO_USER]: 400n * WAD },
    "5": { [DEMO_USER]: 750n * WAD },
  };

  const addr = (kind: string, n: number): string => {
    const hex = n.toString(16).padStart(8, "0");
    const pad = kind === "token" ? "70" : kind === "curve" ? "C0" : kind === "pair" ? "A0" : "D0";
    return `0x${pad}${hex}${"0".repeat(30)}`.slice(0, 42);
  };
  const hueOf = (symbol: string): number => {
    let h = 0;
    for (let i = 0; i < symbol.length; i++) h = (h * 33 + symbol.charCodeAt(i)) >>> 0;
    return h % 360;
  };
  const now = () => Date.now();
  const creditToken = (st: EngineState, launchId: string, account: string, amount: bigint) => {
    const bag = st.tokens[launchId] ?? (st.tokens[launchId] = {});
    bag[account] = (bag[account] ?? 0n) + amount;
  };
  const creditUsdc = (st: EngineState, account: string, amount: bigint) => {
    st.usdc[account] = (st.usdc[account] ?? 0n) + amount;
  };
  const pushTrade: Helpers["pushTrade"] = (st, launch, side, account, usdc, tokens, at = now()) => {
    const t: Trade = {
      id: `t${st.trades.length + 1}`,
      launchId: launch.id,
      side,
      account,
      usdc,
      tokens,
      price: tokens > 0n ? (usdc * WAD) / tokens : 0n,
      at,
      sourceDomain: 0,
      destDomain: 0,
    };
    if (side === "buy" || side === "sell" || side === "swap" || side === "fill") {
      launch.volumeUsdc += usdc;
      launch.txCount += 1;
      launch.lastTradeAt = at;
    }
    st.trades = [t, ...st.trades].slice(0, 500);
    return t;
  };

  seedLaunches(s, { addr, hueOf, creditToken, creditUsdc, pushTrade, now });
  return s;
}
