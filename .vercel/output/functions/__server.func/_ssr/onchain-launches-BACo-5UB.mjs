import { t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-C1bmYj8R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onchain-launches-BACo-5UB.js
/** Pairband launchpad + ERC20 ABIs for Arc testnet / mainnet. */
var erc20Abi = [
	{
		type: "function",
		name: "approve",
		stateMutability: "nonpayable",
		inputs: [{
			name: "spender",
			type: "address"
		}, {
			name: "amount",
			type: "uint256"
		}],
		outputs: [{ type: "bool" }]
	},
	{
		type: "function",
		name: "allowance",
		stateMutability: "view",
		inputs: [{
			name: "owner",
			type: "address"
		}, {
			name: "spender",
			type: "address"
		}],
		outputs: [{ type: "uint256" }]
	},
	{
		type: "function",
		name: "balanceOf",
		stateMutability: "view",
		inputs: [{
			name: "account",
			type: "address"
		}],
		outputs: [{ type: "uint256" }]
	},
	{
		type: "function",
		name: "decimals",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "uint8" }]
	}
];
var launchpadAbi = [
	{
		type: "function",
		name: "LAUNCH_FEE",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "uint256" }]
	},
	{
		type: "function",
		name: "treasury",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "address" }]
	},
	{
		type: "function",
		name: "create",
		stateMutability: "nonpayable",
		inputs: [{
			name: "name_",
			type: "string"
		}, {
			name: "symbol_",
			type: "string"
		}],
		outputs: [{
			name: "id",
			type: "uint256"
		}, {
			name: "token",
			type: "address"
		}]
	},
	{
		type: "event",
		name: "LaunchFeePaid",
		inputs: [
			{
				name: "creator",
				type: "address",
				indexed: true
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false
			},
			{
				name: "treasury",
				type: "address",
				indexed: true
			}
		]
	},
	{
		type: "event",
		name: "Created",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true
			},
			{
				name: "token",
				type: "address",
				indexed: true
			},
			{
				name: "creator",
				type: "address",
				indexed: true
			},
			{
				name: "name",
				type: "string",
				indexed: false
			},
			{
				name: "symbol",
				type: "string",
				indexed: false
			}
		]
	},
	{
		type: "function",
		name: "buy",
		stateMutability: "nonpayable",
		inputs: [
			{
				name: "id",
				type: "uint256"
			},
			{
				name: "usdcIn",
				type: "uint256"
			},
			{
				name: "minTokensOut",
				type: "uint256"
			}
		],
		outputs: [{
			name: "tokensOut",
			type: "uint256"
		}]
	},
	{
		type: "function",
		name: "sell",
		stateMutability: "nonpayable",
		inputs: [
			{
				name: "id",
				type: "uint256"
			},
			{
				name: "tokensIn",
				type: "uint256"
			},
			{
				name: "minUsdcOut",
				type: "uint256"
			}
		],
		outputs: [{
			name: "usdcOut",
			type: "uint256"
		}]
	},
	{
		type: "function",
		name: "launchCount",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "uint256" }]
	},
	{
		type: "function",
		name: "graduateAt",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "uint256" }]
	},
	{
		type: "function",
		name: "ammFactory",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "address" }]
	},
	{
		type: "function",
		name: "getLaunch",
		stateMutability: "view",
		inputs: [{
			name: "id",
			type: "uint256"
		}],
		outputs: [{
			name: "",
			type: "tuple",
			components: [
				{
					name: "token",
					type: "address"
				},
				{
					name: "pair",
					type: "address"
				},
				{
					name: "book",
					type: "address"
				},
				{
					name: "creator",
					type: "address"
				},
				{
					name: "graduated",
					type: "bool"
				},
				{
					name: "virtualUsdc",
					type: "uint256"
				},
				{
					name: "virtualTokens",
					type: "uint256"
				},
				{
					name: "realUsdc",
					type: "uint256"
				},
				{
					name: "tokensSold",
					type: "uint256"
				},
				{
					name: "protocolFees",
					type: "uint256"
				},
				{
					name: "creatorFees",
					type: "uint256"
				}
			]
		}]
	}
];
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
			status: g.graduated ? "stage_b" : "curve",
			virtualUsdc: g.virtualUsdc * USDC_SCALE,
			virtualTokens: g.virtualTokens,
			realUsdc: realUsdc18,
			tokensSold: g.tokensSold,
			reserveUsdc: 0n,
			reserveToken: 0n,
			lpSupply: 0n,
			lpBurned: 0n,
			graduatedAt: g.graduated ? firstSeenAt.get(id) : null,
			stageAAt: null,
			stageBAt: g.graduated ? firstSeenAt.get(id) : null,
			uniqueBuyers: [],
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
export { fetchOnchainLaunches as n, launchpadAbi as r, erc20Abi as t };
