import { i as string, r as object } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-website-BH-fb-k4.js
/**
* Fetch a creator website and look for Pairband verification markers:
* - <meta name="pairband:creator" content="0x…">
* - <meta name="pairband:twitter" content="handle">
* - plain text `pairband-verify:0x…`
* Optionally confirm an X handle appears on the page.
*/
var verifySchema = object({
	website: string().min(4).max(300),
	creator: string().min(6).max(66),
	twitter: string().max(40).optional()
});
function metaContent(html, name) {
	const re1 = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
	const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i");
	return (html.match(re1)?.[1] ?? html.match(re2)?.[1] ?? "").trim();
}
var verifyTokenWebsite_createServerFn_handler = createServerRpc({
	id: "190f082a97ea147b4fda13151c0c7fd32f17ed75edd1cddc32351ce40a106cc8",
	name: "verifyTokenWebsite",
	filename: "src/lib/verify-website.ts"
}, (opts) => verifyTokenWebsite.__executeServer(opts));
var verifyTokenWebsite = createServerFn({ method: "POST" }).validator((data) => verifySchema.parse(data)).handler(verifyTokenWebsite_createServerFn_handler, async ({ data }) => {
	const creator = data.creator.toLowerCase();
	let url = data.website.trim();
	if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
	let html = "";
	try {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 8e3);
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "text/html,application/xhtml+xml",
				"User-Agent": "PairbandVerifier/1.0 (+https://pairband.com)"
			},
			redirect: "follow"
		});
		clearTimeout(timer);
		if (!res.ok) return {
			ok: false,
			verified: false,
			foundCreator: false,
			foundTwitter: false,
			twitterMetaMatch: false,
			error: `HTTP ${res.status}`
		};
		html = (await res.text()).slice(0, 4e5);
	} catch (e) {
		return {
			ok: false,
			verified: false,
			foundCreator: false,
			foundTwitter: false,
			twitterMetaMatch: false,
			error: e instanceof Error ? e.message : "Fetch failed"
		};
	}
	const lower = html.toLowerCase();
	const metaCreator = metaContent(html, "pairband:creator").toLowerCase();
	const plain = lower.includes(`pairband-verify:${creator}`) || lower.includes(`pairband-verify: ${creator}`);
	const foundCreator = metaCreator === creator || plain;
	const handle = data.twitter?.trim().replace(/^@/, "").toLowerCase() ?? "";
	const twitterMeta = metaContent(html, "pairband:twitter").replace(/^@/, "").toLowerCase();
	const twitterMetaMatch = Boolean(handle && twitterMeta === handle);
	let foundTwitter = twitterMetaMatch;
	if (handle) foundTwitter = twitterMetaMatch || lower.includes(`twitter.com/${handle}`) || lower.includes(`x.com/${handle}`) || lower.includes(`@${handle}`);
	return {
		ok: true,
		verified: foundCreator,
		foundCreator,
		foundTwitter,
		twitterMetaMatch,
		fetchedUrl: url
	};
});
//#endregion
export { verifyTokenWebsite_createServerFn_handler };
