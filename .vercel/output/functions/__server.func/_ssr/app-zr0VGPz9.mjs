import { o as __toESM } from "../_runtime.mjs";
import { p as GRADUATE_AT } from "./constants-CT0WK1Sd.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as useLaunchpad, a as graduateProgress, d as isStageB, o as hasBook, p as marketCap, u as isOnchainLaunchId, x as protocolStats, y as priceOf } from "./store-BwIaYuXO.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as RefreshCw, o as Star } from "../_libs/lucide-react.mjs";
import { a as formatCompact, c as formatUsdc, h as cn, o as formatPriceWad } from "./router-DYi0iHDD.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { n as UsdcMark, t as ArcMark } from "./arc-mark-CtphBApM.mjs";
import { t as TokenGlyph } from "./token-glyph-CtI3byco.mjs";
import { i as http, t as createPublicClient } from "../_libs/viem.mjs";
import { i as isLiveFactory, n as arcTestnet, t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-C1bmYj8R.mjs";
import { n as fetchOnchainLaunches } from "./onchain-launches-BACo-5UB.mjs";
import { t as CurveMeter } from "./curve-meter-DUwsXm5G.mjs";
import { t as StatusChip } from "./status-chip-Do3CAv8s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-zr0VGPz9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Sparkline({ values, className, up }) {
	const w = 120;
	const h = 36;
	if (values.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: w,
		height: h,
		className,
		"aria-hidden": true
	});
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const pts = values.map((v, i) => {
		const x = i / (values.length - 1) * w;
		const y = 32 - (v - min) / span * 28;
		return `${x.toFixed(1)},${y.toFixed(1)}`;
	}).join(" ");
	const positive = up ?? values[values.length - 1] >= values[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: w,
		height: h,
		viewBox: `0 0 ${w} ${h}`,
		className: cn("overflow-visible", className),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
			fill: "none",
			stroke: positive ? "#3D9B8F" : "#C45C4A",
			strokeWidth: "1.75",
			strokeLinejoin: "round",
			strokeLinecap: "round",
			points: pts
		})
	});
}
function TokenCard({ launch, engine }) {
	const watchlist = useLaunchpad((s) => s.watchlist);
	const toggleWatch = useLaunchpad((s) => s.toggleWatch);
	const prices = engine.trades.filter((t) => t.launchId === launch.id && t.price > 0n).slice(0, 24).reverse().map((t) => Number(t.price) / 0xde0b6b3a7640000);
	const book = engine.books[launch.id];
	const cap = marketCap(launch, book);
	const px = priceOf(launch, book);
	const locked = isStageB(launch);
	const bookLive = hasBook(launch);
	const watched = watchlist.includes(launch.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/app/t/$id",
		params: { id: launch.id },
		className: cn("relative block overflow-hidden rounded-[24px] border border-ink/8 bg-paper p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5 dark:border-paper/10 dark:bg-ink-2"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
						symbol: launch.symbol,
						hue: launch.hue,
						imageUrl: launch.imageUrl
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: launch.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 font-mono text-[11px] text-muted",
									children: [
										launch.symbol,
										"/",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 10 })
									]
								}),
								launch.websiteVerified || launch.twitterVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-teal/15 px-1.5 py-0.5 text-[10px] text-teal",
									children: launch.websiteVerified && launch.twitterVerified ? "Verified" : launch.websiteVerified ? "Site ✓" : "X ✓"
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 truncate text-xs text-muted",
							children: launch.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
						status: launch.status,
						compact: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-lg tabular",
					children: formatPriceWad(px)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						"FDV ",
						formatCompact(cap),
						" · vol ",
						formatUsdc(launch.volumeUsdc, 0)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, { values: prices })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between gap-4",
				children: [locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-teal-2",
					children: "LP locked · book + Uniswap"
				}) : bookLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-teal-2",
					children: "Book open · curve still live"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurveMeter, {
					progress: graduateProgress(launch),
					label: "To Stage A",
					className: "flex-1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": watched ? "Unwatch" : "Watch",
					onClick: (e) => {
						e.preventDefault();
						e.stopPropagation();
						toggleWatch(launch.id);
					},
					className: cn("flex size-8 items-center justify-center rounded-full", watched ? "text-amber-2" : "text-muted"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
						size: 14,
						fill: watched ? "currentColor" : "none"
					})
				})]
			})
		]
	});
}
function Discover() {
	const engine = useLaunchpad((s) => s.engine);
	const version = useLaunchpad((s) => s.version);
	const upsertOnchainLaunches = useLaunchpad((s) => s.upsertOnchainLaunches);
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("new");
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [syncError, setSyncError] = (0, import_react.useState)(null);
	const [lastSync, setLastSync] = (0, import_react.useState)(null);
	const stats = protocolStats(engine);
	const syncChain = (0, import_react.useCallback)(async () => {
		if (!isLiveFactory(arcTestnet.id)) return;
		setSyncing(true);
		setSyncError(null);
		try {
			const client = createPublicClient({
				chain: arcTestnet,
				transport: http(ARC_TESTNET_DEPLOYMENT.rpc ?? "https://rpc.testnet.arc.io")
			});
			const rows = await fetchOnchainLaunches(client);
			upsertOnchainLaunches(rows.map((r) => r.launch));
			setLastSync(Date.now());
		} catch (e) {
			setSyncError(e instanceof Error ? e.message : "Sync failed");
		} finally {
			setSyncing(false);
		}
	}, [upsertOnchainLaunches]);
	(0, import_react.useEffect)(() => {
		syncChain();
		const id = window.setInterval(() => void syncChain(), 45e3);
		return () => window.clearInterval(id);
	}, [syncChain]);
	const rows = (0, import_react.useMemo)(() => {
		let list = engine.launches.slice();
		const query = q.trim().toLowerCase();
		if (query) list = list.filter((l) => l.name.toLowerCase().includes(query) || l.symbol.toLowerCase().includes(query) || l.description.toLowerCase().includes(query));
		list = list.filter((l) => isOnchainLaunchId(l.id));
		if (filter === "curve") list = list.filter((l) => l.status === "curve");
		if (filter === "uniswap") list = list.filter((l) => l.status === "stage_b");
		if (filter === "graduating") {
			list = list.filter((l) => l.status === "curve" && graduateProgress(l) >= .6);
			list.sort((a, b) => graduateProgress(b) - graduateProgress(a));
		} else if (filter === "mcap") list.sort((a, b) => marketCap(b) > marketCap(a) ? 1 : -1);
		else if (filter === "volume") list.sort((a, b) => a.volumeUsdc < b.volumeUsdc ? 1 : -1);
		else list.sort((a, b) => b.createdAt - a.createdAt);
		return list;
	}, [
		engine,
		q,
		filter,
		version
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl overflow-x-hidden px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
						children: "Discover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-tight",
						children: "Markets on Arc"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 inline-flex flex-wrap items-center gap-2 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 12 }),
									" ",
									stats.count,
									" tokens"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [stats.graduated, " books"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 12 }),
									" ",
									formatCompact(stats.volume),
									" volume"
								]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/create",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, { children: "Create token" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search name or symbol",
					className: "h-11 min-h-11 flex-1 rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 overflow-x-auto rounded-2xl bg-ink/5 p-1 dark:bg-paper/10",
					children: [
						["new", "New"],
						["mcap", "Market cap"],
						["volume", "Volume"],
						["graduating", "Near book"],
						["curve", "Curve"],
						["uniswap", "Book"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(id),
						className: `min-h-10 shrink-0 rounded-xl px-3 text-sm ${filter === id ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"}`,
						children: label
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void syncChain(),
						disabled: syncing,
						className: "inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper px-3 py-1.5 font-medium text-ink transition hover:border-teal dark:border-paper/15 dark:bg-ink-2 dark:text-paper",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3.5", syncing && "animate-spin") }), syncing ? "Syncing Arc…" : "Sync on-chain"]
					}),
					lastSync ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Updated ", new Date(lastSync).toLocaleTimeString()] }) : null,
					syncError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-coral",
						children: syncError
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex flex-wrap items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 12 }),
							" quoted · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 12 }),
							" settled · graduation at",
							" ",
							formatUsdc(GRADUATE_AT),
							". Showing on-chain markets only. Sync to pull the latest from Arc."
						]
					})
				]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-16 text-center text-muted",
				children: "No on-chain markets yet. Create a token or sync Arc."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: rows.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenCard, {
					launch: l,
					engine
				}, l.id))
			})
		]
	});
}
//#endregion
export { Discover as component };
