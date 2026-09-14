import { o as __toESM } from "../_runtime.mjs";
import { m as LAUNCH_FEE_ONCHAIN_USDC } from "./constants-CT0WK1Sd.mjs";
import { i as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as decodeEventLog, k as maxUint256 } from "../_libs/@wagmi/core+[...].mjs";
import { n as useSwitchChain, o as useChainId, r as usePublicClient, s as useAccount, t as useWriteContract } from "../_libs/wagmi.mjs";
import { i as isLiveFactory, n as arcTestnet, r as deploymentFor } from "./wagmi-C1bmYj8R.mjs";
import { r as launchpadAbi, t as erc20Abi } from "./onchain-launches-BACo-5UB.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-trade-C44aCdZg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Arc USDC on-chain is 6 decimals; the local preview engine stores 18. */
function toOnChainUsdc(amount18) {
	return amount18 / 10n ** 12n;
}
/** Scale 6-decimal USDC up to the engine's 18-decimal representation. */
function fromOnChainUsdc(amount6) {
	return amount6 * 10n ** 12n;
}
async function ensureUsdcAllowance(args) {
	if (await args.publicClient.readContract({
		address: args.usdc,
		abi: erc20Abi,
		functionName: "allowance",
		args: [args.owner, args.spender]
	}) >= args.needed) return;
	const approveHash = await args.writeContractAsync({
		address: args.usdc,
		abi: erc20Abi,
		functionName: "approve",
		args: [args.spender, maxUint256],
		chainId: args.chainId
	});
	await args.publicClient.waitForTransactionReceipt({ hash: approveHash });
	toast.message("USDC approved");
}
function useLiveTrade() {
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const publicClient = usePublicClient();
	const { writeContractAsync } = useWriteContract();
	const { switchChainAsync } = useSwitchChain();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const live = isConnected && isLiveFactory(chainId);
	const deployment = deploymentFor(chainId);
	const writeChainId = deployment ? chainId : arcTestnet.id;
	const ensureArc = (0, import_react.useCallback)(async () => {
		if (chainId !== arcTestnet.id && chainId !== 5042) await switchChainAsync?.({ chainId: arcTestnet.id });
	}, [chainId, switchChainAsync]);
	const approveAndBuy = (0, import_react.useCallback)(async (launchId, usdcIn18, minTokensOut) => {
		if (!address || !deployment?.launchpad || !deployment.usdc || !publicClient) throw new Error("Wallet or factory not ready");
		setBusy(true);
		try {
			await ensureArc();
			const usdcIn = toOnChainUsdc(usdcIn18);
			if (usdcIn <= 0n) throw new Error("Amount too small for on-chain USDC (6 decimals)");
			await ensureUsdcAllowance({
				publicClient,
				writeContractAsync,
				owner: address,
				usdc: deployment.usdc,
				spender: deployment.launchpad,
				needed: usdcIn,
				chainId: writeChainId
			});
			const hash = await writeContractAsync({
				address: deployment.launchpad,
				abi: launchpadAbi,
				functionName: "buy",
				args: [
					BigInt(launchId),
					usdcIn,
					minTokensOut
				],
				chainId: writeChainId
			});
			const receipt = await publicClient.waitForTransactionReceipt({ hash });
			toast.success(`Buy confirmed · ${hash.slice(0, 10)}…`);
			return {
				hash,
				receipt
			};
		} finally {
			setBusy(false);
		}
	}, [
		address,
		deployment,
		publicClient,
		writeContractAsync,
		ensureArc,
		writeChainId
	]);
	const createToken = (0, import_react.useCallback)(async (name, symbol) => {
		if (!address || !deployment?.launchpad || !deployment.usdc || !publicClient) throw new Error("Wallet or factory not ready");
		setBusy(true);
		try {
			await ensureArc();
			const fee = LAUNCH_FEE_ONCHAIN_USDC;
			if (await publicClient.readContract({
				address: deployment.usdc,
				abi: erc20Abi,
				functionName: "balanceOf",
				args: [address]
			}) < fee) throw new Error(`Need ${Number(fee) / 1e6} USDC on Arc for the launch fee`);
			await ensureUsdcAllowance({
				publicClient,
				writeContractAsync,
				owner: address,
				usdc: deployment.usdc,
				spender: deployment.launchpad,
				needed: fee,
				chainId: writeChainId
			});
			const hash = await writeContractAsync({
				address: deployment.launchpad,
				abi: launchpadAbi,
				functionName: "create",
				args: [name, symbol],
				chainId: writeChainId
			});
			const receipt = await publicClient.waitForTransactionReceipt({ hash });
			let launchId = null;
			for (const log of receipt.logs) {
				if (log.address.toLowerCase() !== deployment.launchpad.toLowerCase()) continue;
				try {
					const decoded = decodeEventLog({
						abi: launchpadAbi,
						data: log.data,
						topics: log.topics
					});
					if (decoded.eventName === "Created") {
						const args = decoded.args;
						if (args.id != null) {
							launchId = Number(args.id);
							break;
						}
					}
				} catch {}
			}
			toast.success(launchId != null ? `Created #${launchId} · $1 USDC fee · ${hash.slice(0, 10)}…` : `Created · $1 USDC fee paid · ${hash.slice(0, 10)}…`);
			return {
				hash,
				receipt,
				launchId
			};
		} finally {
			setBusy(false);
		}
	}, [
		address,
		deployment,
		publicClient,
		writeContractAsync,
		ensureArc,
		writeChainId
	]);
	return {
		live,
		busy,
		approveAndBuy,
		approveAndSell: (0, import_react.useCallback)(async (launchId, tokensIn, minUsdcOut18) => {
			if (!address || !deployment?.launchpad || !publicClient) throw new Error("Wallet or factory not ready");
			setBusy(true);
			try {
				await ensureArc();
				const minUsdcOut = toOnChainUsdc(minUsdcOut18);
				const launch = await publicClient.readContract({
					address: deployment.launchpad,
					abi: launchpadAbi,
					functionName: "getLaunch",
					args: [BigInt(launchId)]
				});
				if (await publicClient.readContract({
					address: launch.token,
					abi: erc20Abi,
					functionName: "allowance",
					args: [address, deployment.launchpad]
				}) < tokensIn) {
					const approveHash = await writeContractAsync({
						address: launch.token,
						abi: erc20Abi,
						functionName: "approve",
						args: [deployment.launchpad, maxUint256],
						chainId: writeChainId
					});
					await publicClient.waitForTransactionReceipt({ hash: approveHash });
				}
				const hash = await writeContractAsync({
					address: deployment.launchpad,
					abi: launchpadAbi,
					functionName: "sell",
					args: [
						BigInt(launchId),
						tokensIn,
						minUsdcOut
					],
					chainId: writeChainId
				});
				const receipt = await publicClient.waitForTransactionReceipt({ hash });
				toast.success(`Sell confirmed · ${hash.slice(0, 10)}…`);
				return {
					hash,
					receipt
				};
			} finally {
				setBusy(false);
			}
		}, [
			address,
			deployment,
			publicClient,
			writeContractAsync,
			ensureArc,
			writeChainId
		]),
		createToken,
		deployment,
		address
	};
}
//#endregion
export { useLiveTrade as n, fromOnChainUsdc as t };
