//#region node_modules/.nitro/vite/services/ssr/assets/ids-C0GLR5Pk.js
function newId(prefix) {
	return `${prefix}_${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "").slice(0, 12) : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`}`;
}
async function sha256Hex(input) {
	const data = new TextEncoder().encode(input);
	const hash = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function truncateAddr(addr, n = 4) {
	if (!addr || addr.length < n * 2 + 1) return addr;
	return `${addr.slice(0, n)}…${addr.slice(-n)}`;
}
function parseTweetUrl(raw) {
	const m = raw.trim().match(/(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([^/]+)\/status\/(\d+)/i);
	if (!m) return null;
	return {
		url: `https://x.com/${m[1]}/status/${m[2]}`,
		handle: m[1],
		statusId: m[2]
	};
}
//#endregion
export { truncateAddr as i, parseTweetUrl as n, sha256Hex as r, newId as t };
