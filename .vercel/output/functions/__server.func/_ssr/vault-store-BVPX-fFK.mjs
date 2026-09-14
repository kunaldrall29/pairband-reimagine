import { r as AGENT_FEE_VAULT_USDC } from "./constants-CT0WK1Sd.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-store-BVPX-fFK.js
var ZERO = "0x0000000000000000000000000000000000000000";
var DEAD = "0x000000000000000000000000000000000000dEaD";
var DEMO_USER = "0xA11CE00000000000000000000000000000000A11";
var DEMO_CURATOR = "0xC04A7000000000000000000000000000000C04A7";
var DEMO_AGENT = "0xA6E1700000000000000000000000000000000A6E";
var DEMO_FACTORY = "0xFACea0000000000000000000000000000000FACE";
var DEMO_HOOK = "0x0000000000000000000000000000000000002A40";
var DEMO_POOL_ID = "0x1111111111111111111111111111111111111111111111111111111111111111";
var DEMO_PROTOCOL = "0x7EA5000000000000000000000000000000007EA5";
var DEMO_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
var DEMO_USD1 = "0x8d0D00000000000000000000000000000008d0D1";
var DEMO_VAULT = "0xBA2d00000000000000000000000000000000BA2d";
var MIN_DEAD_SHARES = 1000n;
var VaultError = class extends Error {
	code;
	constructor(code, message) {
		super(message ?? code);
		this.name = "VaultError";
		this.code = code;
	}
};
/** Tick alignment, width, L1 shift, in-range. Mirrors BandMath.sol. */
var BandError = class extends Error {
	code;
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "BandError";
	}
};
function align(tick, spacing) {
	if (spacing <= 0) throw new BandError("InvalidTicks", "spacing must be > 0");
	let compressed = Math.trunc(tick / spacing);
	if (tick < 0 && tick % spacing !== 0) compressed -= 1;
	return compressed * spacing;
}
/** L1 shift: |Δlower| + |Δupper|. Documented in BandMath.sol NatSpec. */
function shift(curLower, curUpper, newLower, newUpper) {
	return Math.abs(newLower - curLower) + Math.abs(newUpper - curUpper);
}
function validateBand(tickLower, tickUpper, spacing, maxWidth) {
	if (spacing <= 0) throw new BandError("InvalidTicks", "spacing");
	if (tickLower >= tickUpper) throw new BandError("InvalidTicks", "inverted");
	if (tickLower % spacing !== 0 || tickUpper % spacing !== 0) throw new BandError("InvalidTicks", "unaligned");
	const w = tickUpper - tickLower;
	if (w > maxWidth) throw new BandError("TooWide", `width ${w} > maxWidth ${maxWidth}`);
	if (w % spacing !== 0) throw new BandError("InvalidTicks", "width not multiple of spacing");
}
/** Share conversions. Floor on mint and withdraw — see ShareMath.sol. */
function mulDivFloor(a, b, d) {
	if (d === 0n) throw new Error("DivByZero");
	return a * b / d;
}
function sharesForLiquidity(liquidity, totalSupply, totalLiquidityBefore) {
	if (totalSupply === 0n) return liquidity;
	return mulDivFloor(liquidity, totalSupply, totalLiquidityBefore);
}
function liquidityForShares(shares, totalSupply, totalLiquidity) {
	if (totalSupply === 0n) throw new Error("DivByZero");
	return mulDivFloor(shares, totalLiquidity, totalSupply);
}
/** Compact tick <-> sqrtPriceX96 around the stable 1:1 region. */
var Q96 = 2n ** 96n;
function getSqrtRatioAtTick(tick) {
	const ratio = Math.exp(tick / 2 * Math.log(1.0001));
	return BigInt(Math.round(ratio * 0xe8d4a51000)) * Q96 / 10n ** 12n;
}
function mulDiv(a, b, d) {
	return a * b / d;
}
function getLiquidityForAmount0(sqrtA, sqrtB, amount0) {
	if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
	if (sqrtB === sqrtA) return 0n;
	return mulDiv(amount0, mulDiv(sqrtA, sqrtB, Q96), sqrtB - sqrtA);
}
function getLiquidityForAmount1(sqrtA, sqrtB, amount1) {
	if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
	if (sqrtB === sqrtA) return 0n;
	return mulDiv(amount1, Q96, sqrtB - sqrtA);
}
function getLiquidityForAmounts(sqrtP, sqrtA, sqrtB, amount0, amount1) {
	if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
	if (sqrtP <= sqrtA) return getLiquidityForAmount0(sqrtA, sqrtB, amount0);
	if (sqrtP < sqrtB) {
		const l0 = getLiquidityForAmount0(sqrtP, sqrtB, amount0);
		const l1 = getLiquidityForAmount1(sqrtA, sqrtP, amount1);
		return l0 < l1 ? l0 : l1;
	}
	return getLiquidityForAmount1(sqrtA, sqrtB, amount1);
}
function getAmount0ForLiquidity(sqrtA, sqrtB, liquidity) {
	if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
	if (sqrtA === 0n) return 0n;
	return mulDiv(liquidity * Q96, sqrtB - sqrtA, sqrtB) / sqrtA;
}
function getAmount1ForLiquidity(sqrtA, sqrtB, liquidity) {
	if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
	return mulDiv(liquidity, sqrtB - sqrtA, Q96);
}
function getAmountsForLiquidity(sqrtP, sqrtA, sqrtB, liquidity) {
	if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
	if (sqrtP <= sqrtA) return {
		amount0: getAmount0ForLiquidity(sqrtA, sqrtB, liquidity),
		amount1: 0n
	};
	if (sqrtP < sqrtB) return {
		amount0: getAmount0ForLiquidity(sqrtP, sqrtB, liquidity),
		amount1: getAmount1ForLiquidity(sqrtA, sqrtP, liquidity)
	};
	return {
		amount0: 0n,
		amount1: getAmount1ForLiquidity(sqrtA, sqrtB, liquidity)
	};
}
function liquidityAtBand(tick, tickLower, tickUpper, amount0, amount1) {
	return getLiquidityForAmounts(getSqrtRatioAtTick(tick), getSqrtRatioAtTick(tickLower), getSqrtRatioAtTick(tickUpper), amount0, amount1);
}
function amountsAtBand(tick, tickLower, tickUpper, liquidity) {
	return getAmountsForLiquidity(getSqrtRatioAtTick(tick), getSqrtRatioAtTick(tickLower), getSqrtRatioAtTick(tickUpper), liquidity);
}
function now() {
	return Math.floor(Date.now() / 1e3);
}
function hash(n) {
	return `0x${(2654435769 * (n + 1) * 2246822507 >>> 0).toString(16).padStart(8, "0")}${(n * 668265261).toString(16).padStart(56, "0")}`.slice(0, 66);
}
function bump(state) {
	state.blockNumber += 1;
	state.timestamp = now();
	state.txNonce += 1;
}
function shareOf(state, who) {
	return state.shares.get(who) ?? 0n;
}
function walletOf(state, who) {
	return state.wallets.get(who) ?? {
		t0: 0n,
		t1: 0n
	};
}
function mintShares(state, to, amount) {
	state.totalSupply += amount;
	state.shares.set(to, shareOf(state, to) + amount);
}
function burnShares(state, from, amount) {
	const bal = shareOf(state, from);
	if (bal < amount) throw new VaultError("ZeroAmount", "insufficient shares");
	state.shares.set(from, bal - amount);
	state.totalSupply -= amount;
}
function positionAmounts(state) {
	return amountsAtBand(state.tick, state.band.tickLower, state.band.tickUpper, state.totalLiquidity);
}
function tvl(state) {
	const p = positionAmounts(state);
	return {
		t0: p.amount0 + state.idle0,
		t1: p.amount1 + state.idle1
	};
}
function pushActivity(state, kind, actor, detail, extra) {
	state.activity.unshift({
		id: `${state.txNonce}-${kind}`,
		kind,
		actor,
		hash: hash(state.txNonce),
		time: state.timestamp * 1e3,
		detail,
		...extra
	});
	if (state.activity.length > 80) state.activity.length = 80;
}
function chargeAgentFee(state, agent) {
	if (AGENT_FEE_VAULT_USDC <= 0n) return;
	const w = walletOf(state, agent);
	if (w.t0 < AGENT_FEE_VAULT_USDC) throw new VaultError("InsufficientBalance", "agent fee — need USDC on Arc");
	state.wallets.set(agent, {
		...w,
		t0: w.t0 - AGENT_FEE_VAULT_USDC
	});
	const treasury = walletOf(state, state.protocolFeeRecipient);
	state.wallets.set(state.protocolFeeRecipient, {
		...treasury,
		t0: treasury.t0 + AGENT_FEE_VAULT_USDC
	});
}
function createDemoState() {
	const timestamp = now();
	const policy = {
		curator: DEMO_CURATOR,
		agent: ZERO,
		maxWidth: 400,
		maxShift: 200,
		minCooldown: 20,
		protocolFeeBps: 50,
		performanceFeeBps: 1e3,
		proposalDelay: 15
	};
	const state = {
		chainId: 1301,
		chainName: "Unichain Sepolia",
		vault: DEMO_VAULT,
		hook: DEMO_HOOK,
		factory: DEMO_FACTORY,
		poolId: DEMO_POOL_ID,
		name: "Pairband USDC-USD1",
		symbol: "pb-USDC-USD1",
		token0: {
			address: DEMO_USDC,
			symbol: "USDC",
			name: "USD Coin",
			decimals: 6
		},
		token1: {
			address: DEMO_USD1,
			symbol: "USD1",
			name: "USD1",
			decimals: 6
		},
		tickSpacing: 10,
		fee: 500,
		sqrtPriceX96: getSqrtRatioAtTick(0),
		tick: 0,
		band: {
			tickLower: -100,
			tickUpper: 100,
			positionId: 1,
			lastRebalanceAt: 0
		},
		policy,
		proposal: null,
		totalSupply: 0n,
		totalLiquidity: 0n,
		idle0: 0n,
		idle1: 0n,
		protocolFeeRecipient: DEMO_PROTOCOL,
		rebalanceUnlockBlock: 0,
		blockNumber: 1842200,
		timestamp,
		shares: /* @__PURE__ */ new Map(),
		wallets: /* @__PURE__ */ new Map([[DEMO_USER, {
			t0: 10000n * 1000000n,
			t1: 10000n * 1000000n
		}], [DEMO_PROTOCOL, {
			t0: 0n,
			t1: 0n
		}]]),
		spark: [{
			t: timestamp - 3600,
			tick: 0,
			price: 1
		}],
		activity: [],
		demo: true,
		txNonce: 1
	};
	const seed0 = 100n * 1000000n;
	const seed1 = 100n * 1000000n;
	const w = walletOf(state, DEMO_USER);
	state.wallets.set(DEMO_CURATOR, {
		t0: w.t0 + seed0,
		t1: w.t1 + seed1
	});
	deposit(state, DEMO_CURATOR, seed0, seed1);
	const last = state.activity[0];
	if (last) last.kind = "Seed";
	last && (last.detail = "Curator seed · 100 USDC + 100 USD1 into the live band");
	return state;
}
function deposit(state, from, amount0, amount1) {
	if (amount0 === 0n || amount1 === 0n) throw new VaultError("ZeroAmount", "both tokens required");
	if (state.blockNumber <= state.rebalanceUnlockBlock) throw new VaultError("Locked", "rebalance lock — wait 3 blocks");
	const w = walletOf(state, from);
	if (w.t0 < amount0 || w.t1 < amount1) throw new VaultError("ZeroAmount", "insufficient wallet balance");
	const liq = liquidityAtBand(state.tick, state.band.tickLower, state.band.tickUpper, amount0, amount1);
	if (liq === 0n) throw new VaultError("ZeroAmount", "zero liquidity");
	let shares;
	if (state.totalSupply === 0n) {
		if (liq < 1000n) throw new VaultError("ZeroAmount", "below MIN_BOOTSTRAP");
		mintShares(state, DEAD, MIN_DEAD_SHARES);
		shares = liq;
	} else {
		shares = sharesForLiquidity(liq, state.totalSupply, state.totalLiquidity);
		if (shares === 0n) throw new VaultError("ZeroAmount", "zero shares");
	}
	state.wallets.set(from, {
		t0: w.t0 - amount0,
		t1: w.t1 - amount1
	});
	mintShares(state, from, shares);
	state.totalLiquidity += liq;
	bump(state);
	pushActivity(state, "Deposit", from, `PairbandVault.deposit · ${shares} shares`, {
		amount0: amount0.toString(),
		amount1: amount1.toString()
	});
	return {
		shares,
		hash: state.activity[0].hash
	};
}
function withdraw(state, from, shares) {
	if (shares === 0n) throw new VaultError("ZeroAmount", "zero shares");
	if (state.blockNumber <= state.rebalanceUnlockBlock) throw new VaultError("Locked", "rebalance lock — wait 3 blocks");
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
	state.wallets.set(from, {
		t0: w.t0 + amount0,
		t1: w.t1 + amount1
	});
	bump(state);
	pushActivity(state, "Withdraw", from, `PairbandVault.withdraw · burned ${shares} shares`, {
		amount0: amount0.toString(),
		amount1: amount1.toString()
	});
	return {
		amount0,
		amount1,
		hash: state.activity[0].hash
	};
}
function proposeRebalance(state, from, tickLower, tickUpper, amount0Min, amount1Min) {
	const p = state.policy;
	if (p.agent !== "0x0000000000000000000000000000000000000000" && from.toLowerCase() !== p.agent.toLowerCase() && from.toLowerCase() !== p.curator.toLowerCase()) throw new VaultError("NotAgent", "policy.agent is set — stranger cannot propose");
	if (p.agent !== "0x0000000000000000000000000000000000000000" && from.toLowerCase() === p.agent.toLowerCase()) chargeAgentFee(state, from);
	const spacing = state.tickSpacing;
	tickLower = align(tickLower, spacing);
	tickUpper = align(tickUpper, spacing);
	try {
		validateBand(tickLower, tickUpper, spacing, p.maxWidth);
	} catch (e) {
		if (e.code === "TooWide") throw new VaultError("TooWide", "width > policy.maxWidth");
		throw new VaultError("InvalidTicks", "ticks failed validation");
	}
	state.proposal = {
		tickLower,
		tickUpper,
		amount0Min,
		amount1Min,
		proposer: from,
		postedAt: now(),
		active: true
	};
	bump(state);
	pushActivity(state, "Propose", from, `PairbandVault.proposeRebalance · [${tickLower}, ${tickUpper})`);
	return { hash: state.activity[0].hash };
}
function rejectProposal(state, from) {
	if (from.toLowerCase() !== state.policy.curator.toLowerCase()) throw new VaultError("NotCurator", "only the named curator");
	if (!state.proposal?.active) throw new VaultError("NoProposal", "no active proposal");
	state.proposal.active = false;
	bump(state);
	pushActivity(state, "Reject", from, "PairbandVault.rejectProposal");
	return { hash: state.activity[0].hash };
}
function executeRebalance(state, from) {
	if (from.toLowerCase() !== state.policy.curator.toLowerCase()) throw new VaultError("NotCurator", "only the named curator can execute");
	const prop = state.proposal;
	if (!prop?.active) throw new VaultError("NoProposal", "no active proposal");
	const p = state.policy;
	const ts = now();
	if (ts < prop.postedAt + p.proposalDelay) throw new VaultError("DelayPending", "proposal delay");
	if (state.band.lastRebalanceAt !== 0 && ts < state.band.lastRebalanceAt + p.minCooldown) throw new VaultError("CooldownPending", "minCooldown");
	const s = shift(state.band.tickLower, state.band.tickUpper, prop.tickLower, prop.tickUpper);
	if (s > p.maxShift) throw new VaultError("ShiftCapped", `L1 shift ${s} > maxShift ${p.maxShift}`);
	const fee0 = state.idle0;
	const fee1 = state.idle1;
	const proto0 = fee0 * BigInt(p.protocolFeeBps) / 10000n;
	const proto1 = fee1 * BigInt(p.protocolFeeBps) / 10000n;
	const protoW = walletOf(state, state.protocolFeeRecipient);
	state.wallets.set(state.protocolFeeRecipient, {
		t0: protoW.t0 + proto0,
		t1: protoW.t1 + proto1
	});
	state.idle0 -= proto0;
	state.idle1 -= proto1;
	const remain0 = state.idle0 * BigInt(p.performanceFeeBps) / 10000n;
	const remain1 = state.idle1 * BigInt(p.performanceFeeBps) / 10000n;
	let curatorShares = 0n;
	const curatorValue = remain0 + remain1;
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
	if (state.idle0 < prop.amount0Min || state.idle1 < prop.amount1Min) throw new VaultError("ZeroAmount", "amountMin failed — sandwich / price move");
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
		lastRebalanceAt: ts
	};
	state.proposal = {
		...prop,
		active: false
	};
	state.rebalanceUnlockBlock = state.blockNumber + 3;
	bump(state);
	pushActivity(state, "Execute", from, `PairbandVault.executeRebalance · band [${prop.tickLower}, ${prop.tickUpper})`);
	return {
		hash: state.activity[0].hash,
		protocol0: proto0,
		protocol1: proto1,
		curatorShares
	};
}
/**
* PURE deterministic band suggestion. NEVER let an LLM choose ticks.
*
* lower = floor((tick - width/2) / spacing) * spacing
* upper = lower + width
* clip to maxShift vs current band (keep width, slide center).
*/
function suggestBand(input) {
	const { tick, spacing, maxWidth, maxShift, currentBand } = input;
	let w = input.width ?? Math.min(maxWidth, 200);
	w = Math.max(spacing, align(w, spacing));
	if (w > maxWidth) w = align(maxWidth, spacing);
	if (w < spacing) w = spacing;
	let lower = align(tick - Math.floor(w / 2), spacing);
	let upper = lower + w;
	if (shift(currentBand.tickLower, currentBand.tickUpper, lower, upper) <= maxShift) return {
		tickLower: lower,
		tickUpper: upper
	};
	const curMid = (currentBand.tickLower + currentBand.tickUpper) / 2;
	const midDelta = (lower + upper) / 2 - curMid;
	const maxTranslate = Math.floor(maxShift / 2);
	const clipped = Math.sign(midDelta) * Math.min(Math.abs(midDelta), maxTranslate);
	lower = align(currentBand.tickLower + clipped, spacing);
	upper = lower + (currentBand.tickUpper - currentBand.tickLower);
	if (shift(currentBand.tickLower, currentBand.tickUpper, lower, upper) > maxShift) return {
		tickLower: currentBand.tickLower,
		tickUpper: currentBand.tickUpper
	};
	return {
		tickLower: lower,
		tickUpper: upper
	};
}
function explainProposal(args) {
	const dir = (args.next.tickLower + args.next.tickUpper) / 2 > (args.current.tickLower + args.current.tickUpper) / 2 ? "up" : "down";
	const s = Math.abs(args.next.tickLower - args.current.tickLower) + Math.abs(args.next.tickUpper - args.current.tickUpper);
	return `Price is at tick ${args.tick}. The suggested band slides ${dir} by L1 ${s} ticks so the live range stays centered on spot, within policy.maxShift. Agent proposes; curator still has to execute.`;
}
var VAULT_DEMO_ID = "pb-usdc-usd1";
var AGENT_FEE_USDC_LABEL = "$0.25";
function accountFor(role) {
	if (role === "agent") return DEMO_AGENT;
	if (role === "curator") return DEMO_CURATOR;
	return DEMO_USER;
}
function liveDemoState() {
	const state = createDemoState();
	state.chainId = 5042002;
	state.chainName = "Arc Testnet";
	state.policy = {
		...state.policy,
		agent: DEMO_AGENT,
		proposalDelay: 3
	};
	state.tick = 40;
	state.sqrtPriceX96 = getSqrtRatioAtTick(40);
	state.wallets = /* @__PURE__ */ new Map([
		[DEMO_AGENT, {
			t0: 0n,
			t1: 0n
		}],
		[DEMO_CURATOR, {
			t0: 0n,
			t1: 0n
		}],
		[DEMO_USER, {
			t0: 0n,
			t1: 0n
		}]
	]);
	state.shares = /* @__PURE__ */ new Map();
	state.totalSupply = 0n;
	state.totalLiquidity = 0n;
	state.idle0 = 0n;
	state.idle1 = 0n;
	state.activity = [];
	state.spark = [{
		t: state.timestamp,
		tick: state.tick,
		price: 1
	}];
	return state;
}
function suggestedBandLabel(engine) {
	const next = suggestBand({
		tick: engine.tick,
		spacing: engine.tickSpacing,
		maxWidth: engine.policy.maxWidth,
		maxShift: engine.policy.maxShift,
		currentBand: engine.band
	});
	return explainProposal({
		current: engine.band,
		next,
		tick: engine.tick
	});
}
function parse6(human) {
	const n = Number(human);
	if (!Number.isFinite(n) || n <= 0) return 0n;
	return BigInt(Math.round(n * 1e6));
}
var useVault = create((set, get) => ({
	engine: liveDemoState(),
	version: 0,
	role: "agent",
	account: DEMO_AGENT,
	lastError: null,
	lastHash: null,
	setRole: (role) => set({
		role,
		account: accountFor(role),
		lastError: null
	}),
	clearError: () => set({ lastError: null }),
	deposit: (amount0Human, amount1Human) => {
		try {
			const { engine, account, version } = get();
			const result = deposit(engine, account, parse6(amount0Human), parse6(amount1Human));
			set({
				engine,
				version: version + 1,
				lastError: null,
				lastHash: result.hash
			});
		} catch (e) {
			set({
				lastError: e instanceof VaultError ? e.message : "Deposit failed",
				lastHash: null
			});
		}
	},
	withdraw: (sharesHuman) => {
		try {
			const { engine, account, version } = get();
			const result = withdraw(engine, account, BigInt(sharesHuman || "0"));
			set({
				engine,
				version: version + 1,
				lastError: null,
				lastHash: result.hash
			});
		} catch (e) {
			set({
				lastError: e instanceof VaultError ? e.message : "Withdraw failed",
				lastHash: null
			});
		}
	},
	proposeSuggested: () => {
		try {
			const { engine, account, version } = get();
			const next = suggestBand({
				tick: engine.tick,
				spacing: engine.tickSpacing,
				maxWidth: engine.policy.maxWidth,
				maxShift: engine.policy.maxShift,
				currentBand: engine.band
			});
			const result = proposeRebalance(engine, account, next.tickLower, next.tickUpper, 0n, 0n);
			set({
				engine,
				version: version + 1,
				lastError: null,
				lastHash: result.hash
			});
		} catch (e) {
			set({
				lastError: e instanceof VaultError ? e.message : "Propose failed",
				lastHash: null
			});
		}
	},
	reject: () => {
		try {
			const { engine, account, version } = get();
			const result = rejectProposal(engine, account);
			set({
				engine,
				version: version + 1,
				lastError: null,
				lastHash: result.hash
			});
		} catch (e) {
			set({
				lastError: e instanceof VaultError ? e.message : "Reject failed",
				lastHash: null
			});
		}
	},
	execute: () => {
		try {
			const { engine, account, version } = get();
			const result = executeRebalance(engine, account);
			set({
				engine,
				version: version + 1,
				lastError: null,
				lastHash: result.hash
			});
		} catch (e) {
			set({
				lastError: e instanceof VaultError ? e.message : "Execute failed",
				lastHash: null
			});
		}
	},
	reset: () => set({
		engine: liveDemoState(),
		version: 0,
		role: "agent",
		account: DEMO_AGENT,
		lastError: null,
		lastHash: null
	})
}));
//#endregion
export { suggestedBandLabel as a, VAULT_DEMO_ID as i, DEMO_AGENT as n, useVault as o, DEMO_CURATOR as r, AGENT_FEE_USDC_LABEL as t };
