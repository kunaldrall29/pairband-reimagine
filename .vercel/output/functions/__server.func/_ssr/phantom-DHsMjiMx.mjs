//#region node_modules/.nitro/vite/services/ssr/assets/phantom-DHsMjiMx.js
function getPhantomProvider() {
	if (typeof window === "undefined") return null;
	const provider = window.phantom?.solana;
	if (provider?.isPhantom) return provider;
	if (window.solana?.isPhantom) return window.solana;
	return null;
}
async function connectPhantom() {
	const provider = getPhantomProvider();
	if (!provider) {
		window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
		throw new Error("Phantom not installed — open phantom.app to install.");
	}
	return (await provider.connect()).publicKey.toString();
}
//#endregion
export { getPhantomProvider as n, connectPhantom as t };
