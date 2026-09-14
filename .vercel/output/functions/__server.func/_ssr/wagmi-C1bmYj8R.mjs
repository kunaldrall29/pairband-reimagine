import { a as ARC_MAINNET_ID, o as ARC_TESTNET_ID } from "./constants-CT0WK1Sd.mjs";
import { c as injected, s as createConfig } from "../_libs/@wagmi/core+[...].mjs";
import { t as coinbaseWallet } from "../_libs/@wagmi/connectors+[...].mjs";
import { i as http, n as defineChain } from "../_libs/viem.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wagmi-C1bmYj8R.js
var arcTestnet = defineChain({
	id: ARC_TESTNET_ID,
	name: "Arc Testnet",
	nativeCurrency: {
		name: "USD Coin",
		symbol: "USDC",
		decimals: 6
	},
	rpcUrls: { default: { http: ["https://rpc.testnet.arc.io", "https://rpc.testnet.arc.network"] } },
	blockExplorers: { default: {
		name: "ArcScan",
		url: "https://testnet.arcscan.app"
	} },
	testnet: true
});
var arcMainnet = defineChain({
	id: ARC_MAINNET_ID,
	name: "Arc",
	nativeCurrency: {
		name: "USD Coin",
		symbol: "USDC",
		decimals: 6
	},
	rpcUrls: { default: { http: ["https://rpc.arc.network"] } },
	blockExplorers: { default: {
		name: "ArcScan",
		url: "https://arcscan.app"
	} },
	testnet: false
});
var connectors = [
	injected({ shimDisconnect: true }),
	coinbaseWallet({
		appName: "Pairband",
		appLogoUrl: "https://pairband.com/favicon.svg",
		preference: "all"
	}),
	...[]
];
var wagmiConfig = createConfig({
	chains: [arcTestnet, arcMainnet],
	connectors,
	transports: {
		[arcTestnet.id]: http("https://rpc.testnet.arc.io"),
		[arcMainnet.id]: http("https://rpc.arc.network")
	},
	ssr: true
});
/** Mirrors packages/config/deployments.json — keep in sync after broadcast. */
var DEPLOYMENTS = {
	"5042002": {
		name: "Arc Testnet",
		explorer: "https://testnet.arcscan.app",
		rpc: "https://rpc.testnet.arc.io",
		usdc: "0x3600000000000000000000000000000000000000",
		deployer: "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23",
		launchpad: "0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4",
		settler: "0x229BD1BcdE44c26E0c7741B46854Ccfb4e54CC40",
		ammFactory: "0x0769121558BB51Fb71Edb933010D294D770e6e18",
		graduateAt: "80000000",
		launchFeeUsdc: "1000000",
		treasury: "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23",
		agentFeeUsdc: "250000",
		agentDesk: "0x9BedBFc897d4f90E92389818edDC968f99Da5563",
		agentDeskSeedVaultId: 0,
		agentDeskDeployedAt: "2026-09-14T08:40:00Z"
	},
	"5042": {
		name: "Arc",
		explorer: "https://arcscan.app",
		rpc: "https://rpc.arc.network",
		usdc: "0x3600000000000000000000000000000000000000",
		deployer: "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23",
		launchpad: null,
		ammFactory: null,
		settler: null
	}
};
function deploymentFor(chainId) {
	return DEPLOYMENTS[String(chainId)] ?? null;
}
function isLiveFactory(chainId) {
	const d = deploymentFor(chainId);
	return Boolean(d?.launchpad && d?.ammFactory);
}
var ARC_TESTNET_DEPLOYMENT = DEPLOYMENTS["5042002"];
//#endregion
export { wagmiConfig as a, isLiveFactory as i, arcTestnet as n, deploymentFor as r, ARC_TESTNET_DEPLOYMENT as t };
