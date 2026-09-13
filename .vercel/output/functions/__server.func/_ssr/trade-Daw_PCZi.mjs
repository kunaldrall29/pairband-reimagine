import { i as __toESM } from "../_runtime.mjs";
import { S as formatPriceWad, w as formatUsdc, y as cn } from "./format-BlK3yrc5.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { t as Tape } from "./tape-BzzpMNrS.mjs";
import { _ as useLaunchpad, d as priceSeries, u as priceOf } from "./store-BFkd_wST.mjs";
import { t as TokenGlyph } from "./token-glyph-m-nzutxZ.mjs";
import { r as GlassPanel } from "./router-CJlix3MW.mjs";
import { n as PriceChart, r as TradeTicket, t as PoolCard } from "./trade-ticket-DMWFltYZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trade-Daw_PCZi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Trade() {
	const engine = useLaunchpad((s) => s.engine);
	const version = useLaunchpad((s) => s.version);
	const [id, setId] = (0, import_react.useState)(engine.launches[0]?.id ?? "");
	const [q, setQ] = (0, import_react.useState)("");
	const launch = engine.launches.find((l) => l.id === id) ?? engine.launches[0];
	const list = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		let rows = engine.launches.slice();
		if (query) rows = rows.filter((l) => l.symbol.toLowerCase().includes(query) || l.name.toLowerCase().includes(query));
		return rows;
	}, [
		engine,
		q,
		version
	]);
	if (!launch) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-16 text-center text-muted",
		children: "No markets yet."
	});
	const series = priceSeries(engine, launch.id);
	const trades = engine.trades.filter((t) => t.launchId === launch.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)_340px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
					children: "Trade"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight",
					children: "USDC pairs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter",
					className: "mt-4 h-10 w-full rounded-xl border border-ink/10 bg-paper px-3 text-sm outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 max-h-[70vh] space-y-1 overflow-auto pr-1",
					children: list.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setId(l.id),
						className: cn("flex w-full min-h-14 items-center gap-3 rounded-2xl border px-3 text-left transition-colors", l.id === launch.id ? "border-ink/20 bg-paper-2 dark:border-paper/20 dark:bg-ink-2" : "border-ink/8 hover:bg-ink/5 dark:border-paper/10"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
								symbol: l.symbol,
								hue: l.hue,
								size: 32
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-medium",
									children: l.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-mono text-[11px] text-muted",
									children: l.status === "graduated" ? "Uniswap" : "Curve"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tabular",
								children: formatPriceWad(priceOf(l))
							})
						]
					}) }, l.id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
									symbol: launch.symbol,
									hue: launch.hue,
									size: 40
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-3xl",
									children: [launch.symbol, "/USDC"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] text-muted uppercase",
									children: launch.status === "graduated" ? "Uniswap v2-style pair" : "Bonding curve"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-2xl tabular",
								children: formatPriceWad(priceOf(launch))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
							points: series,
							className: "mt-4"
						})]
					}),
					launch.status === "graduated" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoolCard, { launch })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"Raised ",
							formatUsdc(launch.realUsdc),
							" of $80.00. Next venue is a locked Uniswap pair."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-6 font-medium",
						children: "Tape"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tape, {
							trades,
							engine,
							symbol: launch.symbol
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradeTicket, { launch })
		]
	});
}
//#endregion
export { Trade as component };
