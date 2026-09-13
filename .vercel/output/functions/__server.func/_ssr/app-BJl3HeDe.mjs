import { i as __toESM } from "../_runtime.mjs";
import { O as timeAgo, S as formatPriceWad, d as GRADUATE_AT, w as formatUsdc, x as formatCompact, y as cn } from "./format-BlK3yrc5.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useLaunchpad, a as marketCap, f as protocolStats, n as graduateProgress, u as priceOf } from "./store-BFkd_wST.mjs";
import { t as ClayButton } from "./clay-button-Bi5H0-iU.mjs";
import { t as TokenGlyph } from "./token-glyph-m-nzutxZ.mjs";
import { t as CurveMeter } from "./curve-meter-BsbSOHMS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-BJl3HeDe.js
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
	const prices = engine.trades.filter((t) => t.launchId === launch.id && t.price > 0n).slice(0, 24).reverse().map((t) => Number(t.price) / 0xde0b6b3a7640000);
	const cap = marketCap(launch);
	const px = priceOf(launch);
	const graduated = launch.status === "graduated";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/app/t/$id",
		params: { id: launch.id },
		className: cn("block overflow-hidden rounded-[24px] border border-ink/8 bg-paper p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5 dark:border-paper/10 dark:bg-ink-2"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
						symbol: launch.symbol,
						hue: launch.hue
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: launch.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-muted",
								children: launch.symbol
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 truncate text-xs text-muted",
							children: launch.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase", graduated ? "bg-teal/15 text-teal-2" : "bg-amber/20 text-amber-2"),
						children: graduated ? "Uniswap" : "Curve"
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
					children: ["FDV ", formatCompact(cap)]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, { values: prices.length > 1 ? prices : [
					1,
					1.02,
					.99,
					1.04
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex items-center justify-between gap-4",
				children: graduated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[11px] text-teal-2",
					suppressHydrationWarning: true,
					children: ["LP locked · ", timeAgo(launch.createdAt)]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurveMeter, {
					progress: graduateProgress(launch),
					label: "To Uniswap",
					className: "flex-1"
				})
			})
		]
	});
}
function Discover() {
	const engine = useLaunchpad((s) => s.engine);
	const version = useLaunchpad((s) => s.version);
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("new");
	const stats = protocolStats(engine);
	const rows = (0, import_react.useMemo)(() => {
		let list = engine.launches.slice();
		const query = q.trim().toLowerCase();
		if (query) list = list.filter((l) => l.name.toLowerCase().includes(query) || l.symbol.toLowerCase().includes(query) || l.description.toLowerCase().includes(query));
		if (filter === "curve") list = list.filter((l) => l.status === "curve");
		if (filter === "uniswap") list = list.filter((l) => l.status === "graduated");
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
						className: "mt-1 text-sm text-muted",
						children: [
							stats.count,
							" tokens · ",
							stats.graduated,
							" Uniswap pairs · ",
							formatCompact(stats.volume),
							" volume"
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
						["graduating", "Near Uniswap"],
						["curve", "Curve"],
						["uniswap", "Uniswap"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(id),
						className: `min-h-10 shrink-0 rounded-xl px-3 text-sm ${filter === id ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"}`,
						children: label
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-muted",
				children: [
					"Graduation at ",
					formatUsdc(GRADUATE_AT),
					" USDC. LP is burned. These numbers are the demo book, not a live TVL. Buy Teal Machine to watch the pair mint."
				]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-16 text-center text-muted",
				children: "No markets match that filter."
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
