import { C as stageThresholds, S as WAD, _ as PROTOCOL_FEE_BPS, b as VIRTUAL_TOKENS, c as BPS_DENOM, g as MIN_LP_TOKENS, h as LAUNCH_FEE_USDC, i as AMM_FEE_BPS, l as CREATOR_FEE_BPS, o as ARC_TESTNET_ID, s as BOOK_MM, v as TOTAL_SUPPLY, x as VIRTUAL_USDC, y as TREASURY } from "./constants-CT0WK1Sd.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BwIaYuXO.js
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
function isStageB(launch) {
	return launch.status === "stage_b";
}
/** Book is live from Stage A onward. */
function hasBook(launch) {
	return launch.status === "stage_a" || launch.status === "stage_b";
}
function statusChip(status) {
	switch (status) {
		case "curve": return {
			label: "Curve",
			tone: "curve"
		};
		case "stage_a": return {
			label: "Stage A Book",
			tone: "book"
		};
		case "stage_b": return {
			label: "Stage B Locked",
			tone: "locked"
		};
	}
}
/** Unique-buyer notional floor: ≥ 1 USDC on the curve, not the creator. */
var UNIQUE_BUY_MIN = 1n * WAD;
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
		price: isStageB(launch) ? launch.reserveToken === 0n ? 0n : launch.reserveUsdc * WAD / launch.reserveToken : spotPrice(launch.virtualUsdc, launch.virtualTokens),
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
	return {
		chainId: ARC_TESTNET_ID,
		usdc: {
			[TREASURY]: 0n,
			[BOOK_MM]: 0n
		},
		remoteUsdc: {},
		tokens: {},
		launches: [],
		trades: [],
		books: {},
		created: [],
		nextId: 1,
		cctpNonce: 1
	};
}
/** On-chain launches use numeric ids from the factory index. */
function isOnchainLaunchId(id) {
	return /^\d+$/.test(id);
}
function findLaunch(s, id) {
	const l = s.launches.find((x) => x.id === id);
	if (!l) throw new LaunchError("UnknownLaunch");
	return l;
}
function previewBuy(launch, usdcIn, book) {
	if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
	if (isStageB(launch)) {
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
	if (launch.status === "stage_a") {
		const b = book ?? emptyBook();
		const m = matchAsks({
			bids: [],
			asks: b.asks.map((o) => ({ ...o })),
			nextId: b.nextId
		}, usdcIn);
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
			bookUsdc: usdcIn - m.leftoverUsdc
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
	if (isStageB(launch)) {
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
	if (launch.status === "stage_a") {
		const b = book ?? emptyBook();
		const m = matchBids({
			bids: b.bids.map((o) => ({ ...o })),
			asks: [],
			nextId: b.nextId
		}, tokensIn);
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
			bookTokens: tokensIn - m.leftoverTokens
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
function seedMarketBook(s, launch) {
	const mmTok = 80000000n * WAD;
	creditToken(s, launch.id, BOOK_MM, mmTok);
	const ghost = {
		...launch,
		reserveUsdc: launch.reserveUsdc > 0n ? launch.reserveUsdc : launch.virtualUsdc,
		reserveToken: launch.reserveToken > 0n ? launch.reserveToken : launch.virtualTokens
	};
	s.books[launch.id] = seedBook(ghost, [BOOK_MM], (who, amt) => {
		const bag = s.tokens[launch.id] ?? (s.tokens[launch.id] = {});
		if ((bag[who] ?? 0n) < amt) return false;
		bag[who] -= amt;
		return true;
	}, (who, amt) => {
		debitUsdc(s, who, amt);
	}, now());
}
/** Stage A — discovery book opens; curve stays open until Stage B. */
function openStageA(s, launch, account) {
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
function openStageB(s, launch, account) {
	if (isStageB(launch)) throw new LaunchError("AlreadyGraduated");
	if (launch.status === "curve") openStageA(s, launch, account);
	const spot = spotPrice(launch.virtualUsdc, launch.virtualTokens);
	const ammUsdc = launch.realUsdc;
	if (ammUsdc === 0n || spot === 0n) throw new LaunchError("InsufficientLiquidity");
	const ammToken = ammUsdc * WAD / spot;
	if (ammToken > launch.virtualTokens || ammToken < MIN_LP_TOKENS) throw new LaunchError("PriceContinuity");
	const openPx = ammUsdc * WAD / ammToken;
	if ((openPx > spot ? openPx - spot : spot - openPx) * 10000n / spot > 1n) throw new LaunchError("PriceContinuity");
	launch.reserveUsdc = ammUsdc;
	launch.reserveToken = ammToken;
	launch.virtualTokens -= ammToken;
	launch.lpBurned = sqrt(launch.reserveUsdc * launch.reserveToken);
	launch.lpSupply = 0n;
	launch.pair = addr("pair", s.nextId++);
	if (!launch.book) launch.book = addr("book", s.nextId++);
	launch.status = "stage_b";
	const t = now();
	launch.stageBAt = t;
	launch.graduatedAt = t;
	launch.realUsdc = 0n;
	pushTrade(s, launch, "stage_b", account, launch.reserveUsdc, ammToken);
	pushTrade(s, launch, "graduate", account, launch.reserveUsdc, ammToken);
	if (!s.books[launch.id]?.asks.length) seedMarketBook(s, launch);
}
function maybeAdvanceStages(s, launch, account) {
	if (isStageB(launch)) return;
	const th = stageThresholds(s.chainId);
	const buyers = BigInt(launch.uniqueBuyers.length);
	const raised = launch.realUsdc;
	if (launch.status === "curve" && raised >= th.aUsd && buyers >= th.aWallets) openStageA(s, launch, account);
	const stageBOk = raised >= th.bUsd && buyers >= th.bWalletsMin || raised >= th.bUsdHard;
	if (!isStageB(launch) && stageBOk) openStageB(s, launch, account);
}
function recordUniqueBuyer(launch, account, usdcNotional) {
	if (usdcNotional < UNIQUE_BUY_MIN) return;
	if (account.toLowerCase() === launch.creator.toLowerCase()) return;
	const key = account.toLowerCase();
	if (!launch.uniqueBuyers.some((a) => a.toLowerCase() === key)) launch.uniqueBuyers.push(account);
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
		stageAAt: null,
		stageBAt: null,
		uniqueBuyers: [],
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
	if (isStageB(launch)) {
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
	if (launch.status === "stage_a") {
		const m = matchAsks(next.books[launchId] ?? (next.books[launchId] = emptyBook()), usdcIn);
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
		if (m.fills.length) pushTrade(next, launch, "fill", account, usdcIn - leftover, m.tokensOut, now(), 26, sourceDomain);
		if (curveOut > 0n) pushTrade(next, launch, "buy", account, leftover, curveOut, now(), 26, sourceDomain);
		maybeAdvanceStages(next, launch, account);
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
	recordUniqueBuyer(launch, account, usdcIn);
	recountHolders(next, launch);
	pushTrade(next, launch, "buy", account, usdcIn, tokensOut, now(), 26, sourceDomain);
	maybeAdvanceStages(next, launch, account);
	return next;
}
function sell(s, account, launchId, tokensIn, minUsdcOut = 0n) {
	if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
	const next = clone(s);
	const launch = findLaunch(next, launchId);
	debitToken(next, launchId, account, tokensIn);
	if (isStageB(launch)) {
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
	if (launch.status === "stage_a") {
		const m = matchBids(next.books[launchId] ?? (next.books[launchId] = emptyBook()), tokensIn);
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
		if (m.fills.length) pushTrade(next, launch, "fill", account, m.usdcOut, tokensIn - m.leftoverTokens);
		if (curveNet > 0n) pushTrade(next, launch, "sell", account, curveNet, m.leftoverTokens);
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
	if (!hasBook(launch)) throw new LaunchError("BookNotOpen");
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
	if (!hasBook(launch)) throw new LaunchError("BookNotOpen");
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
	if (isStageB(launch)) {
		const mid = bookMid(book);
		if (mid) return mid;
		if (launch.reserveToken === 0n) return 0n;
		return launch.reserveUsdc * WAD / launch.reserveToken;
	}
	return spotPrice(launch.virtualUsdc, launch.virtualTokens);
}
function graduateProgress(launch, chainId = ARC_TESTNET_ID) {
	if (isStageB(launch)) return 1;
	const th = stageThresholds(chainId);
	const target = th.bUsdHard > th.bUsd ? th.bUsdHard : th.bUsd;
	if (target === 0n) return 0;
	const bps = Number(launch.realUsdc * 10000n / target);
	return Math.min(1, bps / 1e4);
}
function raisedOf(launch) {
	return isStageB(launch) ? launch.reserveUsdc : launch.realUsdc;
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
	let stageA = 0;
	for (const l of s.launches) {
		raised += raisedOf(l);
		volume += l.volumeUsdc;
		if (isStageB(l)) graduated += 1;
		else if (l.status === "stage_a") stageA += 1;
	}
	return {
		count: s.launches.length,
		graduated,
		stageA,
		raised,
		volume
	};
}
function minOut(quoted, slippageBps) {
	return quoted * (10000n - slippageBps) / 10000n;
}
var KEY = "pairband.launch.v5";
var DARK_KEY = "pairband.dark";
var WATCH_KEY = "pairband.watch.v1";
function serialize(s) {
	return JSON.stringify(s, (_k, v) => typeof v === "bigint" ? `${v}n` : v);
}
function stripSeededLaunches(s) {
	const keep = s.launches.filter((l) => isOnchainLaunchId(l.id));
	const keepIds = new Set(keep.map((l) => l.id));
	const tokens = {};
	const books = {};
	for (const id of keepIds) {
		if (s.tokens[id]) tokens[id] = s.tokens[id];
		if (s.books[id]) books[id] = s.books[id];
	}
	return {
		...s,
		launches: keep,
		tokens,
		books,
		created: (s.created ?? []).filter((id) => keepIds.has(id)),
		trades: (s.trades ?? []).filter((tr) => keepIds.has(tr.launchId))
	};
}
function revive(raw) {
	try {
		const parsed = JSON.parse(raw, (_k, v) => typeof v === "string" && /^-?\d+n$/.test(v) ? BigInt(v.slice(0, -1)) : v);
		if (!parsed?.launches || !parsed.usdc) return null;
		if (!Array.isArray(parsed.launches)) return null;
		const first = parsed.launches[0];
		if (first && typeof first.lpBurned !== "bigint") return null;
		if (!parsed.books || !parsed.remoteUsdc) return null;
		for (const l of parsed.launches) {
			const rawStatus = l.status;
			l.status = rawStatus === "graduated" ? "stage_b" : rawStatus === "stage_a" || rawStatus === "stage_b" ? rawStatus : "curve";
			if (!Array.isArray(l.uniqueBuyers)) l.uniqueBuyers = [];
			if (l.stageAAt === void 0) l.stageAAt = null;
			if (l.stageBAt === void 0) l.stageBAt = l.graduatedAt ?? null;
		}
		return stripSeededLaunches(parsed);
	} catch {
		return null;
	}
}
function loadEngine() {
	if (typeof window === "undefined") return createEngine();
	let raw = window.localStorage.getItem(KEY);
	if (!raw) raw = window.localStorage.getItem("pairband.launch.v4");
	if (!raw) return createEngine();
	const engine = revive(raw) ?? createEngine();
	persist(engine);
	try {
		window.localStorage.removeItem("pairband.launch.v4");
	} catch {}
	return engine;
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
	account: "",
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
	clearLocalCache: () => {
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
	create: (name, symbol, description, firstBuy = 0n, meta) => {
		try {
			let { state, launch } = createLaunch(get().engine, get().account, name, symbol, description, meta);
			if (firstBuy > 0n) {
				state = buy(state, get().account, launch.id, firstBuy);
				launch = findLaunch(state, launch.id);
			}
			persist(state);
			const graduated = launch.status === "stage_b";
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
			const graduated = before.status !== "stage_b" && after.status === "stage_b";
			const openedBook = before.status === "curve" && after.status === "stage_a";
			set({
				engine: state,
				version: get().version + 1,
				lastError: null,
				lastEvent: {
					kind: graduated ? "stage_b" : openedBook ? "stage_a" : "trade",
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
export { useLaunchpad as A, sourceBalance as C, tokenBalance as D, statusChip as E, totalUsdc as O, raisedOf as S, sqrtPriceX96 as T, previewBuy as _, graduateProgress as a, priceSeries as b, hydrateLaunchpad as c, isStageB as d, ladder as f, poolK as g, openOrders as h, chainByDomain as i, usdcBalance as k, isArc as l, minOut as m, LaunchError as n, hasBook as o, marketCap as p, bookMid as r, holdersOf as s, CCTP_CHAINS as t, isOnchainLaunchId as u, previewSell as v, spreadBps as w, protocolStats as x, priceOf as y };
