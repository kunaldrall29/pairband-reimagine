import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, n as QueryClientProvider, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as useLaunchpad, O as totalUsdc, c as hydrateLaunchpad, k as usdcBalance } from "./store-BwIaYuXO.mjs";
import { f as useRouterState, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as Activity, _ as ExternalLink, a as Sun, c as Smartphone, f as Plus, n as Wallet, p as Moon, t as X, u as RotateCcw, w as ArrowLeftRight, x as Cable, y as Compass } from "../_libs/lucide-react.mjs";
import { c as formatUsdc, h as cn, m as Wordmark, p as PairMark, v as shortAddr } from "./router-DYi0iHDD.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { n as UsdcMark, t as ArcMark } from "./arc-mark-CtphBApM.mjs";
import { i as http, t as createPublicClient } from "../_libs/viem.mjs";
import { a as useConnect, c as WagmiProvider, i as useDisconnect, n as useSwitchChain, o as useChainId, r as usePublicClient, s as useAccount } from "../_libs/wagmi.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as wagmiConfig, i as isLiveFactory, n as arcTestnet, t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-C1bmYj8R.mjs";
import { n as fetchOnchainLaunches, t as erc20Abi } from "./onchain-launches-BACo-5UB.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as fromOnChainUsdc } from "./live-trade-C44aCdZg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-KI_33S7I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hasInjectedProvider() {
	if (typeof window === "undefined") return false;
	const w = window;
	return Boolean(w.ethereum || w.phantom?.ethereum);
}
function metaMaskDappLink() {
	return `https://metamask.app.link/dapp/${(typeof window !== "undefined" ? window.location.href : "https://pairband.com/app").replace(/^https?:\/\//, "")}`;
}
function connectorLabel(c) {
	if (c.id === "metaMaskSDK" || c.type === "metaMask") return "MetaMask";
	if (c.id === "coinbaseWalletSDK" || c.type === "coinbaseWallet") return "Coinbase Wallet";
	if (c.id === "walletConnect" || c.type === "walletConnect") return "WalletConnect";
	if (c.id === "injected") return hasInjectedProvider() ? "Browser wallet" : "Browser wallet";
	return c.name || "Wallet";
}
function ConnectWallet() {
	const { address, isConnected, status } = useAccount();
	const { connectors, connectAsync, isPending, error } = useConnect();
	const { disconnect } = useDisconnect();
	const chainId = useChainId();
	const { switchChain } = useSwitchChain();
	const publicClient = usePublicClient();
	const live = isLiveFactory(chainId);
	const setAccount = useLaunchpad((s) => s.setAccount);
	const setUsdcBalance = useLaunchpad((s) => s.setUsdcBalance);
	const [sheetOpen, setSheetOpen] = (0, import_react.useState)(false);
	const [providerReady, setProviderReady] = (0, import_react.useState)(false);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setProviderReady(hasInjectedProvider());
		const onChange = () => setProviderReady(hasInjectedProvider());
		window.addEventListener("ethereum#initialized", onChange);
		const t = window.setInterval(onChange, 1500);
		return () => {
			window.removeEventListener("ethereum#initialized", onChange);
			window.clearInterval(t);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (isConnected && address) setAccount(address);
		else setAccount("");
	}, [
		isConnected,
		address,
		setAccount
	]);
	(0, import_react.useEffect)(() => {
		if (!isConnected || !address || !publicClient || !ARC_TESTNET_DEPLOYMENT.usdc) return;
		let cancelled = false;
		(async () => {
			try {
				const raw = await publicClient.readContract({
					address: ARC_TESTNET_DEPLOYMENT.usdc,
					abi: erc20Abi,
					functionName: "balanceOf",
					args: [address]
				});
				if (!cancelled) setUsdcBalance(address, fromOnChainUsdc(raw));
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		isConnected,
		address,
		publicClient,
		setUsdcBalance,
		chainId
	]);
	(0, import_react.useEffect)(() => {
		if (!error) return;
		const detail = error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String(error.message) : "Wallet connection failed";
		toast.error(detail || "Wallet connection failed");
	}, [error]);
	async function connectWith(connector) {
		setBusyId(connector.id);
		try {
			await connectAsync({
				connector,
				chainId: arcTestnet.id
			});
			setSheetOpen(false);
			toast.success("Wallet connected");
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Connect failed";
			if (/reject|denied|cancel/i.test(msg)) toast.message("Connection cancelled");
			else toast.error(msg);
		} finally {
			setBusyId(null);
		}
	}
	if (isConnected && address) {
		const wrong = chainId !== arcTestnet.id && chainId !== 5042;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [wrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
				variant: "secondary",
				className: "min-h-10 px-3 text-xs",
				onClick: () => switchChain?.({ chainId: arcTestnet.id }),
				children: "Switch to Arc"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `hidden rounded-full px-2.5 py-1 font-mono text-[11px] sm:inline ${live ? "bg-teal/15 text-teal" : "bg-ink/8 text-muted"}`,
				children: live ? "Arc live" : "Wrong network"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
				variant: "ghost",
				className: "min-h-10 px-3 font-mono text-xs",
				onClick: () => {
					disconnect();
				},
				children: shortAddr(address, 4)
			})]
		});
	}
	const uniqueConnectors = connectors.filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
	const connecting = isPending || busyId !== null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
		className: "min-h-10 px-3 text-xs",
		disabled: connecting && !sheetOpen,
		onClick: () => setSheetOpen(true),
		children: connecting && !sheetOpen ? "Connecting…" : "Connect"
	}), sheetOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center",
		onClick: (e) => {
			if (e.target === e.currentTarget) setSheetOpen(false);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-labelledby": "connect-sheet-title",
			className: "relative w-full max-w-md rounded-3xl border border-ink/10 bg-paper p-6 shadow-[0_24px_64px_rgba(11,15,20,0.28)] dark:border-paper/15 dark:bg-ink-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSheetOpen(false),
					className: "absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-ink/5 dark:hover:bg-paper/10",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-12 items-center justify-center rounded-2xl bg-teal/15 text-teal",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 22 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "connect-sheet-title",
					className: "mt-4 font-display text-2xl",
					children: "Connect wallet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: [
						"Arc Testnet ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-ink dark:text-paper",
							children: "5042002"
						}),
						". Connect a wallet to trade and create on-chain."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col gap-2",
					children: [uniqueConnectors.map((connector) => {
						const isInjectedEmpty = connector.id === "injected" && !providerReady;
						const label = connectorLabel(connector);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
							variant: "secondary",
							className: "w-full justify-between",
							disabled: connecting || isInjectedEmpty,
							onClick: () => void connectWith(connector),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 16 }), busyId === connector.id ? `Opening ${label}…` : label]
							}), isInjectedEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Not detected"
							}) : connector.type === "metaMask" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Extension / app"
							}) : connector.type === "coinbaseWallet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "App / smart wallet"
							}) : connector.type === "walletConnect" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "QR / mobile"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Detected"
							})]
						}, connector.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: metaMaskDappLink(),
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-2xl border border-ink/10 bg-transparent px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink/5 dark:border-paper/15 dark:text-paper dark:hover:bg-paper/5",
						onClick: () => setSheetOpen(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { size: 16 }), "Open in MetaMask mobile"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
							size: 14,
							className: "text-muted"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs leading-relaxed text-muted",
					children: "Preview and some in-app browsers block extensions. On phone, use MetaMask / Coinbase / Phantom’s built-in browser, or the MetaMask link above."
				})
			]
		})
	}) : null] });
}
var NAV = [
	{
		to: "/app",
		label: "Discover",
		icon: Compass
	},
	{
		to: "/app/create",
		label: "Launch",
		icon: Plus
	},
	{
		to: "/app/trade",
		label: "Trade",
		icon: ArrowLeftRight
	},
	{
		to: "/app/bridge",
		label: "Bridge",
		icon: Cable
	},
	{
		to: "/app/activity",
		label: "Tape",
		icon: Activity
	},
	{
		to: "/app/me",
		label: "Wallet",
		icon: Wallet
	}
];
function AppShell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const account = useLaunchpad((s) => s.account);
	const dark = useLaunchpad((s) => s.dark);
	const setDark = useLaunchpad((s) => s.setDark);
	const reset = useLaunchpad((s) => s.clearLocalCache);
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const lastEvent = useLaunchpad((s) => s.lastEvent);
	const clearEvent = useLaunchpad((s) => s.clearEvent);
	const usdc = usdcBalance(engine, account);
	const allUsdc = totalUsdc(engine, account);
	(0, import_react.useEffect)(() => {
		hydrateLaunchpad();
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);
	(0, import_react.useEffect)(() => {
		if (!lastEvent) return;
		if (lastEvent.kind === "graduate" || lastEvent.kind === "stage_b") toast.success(`${lastEvent.symbol} Stage B locked. LP burned. Book + Uniswap live.`);
		else if (lastEvent.kind === "stage_a") toast.success(`${lastEvent.symbol} Stage A — book is open. Curve still live.`);
		else if (lastEvent.kind === "create") toast(`${lastEvent.symbol} is live on the curve.`);
		else if (lastEvent.kind === "trade") toast.success(`${lastEvent.symbol} filled. Settled on Arc.`);
		clearEvent();
	}, [lastEvent, clearEvent]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-h-screen overflow-x-hidden bg-paper text-ink dark:bg-ink dark:text-paper", dark && "dark"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed top-0 bottom-0 left-0 z-30 hidden w-[72px] flex-col items-center border-r border-ink/8 bg-paper-2 py-4 dark:border-paper/10 dark:bg-ink-2 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mb-6",
						"aria-label": "Pairband home",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PairMark, { size: 28 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col items-center gap-1",
						children: NAV.map((n) => {
							const active = n.to === "/app" ? path === "/app" : path.startsWith(n.to);
							const Icon = n.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								title: n.label,
								className: cn("flex size-12 items-center justify-center rounded-2xl transition-colors", active ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-muted hover:bg-ink/5 dark:hover:bg-paper/10"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									size: 20,
									strokeWidth: 1.75
								})
							}, n.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, {
						size: 18,
						className: "mt-auto text-ink/50 dark:text-paper/50"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-ink/8 bg-paper/80 backdrop-blur-xl dark:border-paper/10 dark:bg-ink/80 md:ml-[72px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, {
								size: 14,
								className: "text-ink/60 dark:text-paper/60"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-2 md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] text-paper dark:bg-paper dark:text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 12 }), "Arc · 26"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2.5 py-1 font-mono text-[11px] ${ARC_TESTNET_DEPLOYMENT?.launchpad ? "bg-teal/20 text-teal-2" : "bg-amber/20 text-amber-2"}`,
								children: ARC_TESTNET_DEPLOYMENT?.launchpad ? "Testnet live" : "Simulation"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex max-w-[min(100%,calc(100vw-8rem))] items-center justify-end gap-1.5 sm:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/app/me",
									className: "hidden min-h-10 items-center gap-2 rounded-2xl border border-ink/10 bg-paper-2 px-3 py-2 font-mono text-xs tabular dark:border-paper/15 dark:bg-ink-2 sm:inline-flex",
									title: `Arc ${formatUsdc(usdc)} · all chains ${formatUsdc(allUsdc)}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatUsdc(usdc) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectWallet, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
									variant: "ghost",
									className: "min-h-10 min-w-10 px-2.5 sm:px-3",
									onClick: () => setDark(!dark),
									"aria-label": "Toggle theme",
									children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
									variant: "ghost",
									className: "hidden min-h-10 min-w-10 px-2.5 sm:inline-flex sm:px-3",
									onClick: reset,
									"aria-label": "Clear local cache",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 16 })
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:ml-[72px] md:pb-8",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed right-0 bottom-0 left-0 z-30 flex justify-around border-t border-ink/8 bg-paper/95 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden dark:border-paper/10 dark:bg-ink/95",
				children: NAV.map((n) => {
					const Icon = n.icon;
					const active = n.to === "/app" ? path === "/app" : path.startsWith(n.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						className: cn("flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px]", active ? "text-ink dark:text-paper" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 }), n.label]
					}, n.to);
				})
			})
		]
	});
}
/**
* Keep the in-browser launch catalog synced with Arc for every /app route.
* Discover alone used to own this poll, so deep links like /app/t/0 404'd
* until the user visited Discover first.
*/
function OnchainSync() {
	const upsertOnchainLaunches = useLaunchpad((s) => s.upsertOnchainLaunches);
	const syncChain = (0, import_react.useCallback)(async () => {
		if (!isLiveFactory(arcTestnet.id)) return;
		try {
			const client = createPublicClient({
				chain: arcTestnet,
				transport: http(ARC_TESTNET_DEPLOYMENT.rpc ?? "https://rpc.testnet.arc.io")
			});
			const rows = await fetchOnchainLaunches(client);
			upsertOnchainLaunches(rows.map((r) => r.launch));
		} catch {}
	}, [upsertOnchainLaunches]);
	(0, import_react.useEffect)(() => {
		syncChain();
		const id = window.setInterval(() => void syncChain(), 45e3);
		return () => window.clearInterval(id);
	}, [syncChain]);
	return null;
}
function WalletProvider({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagmiProvider, {
		config: wagmiConfig,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
			client,
			children
		})
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WalletProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnchainSync, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })] });
//#endregion
export { SplitComponent as component };
