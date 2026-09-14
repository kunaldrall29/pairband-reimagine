import { t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-OCoCqeUz.mjs";
import { n as launchpadAbi } from "./launchpad-BXxrF0O2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onchain-launches-9paTVvBN.js
/** Arc USDC is 6 decimals on-chain; the preview engine stores 18. */
var USDC_SCALE = 10n ** 12n;
var metaAbi = [{
	type: "function",
	name: "name",
	stateMutability: "view",
	inputs: [],
	outputs: [{ type: "string" }]
}, {
	type: "function",
	name: "symbol",
	stateMutability: "view",
	inputs: [],
	outputs: [{ type: "string" }]
}];
/** First-seen timestamps so Discover sort stays stable across polls. */
var firstSeenAt = /* @__PURE__ */ new Map();
function hueOf(symbol) {
	return [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}
/**
* Read every launch from the Arc testnet launchpad into engine-shaped rows.
* Only fields that exist on-chain are treated as authoritative. Holder /
* volume / tx counts are left at zero rather than inventing UI numbers.
*/
async function fetchOnchainLaunches(client) {
	const pad = ARC_TESTNET_DEPLOYMENT.launchpad;
	if (!pad) return [];
	const count = await client.readContract({
		address: pad,
		abi: launchpadAbi,
		functionName: "launchCount"
	});
	const rows = [];
	const zero = "0x0000000000000000000000000000000000000000";
	for (let i = 0n; i < count; i++) {
		const g = await client.readContract({
			address: pad,
			abi: launchpadAbi,
			functionName: "getLaunch",
			args: [i]
		});
		let name = `Launch ${i}`;
		let symbol = `L${i}`;
		try {
			const [n, s] = await Promise.all([client.readContract({
				address: g.token,
				abi: metaAbi,
				functionName: "name"
			}), client.readContract({
				address: g.token,
				abi: metaAbi,
				functionName: "symbol"
			})]);
			name = n;
			symbol = s;
		} catch {}
		const id = String(i);
		if (!firstSeenAt.has(id)) firstSeenAt.set(id, Date.now());
		const realUsdc18 = g.realUsdc * USDC_SCALE;
		const launch = {
			id,
			token: g.token,
			curve: pad,
			pair: g.pair.toLowerCase() === zero ? null : g.pair,
			book: g.book.toLowerCase() === zero ? null : g.book,
			name,
			symbol,
			description: "",
			hue: hueOf(symbol),
			creator: g.creator,
			createdAt: firstSeenAt.get(id),
			status: g.graduated ? "graduated" : "curve",
			virtualUsdc: g.virtualUsdc * USDC_SCALE,
			virtualTokens: g.virtualTokens,
			realUsdc: realUsdc18,
			tokensSold: g.tokensSold,
			reserveUsdc: 0n,
			reserveToken: 0n,
			lpSupply: 0n,
			lpBurned: 0n,
			graduatedAt: g.graduated ? firstSeenAt.get(id) : null,
			protocolFees: g.protocolFees * USDC_SCALE,
			creatorFees: g.creatorFees * USDC_SCALE,
			holders: 0,
			volumeUsdc: realUsdc18,
			txCount: 0,
			lastTradeAt: 0
		};
		rows.push({
			id,
			launch
		});
	}
	return rows;
}
//#endregion
export { fetchOnchainLaunches as t };
