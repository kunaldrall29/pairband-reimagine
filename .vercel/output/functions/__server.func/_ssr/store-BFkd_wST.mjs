import { _ as VIRTUAL_USDC, d as GRADUATE_AT, f as MIN_LP_TOKENS, g as VIRTUAL_TOKENS, h as TREASURY, i as CREATOR_FEE_BPS, l as FAUCET_AMOUNT, m as TOTAL_SUPPLY, n as ARC_TESTNET_ID, p as PROTOCOL_FEE_BPS, r as BPS_DENOM, s as DEMO_USER, t as AMM_FEE_BPS, u as FAUCET_CAP, v as WAD } from "./format-BlK3yrc5.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BFkd_wST.js
var LaunchError = class extends Error {
	code;
	constructor(code, message) {
		super(message ?? code);
		this.name = "LaunchError";
		this.code = code;
	}
};
function getAmountOut(amountIn, reserveIn, reserveOut) {
	if (amountIn <= 0n) throw new LaunchError("ZeroAmount");
	if (reserveIn === 0n || reserveOut === 0n) throw new LaunchError("InsufficientLiquidity");
	const amountInWithFee = amountIn * (BPS_DENOM - AMM_FEE_BPS);
	const out = amountInWithFee * reserveOut / (reserveIn * BPS_DENOM + amountInWithFee);
	if (out <= 0n || out >= reserveOut) throw new LaunchError("InsufficientLiquidity");
	return out;
}
function quote(amountIn, reserveIn, reserveOut) {
	if (amountIn <= 0n || reserveIn === 0n) return 0n;
	return amountIn * reserveOut / reserveIn;
}
/** Mid vs execution, in basis points. Includes the 0.3% Uniswap fee. */
function priceImpactBps(amountIn, reserveIn, reserveOut) {
	if (amountIn <= 0n || reserveIn === 0n || reserveOut === 0n) return 0;
	const mid = quote(amountIn, reserveIn, reserveOut);
	if (mid === 0n) return 0;
	try {
		const exec = getAmountOut(amountIn, reserveIn, reserveOut);
		if (exec >= mid) return 0;
		return Number((mid - exec) * 10000n / mid);
	} catch {
		return 1e4;
	}
}
function poolK(reserve0, reserve1) {
	return reserve0 * reserve1;
}
/** Uniswap v3-style sqrtPriceX96 = sqrt(token1/token0) * 2^96. token1 = USDC, token0 = token. */
function sqrtPriceX96(reserveToken, reserveUsdc) {
	if (reserveToken <= 0n || reserveUsdc <= 0n) return 0n;
	return sqrt(reserveUsdc) * 2n ** 96n / sqrt(reserveToken);
}
function sqrt(v) {
	if (v <= 0n) return 0n;
	let z = v;
	let x = v / 2n + 1n;
	while (x < z) {
		z = x;
		x = (v / x + x) / 2n;
	}
	return z;
}
function splitFees(usdcIn) {
	if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
	const protocol = usdcIn * PROTOCOL_FEE_BPS / BPS_DENOM;
	const creator = usdcIn * CREATOR_FEE_BPS / BPS_DENOM;
	return {
		protocol,
		creator,
		net: usdcIn - protocol - creator
	};
}
function getTokensOut(virtualUsdc, virtualTokens, netUsdcIn) {
	if (netUsdcIn <= 0n) throw new LaunchError("ZeroAmount");
	if (virtualUsdc === 0n || virtualTokens === 0n) throw new LaunchError("InsufficientLiquidity");
	const newUsdc = virtualUsdc + netUsdcIn;
	const newTokens = virtualUsdc * virtualTokens / newUsdc;
	if (newTokens >= virtualTokens) throw new LaunchError("InsufficientLiquidity");
	return virtualTokens - newTokens;
}
function getUsdcOut(virtualUsdc, virtualTokens, tokensIn) {
	if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
	if (virtualUsdc === 0n || virtualTokens === 0n) throw new LaunchError("InsufficientLiquidity");
	const newTokens = virtualTokens + tokensIn;
	const newUsdc = virtualUsdc * virtualTokens / newTokens;
	if (newUsdc >= virtualUsdc) throw new LaunchError("InsufficientLiquidity");
	return virtualUsdc - newUsdc;
}
function spotPrice(virtualUsdc, virtualTokens) {
	if (virtualTokens === 0n) return 0n;
	return virtualUsdc * WAD / virtualTokens;
}
var MAKERS = [
	DEMO_USER,
	"0xB0B0000000000000000000000000000000000B0B",
	"0xC0FFEE0000000000000000000000000000000CE",
	"0xD00D0000000000000000000000000000000D00D"
];
var CATALOG = [
	{
		name: "Paperclip",
		symbol: "PAPER",
		description: "Office-supply maximalism. One clip, infinite USDC.",
		raised: 4n * WAD,
		graduated: false,
		hoursAgo: 1
	},
	{
		name: "Teal Machine",
		symbol: "TEAL",
		description: "One buy from Uniswap. $72 of $80 on the curve.",
		raised: 72n * WAD,
		graduated: false,
		hoursAgo: 6
	},
	{
		name: "Ink Protocol",
		symbol: "INK",
		description: "Editorial liquidity. Writes itself into the pool.",
		raised: 28n * WAD,
		graduated: false,
		hoursAgo: 14
	},
	{
		name: "Pairband",
		symbol: "BAND",
		description: "The house token. Curve, then locked Uniswap.",
		raised: 36n * WAD,
		graduated: false,
		hoursAgo: 20
	},
	{
		name: "Clayform",
		symbol: "CLAY",
		description: "Warm clay, cold settlement. Quote is always USDC.",
		raised: 12n * WAD,
		graduated: false,
		hoursAgo: 30
	},
	{
		name: "Glassfield",
		symbol: "GLASS",
		description: "Frosted range. You can see the other side.",
		raised: 51n * WAD,
		graduated: false,
		hoursAgo: 40
	},
	{
		name: "Nexus",
		symbol: "NEXUS",
		description: "Graduated. LP burned to 0xdead. Trade the Uniswap pair.",
		raised: GRADUATE_AT,
		graduated: true,
		hoursAgo: 72
	},
	{
		name: "Arc US",
		symbol: "ARCUS",
		description: "USDC-native from block one. Already on the AMM.",
		raised: 96n * WAD,
		graduated: true,
		hoursAgo: 90
	}
];
function applyRaise(launch, netUsdc) {
	const tokensOut = getTokensOut(launch.virtualUsdc, launch.virtualTokens, netUsdc);
	launch.virtualUsdc += netUsdc;
	launch.virtualTokens -= tokensOut;
	launch.realUsdc += netUsdc;
	launch.tokensSold += tokensOut;
	return tokensOut;
}
function seedLaunches(s, h) {
	for (const row of CATALOG) {
		const n = s.nextId++;
		const id = `${row.symbol.toLowerCase()}-${n}`;
		const creator = MAKERS[n % MAKERS.length];
		const createdAt = h.now() - row.hoursAgo * 36e5;
		const launch = {
			id,
			token: h.addr("token", n),
			curve: h.addr("curve", n),
			pair: null,
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
			lastTradeAt: createdAt
		};
		const fees = splitFees(row.raised);
		launch.protocolFees = fees.protocol;
		launch.creatorFees = fees.creator;
		h.creditUsdc(s, launch.creator, fees.creator);
		const STEPS = 6;
		let remaining = fees.net;
		h.pushTrade(s, launch, "create", creator, 0n, TOTAL_SUPPLY, createdAt);
		for (let i = 0; i < STEPS; i++) {
			const chunk = i === 5 ? remaining : remaining / BigInt(STEPS - i);
			if (chunk <= 0n) continue;
			remaining -= chunk;
			const tok = applyRaise(launch, chunk);
			const maker = MAKERS[(n + i) % MAKERS.length];
			const giveDemo = (row.symbol === "PAPER" || row.symbol === "TEAL") && maker !== "0xA11CE00000000000000000000000000000000A11" ? tok / 5n : 0n;
			h.creditToken(s, id, maker, tok - giveDemo);
			if (giveDemo > 0n) h.creditToken(s, id, DEMO_USER, giveDemo);
			const at = createdAt + (i + 1) * 11 * 6e4;
			h.pushTrade(s, launch, "buy", maker, chunk, tok, at);
		}
		if (row.graduated) {
			launch.reserveUsdc = launch.realUsdc;
			launch.reserveToken = launch.virtualTokens;
			launch.lpBurned = sqrt(launch.reserveUsdc * launch.reserveToken);
			launch.lpSupply = 0n;
			launch.pair = h.addr("pair", n);
			launch.status = "graduated";
			launch.graduatedAt = createdAt + 42e5;
			launch.realUsdc = 0n;
			h.pushTrade(s, launch, "graduate", creator, launch.reserveUsdc, launch.reserveToken, launch.graduatedAt);
			const swapIn = 3n * WAD;
			const out = getAmountOut(swapIn, launch.reserveUsdc, launch.reserveToken);
			launch.reserveUsdc += swapIn;
			launch.reserveToken -= out;
			const taker = MAKERS[(n + 2) % MAKERS.length];
			h.creditToken(s, id, taker, out);
			h.pushTrade(s, launch, "swap", taker, swapIn, out, launch.graduatedAt + 18e5);
		}
		const bag = s.tokens[id] ?? {};
		launch.holders = Object.values(bag).filter((v) => v > 0n).length;
		s.launches.push(launch);
		s.tokens[id] ??= {};
	}
	s.launches.sort((a, b) => b.createdAt - a.createdAt);
}
function addr(kind, n) {
	const hex = n.toString(16).padStart(8, "0");
	return `0x${kind === "token" ? "70" : kind === "curve" ? "C0" : kind === "pair" ? "A0" : "D0"}${hex}${"0".repeat(30)}`.slice(0, 42);
}
function hueOf(symbol) {
	let h = 0;
	for (let i = 0; i < symbol.length; i++) h = h * 33 + symbol.charCodeAt(i) >>> 0;
	return h % 360;
}
function now() {
	return Date.now();
}
function clone(v) {
	return structuredClone(v);
}
function creditToken(s, launchId, account, amount) {
	const bag = s.tokens[launchId] ?? (s.tokens[launchId] = {});
	bag[account] = (bag[account] ?? 0n) + amount;
}
function debitToken(s, launchId, account, amount) {
	const bag = s.tokens[launchId] ?? (s.tokens[launchId] = {});
	const prev = bag[account] ?? 0n;
	if (prev < amount) throw new LaunchError("InsufficientBalance");
	bag[account] = prev - amount;
}
function debitUsdc(s, account, amount) {
	const prev = s.usdc[account] ?? 0n;
	if (prev < amount) throw new LaunchError("InsufficientBalance");
	s.usdc[account] = prev - amount;
}
function creditUsdc(s, account, amount) {
	s.usdc[account] = (s.usdc[account] ?? 0n) + amount;
}
function impactFromK(midOut, execOut) {
	if (midOut <= 0n) return 0;
	if (execOut >= midOut) return 0;
	return Number((midOut - execOut) * 10000n / midOut);
}
function pushTrade(s, launch, side, account, usdc, tokens, at = now()) {
	const t = {
		id: `t${s.trades.length + 1}`,
		launchId: launch.id,
		side,
		account,
		usdc,
		tokens,
		price: launch.status === "graduated" ? launch.reserveToken === 0n ? 0n : launch.reserveUsdc * WAD / launch.reserveToken : spotPrice(launch.virtualUsdc, launch.virtualTokens),
		at
	};
	if (side === "buy" || side === "sell" || side === "swap") {
		launch.volumeUsdc += usdc;
		launch.txCount += 1;
		launch.lastTradeAt = at;
	}
	s.trades = [t, ...s.trades].slice(0, 500);
	return t;
}
function recountHolders(s, launch) {
	const bag = s.tokens[launch.id] ?? {};
	launch.holders = Object.values(bag).filter((v) => v > 0n).length;
}
function createEngine() {
	const s = {
		chainId: ARC_TESTNET_ID,
		usdc: {
			[DEMO_USER]: 10000n * WAD,
			[TREASURY]: 0n
		},
		tokens: {},
		launches: [],
		trades: [],
		created: [],
		nextId: 1
	};
	seedLaunches(s, {
		addr,
		hueOf,
		creditToken,
		creditUsdc,
		pushTrade,
		now
	});
	return s;
}
function findLaunch(s, id) {
	const l = s.launches.find((x) => x.id === id);
	if (!l) throw new LaunchError("UnknownLaunch");
	return l;
}
function previewBuy(launch, usdcIn) {
	if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
	if (launch.status === "graduated") return {
		tokensOut: getAmountOut(usdcIn, launch.reserveUsdc, launch.reserveToken),
		protocol: 0n,
		creator: 0n,
		net: usdcIn,
		impactBps: priceImpactBps(usdcIn, launch.reserveUsdc, launch.reserveToken),
		venue: "uniswap"
	};
	const fees = splitFees(usdcIn);
	const tokensOut = getTokensOut(launch.virtualUsdc, launch.virtualTokens, fees.net);
	if (launch.virtualTokens - tokensOut < MIN_LP_TOKENS) throw new LaunchError("BelowMinLp");
	const mid = fees.net * launch.virtualTokens / launch.virtualUsdc;
	return {
		tokensOut,
		...fees,
		impactBps: impactFromK(mid, tokensOut),
		venue: "curve"
	};
}
function previewSell(launch, tokensIn) {
	if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
	if (launch.status === "graduated") {
		const out = getAmountOut(tokensIn, launch.reserveToken, launch.reserveUsdc);
		return {
			usdcOut: out,
			protocol: 0n,
			creator: 0n,
			net: out,
			impactBps: priceImpactBps(tokensIn, launch.reserveToken, launch.reserveUsdc),
			venue: "uniswap"
		};
	}
	const gross = getUsdcOut(launch.virtualUsdc, launch.virtualTokens, tokensIn);
	const fees = splitFees(gross);
	if (gross > launch.realUsdc) throw new LaunchError("InsufficientRealUsdc");
	const mid = tokensIn * launch.virtualUsdc / launch.virtualTokens;
	return {
		usdcOut: fees.net,
		...fees,
		impactBps: impactFromK(mid, gross),
		venue: "curve"
	};
}
function graduate(s, launch, account) {
	if (launch.status === "graduated") throw new LaunchError("AlreadyGraduated");
	if (launch.realUsdc < GRADUATE_AT) throw new LaunchError("NotGraduated");
	const remaining = launch.virtualTokens;
	launch.reserveUsdc = launch.realUsdc;
	launch.reserveToken = remaining;
	launch.lpBurned = sqrt(launch.reserveUsdc * launch.reserveToken);
	launch.lpSupply = 0n;
	launch.pair = addr("pair", s.nextId++);
	launch.status = "graduated";
	launch.graduatedAt = now();
	launch.realUsdc = 0n;
	pushTrade(s, launch, "graduate", account, launch.reserveUsdc, remaining);
}
function createLaunch(s, account, name, symbol, description) {
	const n = name.trim();
	const sym = symbol.trim().toUpperCase();
	const d = description.trim();
	if (n.length < 2 || n.length > 32 || !/^[A-Z0-9]{2,12}$/.test(sym) || d.length > 280) throw new LaunchError("InvalidMeta");
	const next = clone(s);
	const id = `${sym.toLowerCase()}-${next.nextId}`;
	const createdAt = now();
	const launch = {
		id,
		token: addr("token", next.nextId),
		curve: addr("curve", next.nextId),
		pair: null,
		name: n,
		symbol: sym,
		description: d,
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
		lastTradeAt: createdAt
	};
	next.nextId += 1;
	next.launches = [launch, ...next.launches];
	next.created = [id, ...next.created];
	next.tokens[id] = {};
	creditUsdc(next, account, 0n);
	pushTrade(next, launch, "create", account, 0n, TOTAL_SUPPLY);
	return {
		state: next,
		launch
	};
}
function buy(s, account, launchId, usdcIn, minTokensOut = 0n) {
	if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
	const next = clone(s);
	const launch = findLaunch(next, launchId);
	debitUsdc(next, account, usdcIn);
	if (launch.status === "graduated") {
		const out = getAmountOut(usdcIn, launch.reserveUsdc, launch.reserveToken);
		if (out < minTokensOut) throw new LaunchError("Slippage");
		launch.reserveUsdc += usdcIn;
		launch.reserveToken -= out;
		creditToken(next, launchId, account, out);
		recountHolders(next, launch);
		pushTrade(next, launch, "swap", account, usdcIn, out);
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
	pushTrade(next, launch, "buy", account, usdcIn, tokensOut);
	if (launch.realUsdc >= GRADUATE_AT) graduate(next, launch, account);
	return next;
}
function sell(s, account, launchId, tokensIn, minUsdcOut = 0n) {
	if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
	const next = clone(s);
	const launch = findLaunch(next, launchId);
	debitToken(next, launchId, account, tokensIn);
	if (launch.status === "graduated") {
		const out = getAmountOut(tokensIn, launch.reserveToken, launch.reserveUsdc);
		if (out < minUsdcOut) throw new LaunchError("Slippage");
		launch.reserveToken += tokensIn;
		launch.reserveUsdc -= out;
		creditUsdc(next, account, out);
		recountHolders(next, launch);
		pushTrade(next, launch, "swap", account, out, tokensIn);
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
function faucet(s, account) {
	const next = clone(s);
	const cur = next.usdc[account] ?? 0n;
	if (cur >= FAUCET_CAP) throw new LaunchError("FaucetCapped");
	const room = FAUCET_CAP - cur;
	const add = room < FAUCET_AMOUNT ? room : FAUCET_AMOUNT;
	if (add <= 0n) throw new LaunchError("FaucetCapped");
	next.usdc[account] = cur + add;
	return next;
}
function tokenBalance(s, launchId, account) {
	return s.tokens[launchId]?.[account] ?? 0n;
}
function usdcBalance(s, account) {
	return s.usdc[account] ?? 0n;
}
function marketCap(launch) {
	if (launch.status === "graduated") {
		if (launch.reserveToken === 0n) return 0n;
		return launch.reserveUsdc * TOTAL_SUPPLY / launch.reserveToken;
	}
	return launch.virtualUsdc * TOTAL_SUPPLY / launch.virtualTokens;
}
function priceOf(launch) {
	if (launch.status === "graduated") {
		if (launch.reserveToken === 0n) return 0n;
		return launch.reserveUsdc * WAD / launch.reserveToken;
	}
	return spotPrice(launch.virtualUsdc, launch.virtualTokens);
}
function graduateProgress(launch) {
	if (launch.status === "graduated") return 1;
	const bps = Number(launch.realUsdc * 10000n / GRADUATE_AT);
	return Math.min(1, bps / 1e4);
}
function raisedOf(launch) {
	return launch.status === "graduated" ? launch.reserveUsdc : launch.realUsdc;
}
function holdersOf(s, launchId) {
	const bag = s.tokens[launchId] ?? {};
	return Object.entries(bag).filter(([, amount]) => amount > 0n).map(([account, amount]) => ({
		account,
		amount
	})).sort((a, b) => a.amount < b.amount ? 1 : -1);
}
function priceSeries(s, launchId) {
	return s.trades.filter((t) => t.launchId === launchId && t.price > 0n).slice().reverse().map((t) => ({
		t: t.at,
		p: Number(t.price) / Number(WAD),
		side: t.side
	}));
}
function protocolStats(s) {
	let raised = 0n;
	let volume = 0n;
	let graduated = 0;
	for (const l of s.launches) {
		raised += raisedOf(l);
		volume += l.volumeUsdc;
		if (l.status === "graduated") graduated += 1;
	}
	return {
		count: s.launches.length,
		graduated,
		raised,
		volume
	};
}
function minOut(quoted, slippageBps) {
	return quoted * (10000n - slippageBps) / 10000n;
}
var KEY = "pairband.launch.v2";
var DARK_KEY = "pairband.dark";
var WATCH_KEY = "pairband.watch.v1";
function serialize(s) {
	return JSON.stringify(s, (_k, v) => typeof v === "bigint" ? `${v}n` : v);
}
function revive(raw) {
	try {
		const parsed = JSON.parse(raw, (_k, v) => typeof v === "string" && /^-?\d+n$/.test(v) ? BigInt(v.slice(0, -1)) : v);
		if (!parsed?.launches || !parsed.usdc) return null;
		if (!Array.isArray(parsed.launches) || parsed.launches.length === 0) return null;
		const first = parsed.launches[0];
		if (first && typeof first.lpBurned !== "bigint") return null;
		return parsed;
	} catch {
		return null;
	}
}
function loadEngine() {
	if (typeof window === "undefined") return createEngine();
	const raw = window.localStorage.getItem(KEY);
	if (!raw) return createEngine();
	return revive(raw) ?? createEngine();
}
function persist(s) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, serialize(s));
}
function loadWatch() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(WATCH_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
var useLaunchpad = create((set, get) => ({
	engine: createEngine(),
	version: 0,
	dark: false,
	account: DEMO_USER,
	lastError: null,
	pending: false,
	watchlist: [],
	lastEvent: null,
	setDark: (v) => {
		if (typeof window !== "undefined") window.localStorage.setItem(DARK_KEY, v ? "1" : "0");
		set({ dark: v });
	},
	resetDemo: () => {
		const engine = createEngine();
		persist(engine);
		if (typeof window !== "undefined") window.localStorage.removeItem(WATCH_KEY);
		set({
			engine,
			version: get().version + 1,
			lastError: null,
			watchlist: [],
			lastEvent: null
		});
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
			const state = faucet(get().engine, get().account);
			persist(state);
			set({
				engine: state,
				version: get().version + 1,
				lastError: null
			});
			return true;
		} catch (e) {
			set({ lastError: e instanceof LaunchError ? e.code : "Faucet failed" });
			return false;
		}
	},
	create: (name, symbol, description, firstBuy = 0n) => {
		try {
			let { state, launch } = createLaunch(get().engine, get().account, name, symbol, description);
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
				lastEvent: {
					kind: graduated ? "graduate" : "create",
					id: launch.id,
					symbol: launch.symbol
				}
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
			const state = buy(get().engine, get().account, id, usdcIn, minOut);
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
					symbol: after.symbol
				}
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
				lastEvent: {
					kind: "trade",
					id,
					symbol: after.symbol
				}
			});
			return true;
		} catch (e) {
			set({ lastError: e instanceof LaunchError ? e.code : "Sell failed" });
			return false;
		}
	}
}));
function hydrateLaunchpad() {
	if (typeof window === "undefined") return;
	const engine = loadEngine();
	const dark = window.localStorage.getItem(DARK_KEY) === "1";
	const watchlist = loadWatch();
	useLaunchpad.setState({
		engine,
		dark,
		watchlist,
		version: useLaunchpad.getState().version + 1
	});
	if (dark) document.documentElement.classList.add("dark");
	else document.documentElement.classList.remove("dark");
}
//#endregion
export { useLaunchpad as _, marketCap as a, previewBuy as c, priceSeries as d, protocolStats as f, usdcBalance as g, tokenBalance as h, hydrateLaunchpad as i, previewSell as l, sqrtPriceX96 as m, graduateProgress as n, minOut as o, raisedOf as p, holdersOf as r, poolK as s, LaunchError as t, priceOf as u };
