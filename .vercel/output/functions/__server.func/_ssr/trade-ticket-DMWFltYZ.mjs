import { i as __toESM } from "../_runtime.mjs";
import { C as formatToken, D as shortAddr, E as parseUnits, T as impactLabel, a as DEAD, b as errorCopy, k as toInput, o as DEFAULT_SLIPPAGE_BPS, t as AMM_FEE_BPS, v as WAD, w as formatUsdc, y as cn } from "./format-BlK3yrc5.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { _ as useLaunchpad, c as previewBuy, g as usdcBalance, h as tokenBalance, l as previewSell, m as sqrtPriceX96, o as minOut, s as poolK, t as LaunchError } from "./store-BFkd_wST.mjs";
import { t as ClayButton } from "./clay-button-Bi5H0-iU.mjs";
import { r as GlassPanel } from "./router-CJlix3MW.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trade-ticket-DMWFltYZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PoolCard({ launch }) {
	if (launch.status !== "graduated" || !launch.pair) return null;
	const k = poolK(launch.reserveUsdc, launch.reserveToken);
	const sqrtP = sqrtPriceX96(launch.reserveToken, launch.reserveUsdc);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.16em] text-teal-2 uppercase",
				children: "Uniswap pair"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mt-1 font-display text-2xl",
				children: [launch.symbol, " / USDC"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					"Constant product. ",
					(Number(AMM_FEE_BPS) / 100).toFixed(2),
					"% swap fee. LP burned to ",
					shortAddr(DEAD, 4),
					" — there is no removeLiquidity on this locker."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[11px] text-muted uppercase",
						children: "USDC reserve"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono tabular",
						children: formatUsdc(launch.reserveUsdc)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
						className: "font-mono text-[11px] text-muted uppercase",
						children: [launch.symbol, " reserve"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono tabular",
						children: formatToken(launch.reserveToken, 0)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[11px] text-muted uppercase",
						children: "k"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono text-xs tabular",
						children: [k.toString().slice(0, 12), "…"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[11px] text-muted uppercase",
						children: "sqrtPriceX96"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono text-xs tabular",
						children: [sqrtP.toString().slice(0, 12), "…"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[11px] text-muted uppercase",
						children: "Pair"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-xs",
						children: shortAddr(launch.pair, 6)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[11px] text-muted uppercase",
						children: "LP burned"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-xs tabular",
						children: formatToken(launch.lpBurned, 0)
					})] })
				]
			})
		]
	});
}
function PriceChart({ points, className }) {
	const data = points.length >= 2 ? points.map((d) => ({
		t: d.t,
		p: d.p,
		label: new Date(d.t).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		})
	})) : [{
		t: 0,
		p: .08,
		label: "—"
	}, {
		t: 1,
		p: .081,
		label: "—"
	}];
	const up = data[data.length - 1].p >= data[0].p;
	const stroke = up ? "#3D9B8F" : "#C45C4A";
	const fillId = up ? "pxUp" : "pxDn";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-56 w-full", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "pxUp",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#3D9B8F",
							stopOpacity: .35
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#3D9B8F",
							stopOpacity: 0
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "pxDn",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#C45C4A",
							stopOpacity: .35
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#C45C4A",
							stopOpacity: 0
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						hide: true,
						domain: ["auto", "auto"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: {
							background: "#F4F1EA",
							border: "1px solid rgba(11,15,20,0.1)",
							borderRadius: 12,
							fontFamily: "IBM Plex Mono, monospace",
							fontSize: 12
						},
						formatter: (v) => [`$${v.toPrecision(6)}`, "Price"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "p",
						stroke,
						strokeWidth: 1.8,
						fill: `url(#${fillId})`
					})
				]
			})
		})
	});
}
function TradeTicket({ launch }) {
	const engine = useLaunchpad((s) => s.engine);
	const version = useLaunchpad((s) => s.version);
	const account = useLaunchpad((s) => s.account);
	const lastError = useLaunchpad((s) => s.lastError);
	const doBuy = useLaunchpad((s) => s.buy);
	const doSell = useLaunchpad((s) => s.sell);
	const [side, setSide] = (0, import_react.useState)("buy");
	const [raw, setRaw] = (0, import_react.useState)("10");
	const [slip, setSlip] = (0, import_react.useState)(Number(DEFAULT_SLIPPAGE_BPS));
	const usdc = usdcBalance(engine, account);
	const tokens = tokenBalance(engine, launch.id, account);
	const live = engine.launches.find((l) => l.id === launch.id) ?? launch;
	const parsed = (0, import_react.useMemo)(() => {
		try {
			return parseUnits(raw || "0", 18);
		} catch {
			return 0n;
		}
	}, [raw]);
	const quote = (0, import_react.useMemo)(() => {
		try {
			if (parsed <= 0n) return null;
			if (side === "buy") return previewBuy(live, parsed);
			return previewSell(live, parsed);
		} catch (e) {
			return e instanceof LaunchError ? { error: e.code } : { error: "InsufficientLiquidity" };
		}
	}, [
		live,
		parsed,
		side,
		version
	]);
	function submit() {
		if (parsed <= 0n || !quote || "error" in quote) return;
		const bps = BigInt(slip);
		if (side === "buy" && "tokensOut" in quote ? doBuy(live.id, parsed, minOut(quote.tokensOut, bps)) : "usdcOut" in quote ? doSell(live.id, parsed, minOut(quote.usdcOut, bps)) : false) setRaw("");
	}
	const venue = live.status === "graduated" ? "Uniswap pair · 0.30%" : "Bonding curve · 1.5%";
	const impactHot = (quote && "impactBps" in quote ? quote.impactBps : 0) >= 80;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex rounded-2xl bg-ink/5 p-1 dark:bg-paper/10",
				children: ["buy", "sell"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSide(s),
					className: `min-h-10 flex-1 rounded-xl text-sm font-medium capitalize transition-colors ${side === s ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"}`,
					children: s
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-2 font-mono text-[11px] tracking-wide text-muted uppercase",
				children: [venue, " · USDC"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Amount"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: raw,
					onChange: (e) => setRaw(e.target.value.replace(/[^0-9.]/g, "")),
					inputMode: "decimal",
					placeholder: "0.00",
					className: "h-14 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono text-2xl tabular outline-none focus:border-teal dark:border-paper/15 dark:bg-ink"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex justify-between text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: side === "buy" ? `Balance ${formatUsdc(usdc)}` : `Balance ${formatToken(tokens)} ${live.symbol}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "font-medium text-teal-2",
					onClick: () => setRaw(toInput(side === "buy" ? usdc : tokens)),
					children: "Max"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-2xl bg-ink/5 px-4 py-3 font-mono text-sm dark:bg-paper/5",
				children: quote && "error" in quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-danger",
					children: errorCopy(quote.error)
				}) : quote && "tokensOut" in quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"You receive ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular",
						children: formatToken(quote.tokensOut)
					}),
					" ",
					live.symbol
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: `mt-1 text-xs ${impactHot ? "text-danger" : "text-muted"}`,
					children: [
						"Price impact ",
						impactLabel(quote.impactBps),
						quote.venue === "uniswap" ? " · Uniswap 0.30% in the quote" : " · curve k-shift"
					]
				})] }) : quote && "usdcOut" in quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["You receive ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular",
					children: formatUsdc(quote.usdcOut)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: `mt-1 text-xs ${impactHot ? "text-danger" : "text-muted"}`,
					children: ["Price impact ", impactLabel(quote.impactBps)]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Enter an amount to preview."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex items-center justify-between text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Slippage ",
					slip / 100,
					"%"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 10,
					max: 300,
					step: 10,
					value: slip,
					onChange: (e) => setSlip(Number(e.target.value)),
					className: "w-28"
				})]
			}),
			lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: errorCopy(lastError)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
				className: "mt-4 w-full",
				onClick: submit,
				disabled: parsed <= 0n,
				children: [side === "buy" ? `Buy ${live.symbol}` : `Sell ${live.symbol}`, live.status === "graduated" ? " on Uniswap" : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: live.status === "curve" ? "1.0% protocol + 0.5% creator, taken in USDC. The buy that fills $80 mints the Uniswap pair and burns LP to 0xdead." : "Uniswap-style constant product. 0.3% fee stays in the pool. Liquidity is burned — nobody can pull it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				children: WAD.toString()
			})
		]
	});
}
//#endregion
export { PriceChart as n, TradeTicket as r, PoolCard as t };
