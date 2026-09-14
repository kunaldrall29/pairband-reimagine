import { C as VIRTUAL_TOKENS, S as TREASURY, T as WAD, b as PROTOCOL_FEE_BPS, c as BPS_DENOM, f as DEMO_USER, g as GRADUATE_AT, h as FAUCET_CAP, i as AMM_FEE_BPS, l as CREATOR_FEE_BPS, m as FAUCET_AMOUNT, o as ARC_TESTNET_ID, s as BOOK_MM, v as LAUNCH_FEE_USDC, w as VIRTUAL_USDC, x as TOTAL_SUPPLY, y as MIN_LP_TOKENS } from "./constants-BJEdPgzX.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DuP6GcAD.js
var CCTP_CHAINS = [
	{
		id: "arc",
		domain: 26,
		name: "Arc",
		short: "ARC",
		chainId: 5042002,
		fast: false
	},
	{
		id: "eth",
		domain: 0,
		name: "Ethereum",
		short: "ETH",
		chainId: 1,
		fast: true
	},
	{
		id: "base",
		domain: 6,
		name: "Base",
		short: "BASE",
		chainId: 8453,
		fast: true
	},
	{
		id: "uni",
		domain: 10,
		name: "Unichain",
		short: "UNI",
		chainId: 130,
		fast: true
	},
	{
		id: "arb",
		domain: 3,
		name: "Arbitrum",
		short: "ARB",
		chainId: 42161,
		fast: true
	},
	{
		id: "op",
		domain: 2,
		name: "OP Mainnet",
		short: "OP",
		chainId: 10,
		fast: true
	},
	{
		id: "sol",
		domain: 5,
		name: "Solana",
		short: "SOL",
		chainId: 0,
		fast: true
	}
];
var ALLOWED_DOMAINS = new Set(CCTP_CHAINS.map((c) => c.domain));
function chainByDomain(domain) {
	return CCTP_CHAINS.find((c) => c.domain === domain);
}
function isArc(domain) {
	return domain === 26;
}
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
function emptyBook() {
	return {
		bids: [],
		asks: [],
		nextId: 1
	};
}
function tokensToUsdc(tokens, price) {
	return tokens * price / WAD;
}
function usdcToTokens(usdc, price) {
	if (price === 0n) return 0n;
	return usdc * WAD / price;
}
function sortBook(book) {
	book.bids.sort((a, b) => a.price === b.price ? a.id - b.id : a.price < b.price ? 1 : -1);
	book.asks.sort((a, b) => a.price === b.price ? a.id - b.id : a.price > b.price ? 1 : -1);
}
function insertOrder(book, order) {
	if (order.side === "bid") book.bids.push(order);
	else book.asks.push(order);
	sortBook(book);
}
function matchAsks(book, usdcIn, limitPrice) {
	const fills = [];
	let usdcLeft = usdcIn;
	let tokensOut = 0n;
	while (usdcLeft > 0n && book.asks.length > 0) {
		const o = book.asks[0];
		if (limitPrice !== void 0 && o.price > limitPrice) break;
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
			usdc: fillUsdc
		});
		o.remaining -= fillTok;
		o.escrow -= fillTok;
		usdcLeft -= fillUsdc;
		tokensOut += fillTok;
		if (o.remaining === 0n) book.asks.shift();
	}
	return {
		fills,
		leftoverUsdc: usdcLeft,
		tokensOut
	};
}
function matchBids(book, tokensIn, limitPrice) {
	const fills = [];
	let tokensLeft = tokensIn;
	let usdcOut = 0n;
	while (tokensLeft > 0n && book.bids.length > 0) {
		const o = book.bids[0];
		if (limitPrice !== void 0 && o.price < limitPrice) break;
		const fillTok = tokensLeft < o.remaining ? tokensLeft : o.remaining;
		const fillUsdc = tokensToUsdc(fillTok, o.price);
		if (fillTok === 0n || fillUsdc === 0n) break;
		fills.push({
			orderId: o.id,
			owner: o.owner,
			side: "bid",
			price: o.price,
			tokens: fillTok,
			usdc: fillUsdc
		});
		o.remaining -= fillTok;
		o.escrow -= fillUsdc;
		tokensLeft -= fillTok;
		usdcOut += fillUsdc;
		if (o.remaining === 0n) book.bids.shift();
	}
	return {
		fills,
		leftoverTokens: tokensLeft,
		usdcOut
	};
}
function previewMarketBuy(book, launch, usdcIn) {
	const m = matchAsks({
		bids: [],
		asks: book.asks.map((o) => ({ ...o })),
		nextId: book.nextId
	}, usdcIn);
	let ammOut = 0n;
	if (m.leftoverUsdc > 0n && launch.reserveUsdc > 0n && launch.reserveToken > 0n) try {
		ammOut = getAmountOut(m.leftoverUsdc, launch.reserveUsdc, launch.reserveToken);
	} catch {
		ammOut = 0n;
	}
	const tokensOut = m.tokensOut + ammOut;
	const bookUsdc = usdcIn - m.leftoverUsdc;
	const ammUsdc = ammOut > 0n ? m.leftoverUsdc : 0n;
	const spent = bookUsdc + ammUsdc;
	const mid = bookMid(book) ?? (launch.reserveToken === 0n ? 0n : launch.reserveUsdc * WAD / launch.reserveToken);
	const fair = mid === 0n ? tokensOut : usdcToTokens(spent || usdcIn, mid);
	return {
		tokensOut,
		bookUsdc,
		ammUsdc,
		impactBps: fair > tokensOut && fair > 0n ? Number((fair - tokensOut) * 10000n / fair) : 0
	};
}
function previewMarketSell(book, launch, tokensIn) {
	const m = matchBids({
		bids: book.bids.map((o) => ({ ...o })),
		asks: [],
		nextId: book.nextId
	}, tokensIn);
	let ammOut = 0n;
	if (m.leftoverTokens > 0n && launch.reserveUsdc > 0n && launch.reserveToken > 0n) try {
		ammOut = getAmountOut(m.leftoverTokens, launch.reserveToken, launch.reserveUsdc);
	} catch {
		ammOut = 0n;
	}
	const usdcOut = m.usdcOut + ammOut;
	const mid = bookMid(book) ?? (launch.reserveToken === 0n ? 0n : launch.reserveUsdc * WAD / launch.reserveToken);
	const fair = mid === 0n ? usdcOut : tokensToUsdc(tokensIn, mid);
	const impact = fair > usdcOut && fair > 0n ? Number((fair - usdcOut) * 10000n / fair) : 0;
	return {
		usdcOut,
		bookTokens: tokensIn - m.leftoverTokens,
		ammTokens: ammOut > 0n ? m.leftoverTokens : 0n,
		impactBps: impact
	};
}
function bookMid(book) {
	if (!book?.bids.length || !book.asks.length) return null;
	return (book.bids[0].price + book.asks[0].price) / 2n;
}
function spreadBps(book) {
	if (!book?.bids.length || !book.asks.length) return null;
	const bid = book.bids[0].price;
	const ask = book.asks[0].price;
	if (bid === 0n) return null;
	return Number((ask - bid) * 10000n / bid);
}
function ladder(book, depth = 8) {
	if (!book) return {
		bids: [],
		asks: []
	};
	const group = (orders, n) => {
		const map = /* @__PURE__ */ new Map();
		for (const o of orders) {
			const k = o.price.toString();
			const cur = map.get(k) ?? {
				price: o.price,
				tokens: 0n,
				usdc: 0n,
				count: 0
			};
			cur.tokens += o.remaining;
			cur.usdc += tokensToUsdc(o.remaining, o.price);
			cur.count += 1;
			map.set(k, cur);
			if (map.size >= n) break;
		}
		return [...map.values()];
	};
	return {
		bids: group(book.bids, depth),
		asks: group(book.asks, depth)
	};
}
function cancelOrder(book, id, owner) {
	const fromBids = book.bids.findIndex((o) => o.id === id);
	const fromAsks = book.asks.findIndex((o) => o.id === id);
	const o = fromBids >= 0 ? book.bids[fromBids] : fromAsks >= 0 ? book.asks[fromAsks] : void 0;
	if (!o) throw new LaunchError("OrderNotFound");
	if (o.owner.toLowerCase() !== owner.toLowerCase()) throw new LaunchError("NotOwner");
	if (fromBids >= 0) book.bids.splice(fromBids, 1);
	else book.asks.splice(fromAsks, 1);
	return o;
}
function seedBook(launch, makers, debitToken, takeUsdc, now) {
	const book = emptyBook();
	const mid = launch.reserveToken === 0n ? 0n : launch.reserveUsdc * WAD / launch.reserveToken;
	if (mid === 0n) return book;
	const bps = [
		15n,
		40n,
		80n,
		130n,
		200n,
		300n
	];
	for (let i = 0; i < bps.length; i++) {
		const maker = makers[i % makers.length];
		const askP = mid + mid * bps[i] / 10000n;
		const bidP = mid - mid * bps[i] / 10000n;
		const usdcSize = (1n + BigInt(i)) * WAD;
		const askTok = usdcToTokens(usdcSize, askP);
		const bidTok = usdcToTokens(usdcSize, bidP);
		if (askTok > 0n && debitToken(maker, askTok)) insertOrder(book, {
			id: book.nextId++,
			launchId: launch.id,
			owner: maker,
			side: "ask",
			price: askP,
			remaining: askTok,
			escrow: askTok,
			createdAt: now
		});
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
				createdAt: now
			});
		}
	}
	return book;
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
			h.creditToken(s, id, BOOK_MM, 80000000n * WAD);
			s.books[id] = seedBook(launch, [BOOK_MM], (who, amt) => {
				const bag = s.tokens[id] ?? (s.tokens[id] = {});
				if ((bag[who] ?? 0n) < amt) return false;
				bag[who] -= amt;
				return true;
			}, (who, amt) => {
				if ((s.usdc[who] ?? 0n) < amt) s.usdc[who] = amt;
				s.usdc[who] = (s.usdc[who] ?? 0n) - amt;
			}, launch.graduatedAt);
			launch.book = h.addr("book", n);
		}
		const bag = s.tokens[id] ?? {};
		launch.holders = Object.values(bag).filter((v) => v > 0n).length;
		s.launches.push(launch);
		s.tokens[id] ??= {};
		s.books[id] ??= {
			bids: [],
			asks: [],
			nextId: 1
		};
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
function pushTrade(s, launch, side, account, usdc, tokens, at = now(), destDomain = 26, sourceDomain = 26) {
	const t = {
		id: `t${s.trades.length + 1}`,
		launchId: launch.id,
		side,
		account,
		usdc,
		tokens,
		price: launch.status === "graduated" ? launch.reserveToken === 0n ? 0n : launch.reserveUsdc * WAD / launch.reserveToken : spotPrice(launch.virtualUsdc, launch.virtualTokens),
		at,
		sourceDomain,
		destDomain
	};
	if (side === "buy" || side === "sell" || side === "swap" || side === "fill") {
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
			[TREASURY]: 0n,
			[BOOK_MM]: 25000n * WAD
		},
		remoteUsdc: {
			"0": { [DEMO_USER]: 2500n * WAD },
			"6": { [DEMO_USER]: 1800n * WAD },
			"10": { [DEMO_USER]: 900n * WAD },
			"3": { [DEMO_USER]: 1200n * WAD },
			"2": { [DEMO_USER]: 400n * WAD },
			"5": { [DEMO_USER]: 750n * WAD }
		},
		tokens: {},
		launches: [],
		trades: [],
		books: {},
		created: [],
		nextId: 1,
		cctpNonce: 1
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
function previewBuy(launch, usdcIn, book) {
	if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
	if (launch.status === "graduated") {
		const q = previewMarketBuy(book ?? emptyBook(), launch, usdcIn);
		if (q.tokensOut <= 0n) throw new LaunchError("InsufficientLiquidity");
		const venue = q.bookUsdc > 0n && q.ammUsdc === 0n ? "book" : q.bookUsdc === 0n ? "uniswap" : "book";
		return {
			tokensOut: q.tokensOut,
			protocol: 0n,
			creator: 0n,
			net: usdcIn,
			impactBps: q.impactBps,
			venue,
			bookUsdc: q.bookUsdc,
			ammUsdc: q.ammUsdc
		};
	}
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
function previewSell(launch, tokensIn, book) {
	if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
	if (launch.status === "graduated") {
		const q = previewMarketSell(book ?? emptyBook(), launch, tokensIn);
		if (q.usdcOut <= 0n) throw new LaunchError("InsufficientLiquidity");
		const venue = q.bookTokens > 0n && q.ammTokens === 0n ? "book" : q.bookTokens === 0n ? "uniswap" : "book";
		return {
			usdcOut: q.usdcOut,
			protocol: 0n,
			creator: 0n,
			net: q.usdcOut,
			impactBps: q.impactBps,
			venue,
			bookTokens: q.bookTokens,
			ammTokens: q.ammTokens
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
	launch.book = addr("book", s.nextId++);
	launch.status = "graduated";
	launch.graduatedAt = now();
	launch.realUsdc = 0n;
	pushTrade(s, launch, "graduate", account, launch.reserveUsdc, remaining);
	const mmTok = 80000000n * WAD;
	creditToken(s, launch.id, BOOK_MM, mmTok);
	s.books[launch.id] = seedBook(launch, [BOOK_MM], (who, amt) => {
		const bag = s.tokens[launch.id] ?? (s.tokens[launch.id] = {});
		if ((bag[who] ?? 0n) < amt) return false;
		bag[who] -= amt;
		return true;
	}, (who, amt) => {
		debitUsdc(s, who, amt);
	}, now());
}
function createLaunch(s, account, name, symbol, description, meta) {
	const n = name.trim();
	const sym = symbol.trim().toUpperCase();
	const d = description.trim();
	if (n.length < 2 || n.length > 32 || !/^[A-Z0-9]{2,12}$/.test(sym) || d.length > 280) throw new LaunchError("InvalidMeta");
	const website = meta?.website?.trim() || void 0;
	const twitter = meta?.twitter?.trim().replace(/^@/, "") || void 0;
	const telegram = meta?.telegram?.trim().replace(/^@/, "") || void 0;
	const discord = meta?.discord?.trim() || void 0;
	const imageUrl = meta?.imageUrl?.trim() || void 0;
	if (website && !/^https?:\/\//i.test(website) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(website)) throw new LaunchError("InvalidMeta");
	if (imageUrl && imageUrl.length > 35e4) throw new LaunchError("InvalidMeta");
	const next = clone(s);
	if (!meta?.skipFee && LAUNCH_FEE_USDC > 0n) {
		debitUsdc(next, account, LAUNCH_FEE_USDC);
		creditUsdc(next, TREASURY, LAUNCH_FEE_USDC);
	}
	const id = `${sym.toLowerCase()}-${next.nextId}`;
	const createdAt = now();
	const launch = {
		id,
		token: addr("token", next.nextId),
		curve: addr("curve", next.nextId),
		pair: null,
		book: null,
		name: n,
		symbol: sym,
		description: d,
		imageUrl,
		website: website ? /^https?:\/\//i.test(website) ? website : `https://${website}` : void 0,
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
		lastTradeAt: createdAt
	};
	next.nextId += 1;
	next.launches = [launch, ...next.launches];
	next.created = [id, ...next.created];
	next.tokens[id] = {};
	next.books[id] = emptyBook();
	creditUsdc(next, account, 0n);
	pushTrade(next, launch, "create", account, 0n, TOTAL_SUPPLY);
	return {
		state: next,
		launch
	};
}
function debitSource(s, account, domain, amount) {
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
function creditSource(s, account, domain, amount) {
	if (isArc(domain)) {
		creditUsdc(s, account, amount);
		return;
	}
	if (!ALLOWED_DOMAINS.has(domain)) throw new LaunchError("UnknownDomain");
	const key = String(domain);
	const bag = s.remoteUsdc[key] ?? (s.remoteUsdc[key] = {});
	bag[account] = (bag[account] ?? 0n) + amount;
}
function mintToArc(s, account, amount, sourceDomain) {
	if (isArc(sourceDomain)) return;
	debitSource(s, account, sourceDomain, amount);
	creditUsdc(s, account, amount);
	s.cctpNonce += 1;
}
function buy(s, account, launchId, usdcIn, minTokensOut = 0n, sourceDomain = 26) {
	if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
	if (!ALLOWED_DOMAINS.has(sourceDomain)) throw new LaunchError("UnknownDomain");
	const next = clone(s);
	const launch = findLaunch(next, launchId);
	mintToArc(next, account, usdcIn, sourceDomain);
	debitUsdc(next, account, usdcIn);
	if (launch.status === "graduated") {
		const m = matchAsks(next.books[launchId] ?? (next.books[launchId] = emptyBook()), usdcIn);
		for (const f of m.fills) {
			creditUsdc(next, f.owner, f.usdc);
			creditToken(next, launchId, account, f.tokens);
		}
		let ammOut = 0n;
		if (m.leftoverUsdc > 0n) try {
			ammOut = getAmountOut(m.leftoverUsdc, launch.reserveUsdc, launch.reserveToken);
			launch.reserveUsdc += m.leftoverUsdc;
			launch.reserveToken -= ammOut;
			creditToken(next, launchId, account, ammOut);
		} catch {
			creditUsdc(next, account, m.leftoverUsdc);
		}
		const out = m.tokensOut + ammOut;
		if (out < minTokensOut) throw new LaunchError("Slippage");
		if (out <= 0n) throw new LaunchError("InsufficientLiquidity");
		recountHolders(next, launch);
		if (m.fills.length) pushTrade(next, launch, "fill", account, usdcIn - m.leftoverUsdc, m.tokensOut, now(), 26, sourceDomain);
		if (ammOut > 0n) pushTrade(next, launch, "swap", account, m.leftoverUsdc, ammOut, now(), 26, sourceDomain);
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
	pushTrade(next, launch, "buy", account, usdcIn, tokensOut, now(), 26, sourceDomain);
	if (launch.realUsdc >= GRADUATE_AT) graduate(next, launch, account);
	return next;
}
function sell(s, account, launchId, tokensIn, minUsdcOut = 0n) {
	if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
	const next = clone(s);
	const launch = findLaunch(next, launchId);
	debitToken(next, launchId, account, tokensIn);
	if (launch.status === "graduated") {
		const m = matchBids(next.books[launchId] ?? (next.books[launchId] = emptyBook()), tokensIn);
		for (const f of m.fills) {
			creditToken(next, launchId, f.owner, f.tokens);
			creditUsdc(next, account, f.usdc);
		}
		let ammOut = 0n;
		if (m.leftoverTokens > 0n) try {
			ammOut = getAmountOut(m.leftoverTokens, launch.reserveToken, launch.reserveUsdc);
			launch.reserveToken += m.leftoverTokens;
			launch.reserveUsdc -= ammOut;
			creditUsdc(next, account, ammOut);
		} catch {
			creditToken(next, launchId, account, m.leftoverTokens);
		}
		const out = m.usdcOut + ammOut;
		if (out < minUsdcOut) throw new LaunchError("Slippage");
		if (out <= 0n) throw new LaunchError("InsufficientLiquidity");
		recountHolders(next, launch);
		if (m.fills.length) pushTrade(next, launch, "fill", account, m.usdcOut, tokensIn - m.leftoverTokens);
		if (ammOut > 0n) pushTrade(next, launch, "swap", account, ammOut, m.leftoverTokens);
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
function limitBuy(s, account, launchId, price, usdcIn, sourceDomain = 26) {
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
	if (m.fills.length) pushTrade(next, launch, "fill", account, usdcIn - m.leftoverUsdc, m.tokensOut, now(), 26, sourceDomain);
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
			createdAt: now()
		});
		if (m.leftoverUsdc > restUsdc) creditUsdc(next, account, m.leftoverUsdc - restUsdc);
		pushTrade(next, launch, "limit", account, restUsdc, restTok, now(), 26, sourceDomain);
	} else if (m.leftoverUsdc > 0n) creditUsdc(next, account, m.leftoverUsdc);
	recountHolders(next, launch);
	return next;
}
function limitSell(s, account, launchId, price, tokensIn) {
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
	if (m.fills.length) pushTrade(next, launch, "fill", account, m.usdcOut, tokensIn - m.leftoverTokens);
	if (m.leftoverTokens > 0n) {
		insertOrder(book, {
			id: book.nextId++,
			launchId,
			owner: account,
			side: "ask",
			price,
			remaining: m.leftoverTokens,
			escrow: m.leftoverTokens,
			createdAt: now()
		});
		pushTrade(next, launch, "limit", account, tokensToUsdc(m.leftoverTokens, price), m.leftoverTokens);
	}
	recountHolders(next, launch);
	return next;
}
function cancel(s, account, launchId, orderId) {
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
function openOrders(s, launchId, account) {
	const book = s.books[launchId];
	if (!book) return [];
	return [...book.bids, ...book.asks].filter((o) => o.owner.toLowerCase() === account.toLowerCase());
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
function sourceBalance(s, account, domain) {
	if (isArc(domain)) return s.usdc[account] ?? 0n;
	return s.remoteUsdc[String(domain)]?.[account] ?? 0n;
}
function totalUsdc(s, account) {
	let t = s.usdc[account] ?? 0n;
	for (const bag of Object.values(s.remoteUsdc ?? {})) t += bag[account] ?? 0n;
	return t;
}
function bridgeOut(s, account, destDomain, amount) {
	if (amount <= 0n) throw new LaunchError("ZeroAmount");
	if (!ALLOWED_DOMAINS.has(destDomain)) throw new LaunchError("UnknownDomain");
	if (isArc(destDomain)) throw new LaunchError("SameDomain");
	const next = clone(s);
	debitUsdc(next, account, amount);
	creditSource(next, account, destDomain, amount);
	next.cctpNonce += 1;
	pushTrade(next, findLaunch(next, next.launches[0].id), "bridge", account, amount, 0n, now(), destDomain, 26);
	next.trades[0].launchId = "cctp";
	next.trades[0].price = 0n;
	return next;
}
function marketCap(launch, book) {
	const px = priceOf(launch, book);
	if (px === 0n) return 0n;
	return px * TOTAL_SUPPLY / WAD;
}
function priceOf(launch, book) {
	if (launch.status === "graduated") {
		const mid = bookMid(book);
		if (mid) return mid;
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
var KEY = "pairband.launch.v4";
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
		if (!parsed.books || !parsed.remoteUsdc) return null;
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
	sourceDomain: 26,
	setDark: (v) => {
		if (typeof window !== "undefined") window.localStorage.setItem(DARK_KEY, v ? "1" : "0");
		set({ dark: v });
	},
	setSourceDomain: (d) => set({ sourceDomain: d }),
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
	},
	limitBuy: (id, price, usdcIn) => {
		try {
			const state = limitBuy(get().engine, get().account, id, price, usdcIn, get().sourceDomain);
			persist(state);
			set({
				engine: state,
				version: get().version + 1,
				lastError: null,
				lastEvent: {
					kind: "trade",
					id,
					symbol: findLaunch(state, id).symbol
				}
			});
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
			set({
				engine: state,
				version: get().version + 1,
				lastError: null,
				lastEvent: {
					kind: "trade",
					id,
					symbol: findLaunch(state, id).symbol
				}
			});
			return true;
		} catch (e) {
			set({ lastError: e instanceof LaunchError ? e.code : "Limit failed" });
			return false;
		}
	},
	cancel: (id, orderId) => {
		try {
			const state = cancel(get().engine, get().account, id, orderId);
			persist(state);
			set({
				engine: state,
				version: get().version + 1,
				lastError: null
			});
			return true;
		} catch (e) {
			set({ lastError: e instanceof LaunchError ? e.code : "Cancel failed" });
			return false;
		}
	},
	bridgeOut: (destDomain, amount) => {
		try {
			const state = bridgeOut(get().engine, get().account, destDomain, amount);
			persist(state);
			set({
				engine: state,
				version: get().version + 1,
				lastError: null
			});
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
		set({
			engine,
			version: get().version + 1
		});
	},
	setTokenBalance: (launchId, account, amount) => {
		const engine = structuredClone(get().engine);
		if (!engine.tokens[launchId]) engine.tokens[launchId] = {};
		engine.tokens[launchId][account] = amount;
		persist(engine);
		set({
			engine,
			version: get().version + 1
		});
	},
	upsertOnchainLaunches: (launches) => {
		const engine = structuredClone(get().engine);
		for (const launch of launches) {
			const idx = engine.launches.findIndex((l) => l.id === launch.id);
			if (idx >= 0) {
				const prev = engine.launches[idx];
				engine.launches[idx] = {
					...prev,
					...launch,
					createdAt: prev.createdAt > 0 ? prev.createdAt : launch.createdAt,
					description: prev.description.trim() ? prev.description : launch.description,
					holders: Math.max(prev.holders, launch.holders),
					volumeUsdc: launch.realUsdc > prev.volumeUsdc ? launch.realUsdc : prev.volumeUsdc,
					txCount: Math.max(prev.txCount, launch.txCount),
					lastTradeAt: Math.max(prev.lastTradeAt, launch.lastTradeAt)
				};
			} else engine.launches.unshift(launch);
			if (!engine.books[launch.id]) engine.books[launch.id] = {
				bids: [],
				asks: [],
				nextId: 1
			};
		}
		persist(engine);
		set({
			engine,
			version: get().version + 1
		});
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
export { tokenBalance as C, useLaunchpad as E, sqrtPriceX96 as S, usdcBalance as T, priceSeries as _, graduateProgress as a, sourceBalance as b, isArc as c, minOut as d, openOrders as f, priceOf as g, previewSell as h, chainByDomain as i, ladder as l, previewBuy as m, LaunchError as n, holdersOf as o, poolK as p, bookMid as r, hydrateLaunchpad as s, CCTP_CHAINS as t, marketCap as u, protocolStats as v, totalUsdc as w, spreadBps as x, raisedOf as y };
