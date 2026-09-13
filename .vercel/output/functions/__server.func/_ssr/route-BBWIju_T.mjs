import { i as __toESM } from "../_runtime.mjs";
import { D as shortAddr, w as formatUsdc, y as cn } from "./format-BlK3yrc5.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { f as useRouterState, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useLaunchpad, g as usdcBalance, i as hydrateLaunchpad } from "./store-BFkd_wST.mjs";
import { t as ClayButton } from "./clay-button-Bi5H0-iU.mjs";
import { a as RotateCcw, c as Compass, l as ArrowLeftRight, o as Plus, r as Sun, s as Moon, t as Wallet, u as Activity } from "../_libs/lucide-react.mjs";
import { i as Wordmark } from "./router-CJlix3MW.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BBWIju_T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	const reset = useLaunchpad((s) => s.resetDemo);
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const lastEvent = useLaunchpad((s) => s.lastEvent);
	const clearEvent = useLaunchpad((s) => s.clearEvent);
	const usdc = usdcBalance(engine, account);
	(0, import_react.useEffect)(() => {
		hydrateLaunchpad();
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);
	(0, import_react.useEffect)(() => {
		if (!lastEvent) return;
		if (lastEvent.kind === "graduate") toast.success(`${lastEvent.symbol} graduated to Uniswap. LP burned.`);
		else if (lastEvent.kind === "create") toast(`${lastEvent.symbol} is live on the curve.`);
		clearEvent();
	}, [lastEvent, clearEvent]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper", dark && "dark"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed top-0 bottom-0 left-0 z-30 hidden w-[72px] flex-col items-center border-r border-ink/8 bg-paper-2 py-4 dark:border-paper/10 dark:bg-ink-2 md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mb-6",
					"aria-label": "Pairband home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "28",
						height: "28",
						viewBox: "0 0 24 24",
						"aria-hidden": true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M2 9.5c4-3 8 3 12 0s8 3 8 3",
							fill: "none",
							stroke: "#E8B86D",
							strokeWidth: "2.2",
							strokeLinecap: "round"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M2 14.5c4-3 8 3 12 0s8 3 8 3",
							fill: "none",
							stroke: "#3D9B8F",
							strokeWidth: "2.2",
							strokeLinecap: "round"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
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
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-ink/8 bg-paper/80 backdrop-blur-xl dark:border-paper/10 dark:bg-ink/80 md:ml-[72px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3 md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { size: "sm" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-2 md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-teal/15 px-2.5 py-1 font-mono text-[11px] text-teal-2",
								children: "Arc Testnet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-amber/20 px-2.5 py-1 font-mono text-[11px] text-amber-2",
								children: "Local simulation"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden rounded-2xl border border-ink/10 bg-paper-2 px-3 py-2 font-mono text-xs tabular dark:border-paper/15 dark:bg-ink-2 sm:block",
									children: [formatUsdc(usdc), " USDC"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
									variant: "ghost",
									className: "min-h-10 px-3",
									onClick: () => setDark(!dark),
									"aria-label": "Toggle theme",
									children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
									variant: "ghost",
									className: "min-h-10 px-3",
									onClick: reset,
									"aria-label": "Reset demo",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 16 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-2xl border border-ink/10 bg-paper-2 px-3 py-2 font-mono text-xs dark:border-paper/15 dark:bg-ink-2",
									children: shortAddr(account, 3)
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pb-24 md:ml-[72px] md:pb-8",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed right-0 bottom-0 left-0 z-30 flex justify-around border-t border-ink/8 bg-paper/95 px-1 py-2 backdrop-blur md:hidden dark:border-paper/10 dark:bg-ink/95",
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
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
