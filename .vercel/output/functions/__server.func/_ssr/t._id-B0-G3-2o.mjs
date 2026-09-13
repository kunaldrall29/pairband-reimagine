import { C as formatToken, D as shortAddr, S as formatPriceWad, d as GRADUATE_AT, m as TOTAL_SUPPLY, w as formatUsdc, x as formatCompact, y as cn } from "./format-BlK3yrc5.mjs";
import { c as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Tape } from "./tape-BzzpMNrS.mjs";
import { _ as useLaunchpad, a as marketCap, d as priceSeries, h as tokenBalance, n as graduateProgress, r as holdersOf, u as priceOf } from "./store-BFkd_wST.mjs";
import { t as TokenGlyph } from "./token-glyph-m-nzutxZ.mjs";
import { t as CurveMeter } from "./curve-meter-BsbSOHMS.mjs";
import { i as Star } from "../_libs/lucide-react.mjs";
import { n as Route$1, r as GlassPanel } from "./router-CJlix3MW.mjs";
import { n as PriceChart, r as TradeTicket, t as PoolCard } from "./trade-ticket-DMWFltYZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/t._id-B0-G3-2o.js
var import_jsx_runtime = require_jsx_runtime();
function TokenPage() {
	const { id } = Route$1.useParams();
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const account = useLaunchpad((s) => s.account);
	const watchlist = useLaunchpad((s) => s.watchlist);
	const toggleWatch = useLaunchpad((s) => s.toggleWatch);
	const launch = engine.launches.find((l) => l.id === id);
	if (!launch) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Token not found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/app",
			className: "mt-3 inline-block text-teal-2",
			children: "Back to discover"
		})]
	});
	const trades = engine.trades.filter((t) => t.launchId === id);
	const held = tokenBalance(engine, id, account);
	const px = priceOf(launch);
	const cap = marketCap(launch);
	const raised = launch.status === "graduated" ? launch.reserveUsdc : launch.realUsdc;
	const holders = holdersOf(engine, id);
	const watched = watchlist.includes(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/app",
			className: "text-xs text-muted hover:text-ink dark:hover:text-paper",
			children: "Discover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-6 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
							symbol: launch.symbol,
							hue: launch.hue,
							size: 56
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-4xl tracking-tight",
										children: launch.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-sm text-muted",
										children: [launch.symbol, "/USDC"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] uppercase dark:bg-paper/10",
										children: launch.status === "graduated" ? "Graduated · Uniswap" : "Bonding curve"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: launch.description
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggleWatch(id),
							className: cn("flex size-11 items-center justify-center rounded-2xl border", watched ? "border-amber bg-amber/20 text-amber-2" : "border-ink/10 text-muted dark:border-paper/15"),
							"aria-label": "Watch",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
								size: 18,
								fill: watched ? "currentColor" : "none"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] text-muted uppercase",
								children: "Last"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-3xl tabular",
								children: formatPriceWad(px)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-muted",
								children: [launch.txCount, " prints"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
							points: priceSeries(engine, id),
							className: "mt-4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "FDV",
									value: formatCompact(cap)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: launch.status === "graduated" ? "Pair USDC" : "Raised",
									value: formatUsdc(raised)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Holders",
									value: String(launch.holders)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Volume",
									value: formatCompact(launch.volumeUsdc)
								})
							]
						}),
						launch.status === "curve" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurveMeter, {
								progress: graduateProgress(launch),
								label: `To Uniswap (${formatUsdc(GRADUATE_AT)})`
							})
						}) : null
					]
				}),
				launch.status === "graduated" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoolCard, { launch })
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: "Tape"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tape, {
							trades,
							engine,
							symbol: launch.symbol
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: "Holders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-ink/8 rounded-[20px] border border-ink/8 dark:divide-paper/10 dark:border-paper/10",
						children: holders.slice(0, 8).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between px-4 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: shortAddr(h.account)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular",
								children: formatToken(h.amount, 0)
							})]
						}, h.account))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-6 grid gap-2 text-xs text-muted sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Creator ", shortAddr(launch.creator)] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Token ", shortAddr(launch.token)] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Curve ", shortAddr(launch.curve)] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"Your bag ",
							formatToken(held),
							" ",
							launch.symbol
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Supply ", formatToken(TOTAL_SUPPLY, 0)] }),
						launch.pair ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Pair ", shortAddr(launch.pair)] }) : null
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradeTicket, { launch })]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "font-mono text-[11px] text-muted uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5 font-mono tabular",
		children: value
	})] });
}
//#endregion
export { TokenPage as component };
