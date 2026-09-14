"use client";

import { create } from "zustand";
import { ARC_CCTP_DOMAIN } from "./cctp.ts";
import {
  bridgeOut as runBridgeOut,
  buy,
  cancel as runCancel,
  createEngine,
  isOnchainLaunchId,
  createLaunch,
  faucet as runFaucet,
  findLaunch,
  limitBuy,
  limitSell,
  sell,
} from "./launchpad.ts";
import type { EngineState, Launch, LaunchEvent } from "./types.ts";
import { LaunchError } from "./types.ts";

const KEY = "pairband.launch.v5";
const DARK_KEY = "pairband.dark";
const WATCH_KEY = "pairband.watch.v1";

function serialize(s: EngineState): string {
  return JSON.stringify(s, (_k, v) => (typeof v === "bigint" ? `${v}n` : v));
}

function stripSeededLaunches(s: EngineState): EngineState {
  const keep = s.launches.filter((l) => isOnchainLaunchId(l.id));
  const keepIds = new Set(keep.map((l) => l.id));
  const tokens: EngineState["tokens"] = {};
  const books: EngineState["books"] = {};
  for (const id of keepIds) {
    if (s.tokens[id]) tokens[id] = s.tokens[id]!;
    if (s.books[id]) books[id] = s.books[id]!;
  }
  return {
    ...s,
    launches: keep,
    tokens,
    books,
    created: (s.created ?? []).filter((id) => keepIds.has(id)),
    trades: (s.trades ?? []).filter((tr) => keepIds.has(tr.launchId)),
  };
}

function revive(raw: string): EngineState | null {
  try {
    const parsed = JSON.parse(raw, (_k, v) =>
      typeof v === "string" && /^-?\d+n$/.test(v) ? BigInt(v.slice(0, -1)) : v,
    ) as EngineState;
    if (!parsed?.launches || !parsed.usdc) return null;
    if (!Array.isArray(parsed.launches)) return null;
    const first = parsed.launches[0];
    if (first && typeof first.lpBurned !== "bigint") return null;
    if (!parsed.books || !parsed.remoteUsdc) return null;
    return stripSeededLaunches(parsed);
  } catch {
    return null;
  }
}

function loadEngine(): EngineState {
  if (typeof window === "undefined") return createEngine();
  let raw = window.localStorage.getItem(KEY);
  if (!raw) {
    // Migrate away from seeded v4 catalogs.
    raw = window.localStorage.getItem("pairband.launch.v4");
  }
  if (!raw) return createEngine();
  const engine = revive(raw) ?? createEngine();
  persist(engine);
  try {
    window.localStorage.removeItem("pairband.launch.v4");
  } catch {
    /* ignore */
  }
  return engine;
}

function persist(s: EngineState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, serialize(s));
}

function loadWatch(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WATCH_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export interface LaunchStore {
  engine: EngineState;
  version: number;
  dark: boolean;
  account: string;
  lastError: string | null;
  pending: boolean;
  watchlist: string[];
  lastEvent: LaunchEvent | null;
  sourceDomain: number;
  setDark: (v: boolean) => void;
  setSourceDomain: (d: number) => void;
  resetDemo: () => void;
  clearError: () => void;
  clearEvent: () => void;
  toggleWatch: (id: string) => void;
  faucet: () => boolean;
  create: (
    name: string,
    symbol: string,
    description: string,
    firstBuy?: bigint,
    meta?: {
      imageUrl?: string;
      website?: string;
      twitter?: string;
      telegram?: string;
      discord?: string;
      websiteVerified?: boolean;
      twitterVerified?: boolean;
      skipFee?: boolean;
    },
  ) => string | null;
  buy: (id: string, usdcIn: bigint, minOut?: bigint) => boolean;
  sell: (id: string, tokensIn: bigint, minOut?: bigint) => boolean;
  limitBuy: (id: string, price: bigint, usdcIn: bigint) => boolean;
  limitSell: (id: string, price: bigint, tokensIn: bigint) => boolean;
  cancel: (id: string, orderId: number) => boolean;
  bridgeOut: (destDomain: number, amount: bigint) => boolean;
  setAccount: (account: string) => void;
  setUsdcBalance: (account: string, amount: bigint) => void;
  setTokenBalance: (launchId: string, account: string, amount: bigint) => void;
  upsertOnchainLaunches: (launches: Launch[]) => void;
}

export const useLaunchpad = create<LaunchStore>((set, get) => ({
  engine: createEngine(),
  version: 0,
  dark: false,
  account: "",
  lastError: null,
  pending: false,
  watchlist: [],
  lastEvent: null,
  sourceDomain: ARC_CCTP_DOMAIN,
  setDark: (v) => {
    if (typeof window !== "undefined") window.localStorage.setItem(DARK_KEY, v ? "1" : "0");
    set({ dark: v });
  },
  setSourceDomain: (d) => set({ sourceDomain: d }),
  resetDemo: () => {
    const engine = createEngine();
    persist(engine);
    if (typeof window !== "undefined") window.localStorage.removeItem(WATCH_KEY);
    set({ engine, version: get().version + 1, lastError: null, watchlist: [], lastEvent: null });
  },
  clearError: () => set({ lastError: null }),
  clearEvent: () => set({ lastEvent: null }),
  toggleWatch: (id) => {
    const cur = get().watchlist;
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
    if (typeof window !== "undefined") window.localStorage.setItem(WATCH_KEY, JSON.stringify(next));
    set({ watchlist: next });
  },
  faucet: () => {
    try {
      const state = runFaucet(get().engine, get().account);
      persist(state);
      set({ engine: state, version: get().version + 1, lastError: null });
      return true;
    } catch (e) {
      set({ lastError: e instanceof LaunchError ? e.code : "Faucet failed" });
      return false;
    }
  },
  create: (name, symbol, description, firstBuy = 0n, meta) => {
    try {
      let { state, launch } = createLaunch(get().engine, get().account, name, symbol, description, meta);
      if (firstBuy > 0n) {
        state = buy(state, get().account, launch.id, firstBuy);
        launch = findLaunch(state, launch.id);
      }
      persist(state);
      const graduated = launch.status === "graduated";
      set({
        engine: state,
        version: get().version + 1,
        lastError: null,
        lastEvent: { kind: graduated ? "graduate" : "create", id: launch.id, symbol: launch.symbol },
      });
      return launch.id;
    } catch (e) {
      set({ lastError: e instanceof LaunchError ? e.code : "Create failed" });
      return null;
    }
  },
  buy: (id, usdcIn, minOut = 0n) => {
    try {
      const before = findLaunch(get().engine, id);
      const state = buy(get().engine, get().account, id, usdcIn, minOut, get().sourceDomain);
      const after = findLaunch(state, id);
      persist(state);
      const graduated = before.status === "curve" && after.status === "graduated";
      set({
        engine: state,
        version: get().version + 1,
        lastError: null,
        lastEvent: {
          kind: graduated ? "graduate" : "trade",
          id,
          symbol: after.symbol,
        },
      });
      return true;
    } catch (e) {
      set({ lastError: e instanceof LaunchError ? e.code : "Buy failed" });
      return false;
    }
  },
  sell: (id, tokensIn, minOut = 0n) => {
    try {
      const state = sell(get().engine, get().account, id, tokensIn, minOut);
      const after = findLaunch(state, id);
      persist(state);
      set({
        engine: state,
        version: get().version + 1,
        lastError: null,
        lastEvent: { kind: "trade", id, symbol: after.symbol },
      });
      return true;
    } catch (e) {
      set({ lastError: e instanceof LaunchError ? e.code : "Sell failed" });
      return false;
    }
  },
  limitBuy: (id, price, usdcIn) => {
    try {
      const state = limitBuy(get().engine, get().account, id, price, usdcIn, get().sourceDomain);
      persist(state);
      set({ engine: state, version: get().version + 1, lastError: null, lastEvent: { kind: "trade", id, symbol: findLaunch(state, id).symbol } });
      return true;
    } catch (e) {
      set({ lastError: e instanceof LaunchError ? e.code : "Limit failed" });
      return false;
    }
  },
  limitSell: (id, price, tokensIn) => {
    try {
      const state = limitSell(get().engine, get().account, id, price, tokensIn);
      persist(state);
      set({ engine: state, version: get().version + 1, lastError: null, lastEvent: { kind: "trade", id, symbol: findLaunch(state, id).symbol } });
      return true;
    } catch (e) {
      set({ lastError: e instanceof LaunchError ? e.code : "Limit failed" });
      return false;
    }
  },
  cancel: (id, orderId) => {
    try {
      const state = runCancel(get().engine, get().account, id, orderId);
      persist(state);
      set({ engine: state, version: get().version + 1, lastError: null });
      return true;
    } catch (e) {
      set({ lastError: e instanceof LaunchError ? e.code : "Cancel failed" });
      return false;
    }
  },
  bridgeOut: (destDomain, amount) => {
    try {
      const state = runBridgeOut(get().engine, get().account, destDomain, amount);
      persist(state);
      set({ engine: state, version: get().version + 1, lastError: null });
      return true;
    } catch (e) {
      set({ lastError: e instanceof LaunchError ? e.code : "Bridge failed" });
      return false;
    }
  },
  setAccount: (account) => set({ account }),
  setUsdcBalance: (account, amount) => {
    const engine = structuredClone(get().engine);
    engine.usdc[account] = amount;
    persist(engine);
    set({ engine, version: get().version + 1 });
  },
  setTokenBalance: (launchId, account, amount) => {
    const engine = structuredClone(get().engine);
    if (!engine.tokens[launchId]) engine.tokens[launchId] = {};
    engine.tokens[launchId][account] = amount;
    persist(engine);
    set({ engine, version: get().version + 1 });
  },
  upsertOnchainLaunches: (launches) => {
    const engine = structuredClone(get().engine);
    for (const launch of launches) {
      const idx = engine.launches.findIndex((l) => l.id === launch.id);
      if (idx >= 0) {
        const prev = engine.launches[idx]!;
        engine.launches[idx] = {
          ...prev,
          ...launch,
          // Keep stable discovery order and any user-authored description.
          createdAt: prev.createdAt > 0 ? prev.createdAt : launch.createdAt,
          description: prev.description.trim() ? prev.description : launch.description,
          holders: Math.max(prev.holders, launch.holders),
          volumeUsdc: launch.realUsdc > prev.volumeUsdc ? launch.realUsdc : prev.volumeUsdc,
          txCount: Math.max(prev.txCount, launch.txCount),
          lastTradeAt: Math.max(prev.lastTradeAt, launch.lastTradeAt),
        };
      } else {
        engine.launches.unshift(launch);
      }
      if (!engine.books[launch.id]) {
        engine.books[launch.id] = { bids: [], asks: [], nextId: 1 };
      }
    }
    persist(engine);
    set({ engine, version: get().version + 1 });
  },
}));

export function hydrateLaunchpad() {
  if (typeof window === "undefined") return;
  const engine = loadEngine();
  const dark = window.localStorage.getItem(DARK_KEY) === "1";
  const watchlist = loadWatch();
  useLaunchpad.setState({ engine, dark, watchlist, version: useLaunchpad.getState().version + 1 });
  if (dark) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
}
