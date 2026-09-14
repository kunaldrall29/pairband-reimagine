import { o as __toESM } from "../_runtime.mjs";
import { S as WAD, d as DEFAULT_SLIPPAGE_BPS, i as AMM_FEE_BPS, u as DEAD } from "./constants-CT0WK1Sd.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as useLaunchpad, C as sourceBalance, D as tokenBalance, T as sqrtPriceX96, _ as previewBuy, d as isStageB, f as ladder, g as poolK, h as openOrders, i as chainByDomain, l as isArc, m as minOut, n as LaunchError, o as hasBook, r as bookMid, v as previewSell, w as spreadBps } from "./store-BwIaYuXO.mjs";
import { _ as parseUnits, c as formatUsdc, d as toInput, f as GlassPanel, h as cn, i as errorCopy, l as impactLabel, o as formatPriceWad, s as formatToken, v as shortAddr } from "./router-DYi0iHDD.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { n as UsdcMark, t as ArcMark } from "./arc-mark-CtphBApM.mjs";
import { i as http, t as createPublicClient } from "../_libs/viem.mjs";
import { n as arcTestnet, t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-C1bmYj8R.mjs";
import { n as fetchOnchainLaunches } from "./onchain-launches-BACo-5UB.mjs";
import { t as SourcePicker } from "./source-picker-CQ8gVxQ0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useLiveTrade } from "./live-trade-C44aCdZg.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trade-ticket-BLN9VzaM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PoolCard({ launch }) {
	if (launch.status !== "stage_b" && launch.status !== "graduated" || !launch.pair) return null;
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
function OrderBook({ book, onPrice, symbol }) {
	const { bids, asks } = ladder(book, 8);
	const spread = spreadBps(book);
	const max = [...asks, ...bids].reduce((m, l) => l.usdc > m ? l.usdc : m, 1n);
	const asksRev = [...asks].reverse();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "font-mono text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tracking-[0.16em] text-muted uppercase",
					children: "On-chain book"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted",
					children: [
						spread === null ? "—" : `${(spread / 100).toFixed(2)}% spread`,
						" · ",
						symbol,
						"/USDC"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 px-1 text-[10px] tracking-wide text-muted uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Price" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "Size"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "USDC"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 space-y-0.5",
				children: asksRev.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Level, {
					level: l,
					max,
					tone: "ask",
					onPrice
				}, `a${l.price}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "my-2 text-center text-[11px] text-muted",
				children: asks[0] && bids[0] ? `ask ${formatPriceWad(asks[0].price)} · bid ${formatPriceWad(bids[0].price)}` : "Empty side — Uniswap backstop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-0.5",
				children: bids.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Level, {
					level: l,
					max,
					tone: "bid",
					onPrice
				}, `b${l.price}`))
			})
		]
	});
}
function Level({ level, max, tone, onPrice }) {
	const pct = Number(level.usdc * 1000n / (max === 0n ? 1n : max)) / 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onPrice?.(level.price),
		className: "relative flex min-h-8 w-full items-center overflow-hidden rounded-md px-1 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("absolute inset-y-0 right-0", tone === "bid" ? "bg-teal/20" : "bg-danger/15"),
				style: { width: `${Math.min(100, pct)}%` }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("relative z-[1] flex-1 tabular", tone === "bid" ? "text-teal-2" : "text-danger"),
				children: formatPriceWad(level.price)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative z-[1] flex-1 text-right tabular",
				children: formatToken(level.tokens, 0)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative z-[1] flex-1 text-right tabular text-muted",
				children: formatUsdc(level.usdc)
			})
		]
	}) });
}
function TradeTicket({ launch }) {
	const engine = useLaunchpad((s) => s.engine);
	const version = useLaunchpad((s) => s.version);
	const account = useLaunchpad((s) => s.account);
	const lastError = useLaunchpad((s) => s.lastError);
	const doBuy = useLaunchpad((s) => s.buy);
	const doSell = useLaunchpad((s) => s.sell);
	const doLimitBuy = useLaunchpad((s) => s.limitBuy);
	const doLimitSell = useLaunchpad((s) => s.limitSell);
	const doCancel = useLaunchpad((s) => s.cancel);
	const sourceDomain = useLaunchpad((s) => s.sourceDomain);
	const { live: walletLive, busy, approveAndBuy, approveAndSell } = useLiveTrade();
	const upsertOnchainLaunches = useLaunchpad((s) => s.upsertOnchainLaunches);
	const [preferLive, setPreferLive] = (0, import_react.useState)(true);
	const [side, setSide] = (0, import_react.useState)("buy");
	const [mode, setMode] = (0, import_react.useState)("market");
	const [raw, setRaw] = (0, import_react.useState)("10");
	const [rawPrice, setRawPrice] = (0, import_react.useState)("");
	const [slip, setSlip] = (0, import_react.useState)(Number(DEFAULT_SLIPPAGE_BPS));
	const pay = side === "buy" ? sourceBalance(engine, account, sourceDomain) : tokenBalance(engine, launch.id, account);
	const tokens = tokenBalance(engine, launch.id, account);
	const live = engine.launches.find((l) => l.id === launch.id) ?? launch;
	const book = engine.books[live.id];
	const mine = openOrders(engine, live.id, account);
	const graduated = isStageB(live);
	const bookOpen = hasBook(live);
	const parsed = (0, import_react.useMemo)(() => {
		try {
			return parseUnits(raw || "0", 18);
		} catch {
			return 0n;
		}
	}, [raw]);
	const limitPx = (0, import_react.useMemo)(() => {
		if (!rawPrice) return bookMid(book) ?? 0n;
		try {
			return parseUnits(rawPrice, 18);
		} catch {
			return 0n;
		}
	}, [
		rawPrice,
		book,
		version
	]);
	const quote = (0, import_react.useMemo)(() => {
		try {
			if (parsed <= 0n || mode === "limit") return null;
			if (side === "buy") return previewBuy(live, parsed, book);
			return previewSell(live, parsed, book);
		} catch (e) {
			return e instanceof LaunchError ? { error: e.code } : { error: "InsufficientLiquidity" };
		}
	}, [
		live,
		parsed,
		side,
		mode,
		book,
		version
	]);
	async function refreshOnchain() {
		try {
			const client = createPublicClient({
				chain: arcTestnet,
				transport: http(ARC_TESTNET_DEPLOYMENT.rpc ?? "https://rpc.testnet.arc.io")
			});
			const rows = await fetchOnchainLaunches(client);
			upsertOnchainLaunches(rows.map((r) => r.launch));
		} catch {}
	}
	async function submit() {
		if (parsed <= 0n) return;
		const onChainIdOk = /^\d+$/.test(live.id);
		const useChainBuy = preferLive && walletLive && side === "buy" && mode === "market" && onChainIdOk;
		const useChainSell = preferLive && walletLive && side === "sell" && mode === "market" && onChainIdOk;
		if (useChainBuy && quote && "tokensOut" in quote) {
			try {
				const onChainId = Number(live.id);
				await approveAndBuy(onChainId, parsed, minOut(quote.tokensOut, BigInt(slip)));
				setRaw("");
				refreshOnchain();
			} catch (e) {
				toast.error(e instanceof Error ? e.message : "Transaction failed");
			}
			return;
		}
		if (useChainSell && quote && "usdcOut" in quote) {
			try {
				const onChainId = Number(live.id);
				await approveAndSell(onChainId, parsed, minOut(quote.usdcOut, BigInt(slip)));
				setRaw("");
				refreshOnchain();
			} catch (e) {
				toast.error(e instanceof Error ? e.message : "Transaction failed");
			}
			return;
		}
		let ok = false;
		if (mode === "limit") {
			if (limitPx <= 0n) return;
			ok = side === "buy" ? doLimitBuy(live.id, limitPx, parsed) : doLimitSell(live.id, limitPx, parsed);
		} else {
			if (!quote || "error" in quote) return;
			const bps = BigInt(slip);
			ok = side === "buy" && "tokensOut" in quote ? doBuy(live.id, parsed, minOut(quote.tokensOut, bps)) : "usdcOut" in quote ? doSell(live.id, parsed, minOut(quote.usdcOut, bps)) : false;
		}
		if (ok) setRaw("");
	}
	const venue = !bookOpen ? "Bonding curve · 1.5%" : mode === "limit" ? "On-chain book · rest" : graduated ? "Book, then Uniswap" : "Book, then curve";
	const impact = quote && "impactBps" in quote ? quote.impactBps : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
		className: "p-5",
		children: [
			bookOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderBook, {
					book,
					symbol: live.symbol,
					onPrice: (p) => setRawPrice(toInput(p))
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex rounded-2xl bg-ink/5 p-1 dark:bg-paper/10",
				children: ["buy", "sell"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSide(s),
					className: `min-h-10 flex-1 rounded-xl text-sm font-medium capitalize ${side === s ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"}`,
					children: s
				}, s))
			}),
			bookOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex rounded-2xl bg-ink/5 p-1 dark:bg-paper/10",
				children: ["market", "limit"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(m),
					className: `min-h-10 flex-1 rounded-xl text-sm capitalize ${mode === m ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"}`,
					children: m
				}, m))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 12 }),
					" ",
					venue
				]
			}),
			side === "buy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourcePicker, { className: "mb-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-2 inline-flex items-center gap-1 font-mono text-[10px] text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 11 }), " Sell settles on Arc. USDC out stays until you bridge."]
			}),
			mode === "limit" && bookOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mb-2 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1 block text-[11px] text-muted",
					children: "Limit price"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: rawPrice,
					onChange: (e) => setRawPrice(e.target.value.replace(/[^0-9.]/g, "")),
					inputMode: "decimal",
					placeholder: formatPriceWad(limitPx || 0n).replace("$", ""),
					className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono text-lg tabular outline-none focus:border-teal dark:border-paper/15 dark:bg-ink"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					submit();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2",
								children: side === "buy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 20 }) : null
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: raw,
								onChange: (e) => setRaw(e.target.value.replace(/[^0-9.]/g, "")),
								inputMode: "decimal",
								placeholder: "0.00",
								className: `h-14 w-full rounded-2xl border border-ink/10 bg-paper font-mono text-2xl tabular outline-none focus:border-teal dark:border-paper/15 dark:bg-ink ${side === "buy" ? "px-12" : "px-4"}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs text-muted",
								children: side === "buy" ? "USDC" : live.symbol
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-1",
						children: [(side === "buy" ? [
							"10",
							"50",
							"100",
							"500"
						] : [
							"25",
							"50",
							"75",
							"100"
						]).map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								if (side === "buy") setRaw(chip);
								else setRaw(toInput(pay * BigInt(chip) / 100n));
							},
							className: "min-h-8 rounded-full bg-ink/5 px-2.5 font-mono text-[11px] text-muted hover:bg-ink/10 dark:bg-paper/10",
							children: side === "buy" ? `$${chip}` : `${chip}%`
						}, chip)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-8 rounded-full bg-ink/5 px-2.5 font-mono text-[11px] font-medium text-teal-2 hover:bg-ink/10 dark:bg-paper/10",
							onClick: () => setRaw(toInput(pay)),
							children: "Max"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-xs text-muted",
						children: side === "buy" ? `Balance ${formatUsdc(pay)} on ${chainByDomain(sourceDomain)?.name ?? "Arc"}` : `Balance ${formatToken(tokens)} ${live.symbol}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-2xl bg-ink/5 px-4 py-3 font-mono text-sm dark:bg-paper/5",
						children: mode === "limit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								"Rests on the book at ",
								formatPriceWad(limitPx),
								". Crossed size fills immediately. Remainder escrowed on-chain."
							]
						}) : quote && "error" in quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
							className: `mt-1 text-xs ${impact >= 80 ? "text-danger" : "text-muted"}`,
							children: [
								"Impact ",
								impactLabel(quote.impactBps),
								quote.bookUsdc && quote.bookUsdc > 0n ? ` · book ${formatUsdc(quote.bookUsdc)}` : "",
								quote.ammUsdc && quote.ammUsdc > 0n ? ` · Uniswap ${formatUsdc(quote.ammUsdc)}` : ""
							]
						})] }) : quote && "usdcOut" in quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["You receive ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular",
							children: formatUsdc(quote.usdcOut)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `mt-1 text-xs ${impact >= 80 ? "text-danger" : "text-muted"}`,
							children: ["Impact ", impactLabel(quote.impactBps)]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Enter an amount to preview."
						})
					}),
					mode === "market" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
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
					}) : null,
					lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-danger",
						children: errorCopy(lastError)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
						className: "mt-4 w-full",
						type: "submit",
						disabled: parsed <= 0n || busy,
						children: [busy ? "Confirm in wallet…" : preferLive && walletLive && mode === "market" && /^\d+$/.test(live.id) ? `${side === "buy" ? "Buy" : "Sell"} on Arc · ${live.symbol}` : mode === "limit" ? `Post ${side}` : side === "buy" ? `Buy ${live.symbol}` : `Sell ${live.symbol}`, !busy && bookOpen && mode === "market" ? graduated ? " · book+AMM" : " · book+curve" : ""]
					}),
					walletLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 flex items-center gap-2 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: preferLive,
							onChange: (e) => setPreferLive(e.target.checked),
							className: "size-4 rounded border-ink/20"
						}), "Broadcast market orders to the Arc launchpad (curve before graduation, book after)"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "Connect a wallet to broadcast. Until then fills use this preview book."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: [
					live.status === "curve" ? "1.0% protocol + 0.5% creator in USDC. At $80 the pair mints, LP burns, and an on-chain book opens." : "Market walks the on-chain book (price-time), then Uniswap 0.30%. Limits rest; cancel returns escrow. LP cannot be pulled.",
					" ",
					side === "buy" && !isArc(sourceDomain) ? `This fill burns USDC on ${chainByDomain(sourceDomain)?.name} (CCTP ${sourceDomain}) and settles on Arc domain 26.` : "Tokens never leave Arc."
				]
			}),
			mine.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-ink/8 pt-3 dark:border-paper/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-mono text-[11px] text-muted uppercase",
					children: "Your orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: mine.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono",
							children: [
								o.side,
								" ",
								formatPriceWad(o.price),
								" · ",
								formatToken(o.remaining, 0)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-danger",
							onClick: () => doCancel(live.id, o.id),
							children: "Cancel"
						})]
					}, o.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				children: WAD.toString()
			})
		]
	});
}
//#endregion
export { PriceChart as n, TradeTicket as r, PoolCard as t };
