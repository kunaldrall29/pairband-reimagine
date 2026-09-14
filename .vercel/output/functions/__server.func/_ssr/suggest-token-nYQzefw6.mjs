import { _ as PROTOCOL_FEE_BPS, h as LAUNCH_FEE_USDC, i as AMM_FEE_BPS, l as CREATOR_FEE_BPS, m as LAUNCH_FEE_ONCHAIN_USDC, n as AGENT_FEE_USDC, t as AGENT_FEE_ONCHAIN_USDC, y as TREASURY } from "./constants-CT0WK1Sd.mjs";
import { a as string, i as object } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suggest-token-nYQzefw6.js
var getFeeSchedule_createServerFn_handler = createServerRpc({
	id: "d49b5f05a526274697fe25bb5c47da3ad5a5829b11d4ae7715de1596c030cb99",
	name: "getFeeSchedule",
	filename: "src/lib/ai/suggest-token.ts"
}, (opts) => getFeeSchedule.__executeServer(opts));
var getFeeSchedule = createServerFn({ method: "GET" }).handler(getFeeSchedule_createServerFn_handler, async () => {
	return {
		launchFeeUsdc: LAUNCH_FEE_USDC.toString(),
		launchFeeOnChain: LAUNCH_FEE_ONCHAIN_USDC.toString(),
		agentFeeUsdc: AGENT_FEE_USDC.toString(),
		agentFeeOnChain: AGENT_FEE_ONCHAIN_USDC.toString(),
		protocolFeeBps: Number(PROTOCOL_FEE_BPS),
		creatorFeeBps: Number(CREATOR_FEE_BPS),
		ammFeeBps: Number(AMM_FEE_BPS),
		treasury: TREASURY,
		quoteAsset: "USDC",
		settlementChain: "Arc"
	};
});
var briefSchema = object({ brief: string().trim().min(8, "Describe your token in at least 8 characters.").max(500, "Keep the brief under 500 characters.") });
var suggestionSchema = object({
	name: string().trim().min(2).max(32),
	symbol: string().trim().toUpperCase().regex(/^[A-Z0-9]{2,12}$/),
	description: string().trim().min(12).max(280)
});
function extractJson(raw) {
	const body = (raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? raw).trim();
	return JSON.parse(body);
}
/** Deterministic local draft so create flow works when XAI_API_KEY is absent. */
function localTokenSuggestion(brief) {
	const cleaned = brief.replace(/\s+/g, " ").trim();
	const words = cleaned.split(/[^a-zA-Z0-9]+/).map((w) => w.trim()).filter((w) => w.length > 1);
	const lead = words[0] ?? "Pair";
	const second = words[1] ?? "Band";
	const name = `${lead[0].toUpperCase()}${lead.slice(1).toLowerCase()} ${second[0].toUpperCase()}${second.slice(1).toLowerCase()}`.slice(0, 32);
	const symbol = (lead.slice(0, 3) + second.slice(0, 3)).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
	const safeSymbol = (symbol.length >= 2 ? symbol : "PBND").padEnd(2, "X").slice(0, 12);
	const description = cleaned.slice(0, 280);
	return suggestionSchema.parse({
		name: name.length >= 2 ? name : "Pairband Token",
		symbol: safeSymbol,
		description: description.length >= 12 ? description : `${cleaned} — launched on Arc with Pairband.`
	});
}
var suggestTokenFromDescription_createServerFn_handler = createServerRpc({
	id: "06a62b3267dd6dc5c59f05ecb34c44f6983a9530940bd1e6a4c8e5cd54070d7d",
	name: "suggestTokenFromDescription",
	filename: "src/lib/ai/suggest-token.ts"
}, (opts) => suggestTokenFromDescription.__executeServer(opts));
var suggestTokenFromDescription = createServerFn({ method: "POST" }).validator((data) => briefSchema.parse(data)).handler(suggestTokenFromDescription_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		suggestion: localTokenSuggestion(data.brief),
		source: "local"
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .4,
				max_tokens: 220,
				messages: [{
					role: "system",
					content: "You help founders name Arc launchpad tokens. Reply with JSON only: {\"name\":\"...\",\"symbol\":\"...\",\"description\":\"...\"}. Symbol must be 2-12 uppercase letters or digits, no spaces. Description is one punchy sentence, 12-280 chars, no emojis."
				}, {
					role: "user",
					content: `Brief: ${data.brief}`
				}]
			})
		});
		if (!res.ok) return {
			ok: true,
			suggestion: localTokenSuggestion(data.brief),
			source: "local"
		};
		const text = (await res.json()).choices?.[0]?.message?.content?.trim();
		if (!text) return {
			ok: true,
			suggestion: localTokenSuggestion(data.brief),
			source: "local"
		};
		try {
			return {
				ok: true,
				suggestion: suggestionSchema.parse(extractJson(text)),
				source: "grok"
			};
		} catch {
			return {
				ok: true,
				suggestion: localTokenSuggestion(data.brief),
				source: "local"
			};
		}
	} catch {
		return {
			ok: true,
			suggestion: localTokenSuggestion(data.brief),
			source: "local"
		};
	}
});
//#endregion
export { getFeeSchedule_createServerFn_handler, suggestTokenFromDescription_createServerFn_handler };
