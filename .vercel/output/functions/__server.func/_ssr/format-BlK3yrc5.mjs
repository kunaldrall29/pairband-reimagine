import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-BlK3yrc5.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function shortAddr(addr, size = 4) {
	if (!addr) return "";
	return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}
function formatUnits(amount, decimals, digits = 2) {
	const neg = amount < 0n;
	const v = neg ? -amount : amount;
	const base = 10n ** BigInt(decimals);
	const whole = v / base;
	const fracStr = (v % base).toString().padStart(decimals, "0").slice(0, digits);
	const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	if (digits === 0 || decimals === 0) return `${neg ? "−" : ""}${wholeStr}`;
	return `${neg ? "−" : ""}${wholeStr}.${fracStr}`;
}
function parseUnits(value, decimals) {
	const trimmed = value.trim();
	if (!trimmed) return 0n;
	const [w, f = ""] = trimmed.replace(/,/g, "").split(".");
	const frac = (f + "0".repeat(decimals)).slice(0, decimals);
	return (w.startsWith("-") ? -1n : 1n) * (BigInt(w.replace("-", "") || "0") * 10n ** BigInt(decimals) + BigInt(frac || "0"));
}
/** Must match packages/contracts/src/launch/PairbandLaunchpad.sol */
var WAD = 10n ** 18n;
var BPS_DENOM = 10000n;
var PROTOCOL_FEE_BPS = 100n;
var CREATOR_FEE_BPS = 50n;
var AMM_FEE_BPS = 30n;
var TOTAL_SUPPLY = 1000000000n * WAD;
var VIRTUAL_USDC = 80n * WAD;
var VIRTUAL_TOKENS = 1000000000n * WAD;
var MIN_LP_TOKENS = 200000000n * WAD;
var GRADUATE_AT = 80n * WAD;
var DEMO_USER = "0xA11CE00000000000000000000000000000000A11";
var TREASURY = "0x7EA5000000000000000000000000000000007EA5";
var DEAD = "0x000000000000000000000000000000000000dEaD";
var FAUCET_AMOUNT = 2000n * WAD;
var FAUCET_CAP = 50000n * WAD;
var DEFAULT_SLIPPAGE_BPS = 50n;
var ARC_TESTNET_ID = 5042002;
var DEPLOYER = "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23";
function formatUsdc(amount, digits = 2) {
	return `$${formatUnits(amount, 18, digits)}`;
}
function formatToken(amount, digits = 2) {
	return formatUnits(amount, 18, digits);
}
function formatPriceWad(price) {
	const n = Number(price) / Number(WAD);
	if (!Number.isFinite(n) || n <= 0) return "$0.00";
	if (n >= 1) return `$${n.toFixed(4)}`;
	if (n >= .01) return `$${n.toFixed(6)}`;
	if (n >= 1e-4) return `$${n.toFixed(8)}`;
	return `$${n.toExponential(2)}`;
}
function formatCompact(amount) {
	const n = Number(amount) / Number(WAD);
	if (!Number.isFinite(n)) return "—";
	const abs = Math.abs(n);
	const sign = n < 0 ? "−" : "";
	if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
	if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(2)}K`;
	if (abs >= 1) return `${sign}$${abs.toFixed(2)}`;
	if (abs >= .01) return `${sign}$${abs.toFixed(4)}`;
	return `${sign}$${abs.toFixed(6)}`;
}
function timeAgo(ts) {
	const s = Math.max(0, Math.floor((Date.now() - ts) / 1e3));
	if (s < 60) return `${s}s`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 48) return `${h}h`;
	return `${Math.floor(h / 24)}d`;
}
function toInput(amount, decimals = 18) {
	const base = 10n ** BigInt(decimals);
	const whole = amount / base;
	const frac = (amount % base).toString().padStart(decimals, "0").replace(/0+$/, "");
	return frac ? `${whole}.${frac}` : `${whole}`;
}
function impactLabel(bps) {
	if (bps < 5) return `${(bps / 100).toFixed(2)}%`;
	if (bps < 100) return `${(bps / 100).toFixed(2)}%`;
	return `${(bps / 100).toFixed(1)}%`;
}
function errorCopy(code) {
	switch (code) {
		case "ZeroAmount": return "Enter an amount.";
		case "Slippage": return "Price moved. Tighten size or retry.";
		case "BelowMinLp": return "That buy would drain the Uniswap reserve.";
		case "InsufficientRealUsdc": return "Not enough USDC in the curve.";
		case "InsufficientBalance": return "Not enough balance.";
		case "AlreadyGraduated": return "Already on Uniswap.";
		case "NotGraduated": return "Curve has not filled yet.";
		case "UnknownLaunch": return "Token not found.";
		case "InvalidMeta": return "Name 2–32 chars. Symbol 2–12 A–Z / 0–9.";
		case "InsufficientLiquidity": return "Not enough liquidity.";
		case "FaucetCapped": return "Demo faucet cap reached. Reset the demo to refill.";
		default: return code ?? "";
	}
}
//#endregion
export { formatToken as C, shortAddr as D, parseUnits as E, timeAgo as O, formatPriceWad as S, impactLabel as T, VIRTUAL_USDC as _, DEAD as a, errorCopy as b, DEPLOYER as c, GRADUATE_AT as d, MIN_LP_TOKENS as f, VIRTUAL_TOKENS as g, TREASURY as h, CREATOR_FEE_BPS as i, toInput as k, FAUCET_AMOUNT as l, TOTAL_SUPPLY as m, ARC_TESTNET_ID as n, DEFAULT_SLIPPAGE_BPS as o, PROTOCOL_FEE_BPS as p, BPS_DENOM as r, DEMO_USER as s, AMM_FEE_BPS as t, FAUCET_CAP as u, WAD as v, formatUsdc as w, formatCompact as x, cn as y };
