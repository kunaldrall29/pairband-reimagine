import { o as __toESM } from "../_runtime.mjs";
import { T as WAD, f as DEMO_USER, m as FAUCET_AMOUNT } from "./constants-BJEdPgzX.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as tokenBalance, E as useLaunchpad, T as usdcBalance, b as sourceBalance, c as isArc, g as priceOf, t as CCTP_CHAINS } from "./store-DuP6GcAD.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as parseUnits, c as formatUsdc, f as GlassPanel, i as errorCopy, o as formatPriceWad, s as formatToken, v as shortAddr } from "./router-DnRFdBgV.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { t as TokenGlyph } from "./token-glyph-CtI3byco.mjs";
import { n as UsdcMark, t as ArcMark } from "./arc-mark-CtphBApM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-rYsX4rlG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Me() {
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const account = useLaunchpad((s) => s.account);
	const faucet = useLaunchpad((s) => s.faucet);
	const lastError = useLaunchpad((s) => s.lastError);
	const watchlist = useLaunchpad((s) => s.watchlist);
	const bridgeOut = useLaunchpad((s) => s.bridgeOut);
	const usdc = usdcBalance(engine, account);
	const [dest, setDest] = (0, import_react.useState)(0);
	const [raw, setRaw] = (0, import_react.useState)("100");
	const parsed = (0, import_react.useMemo)(() => {
		try {
			return parseUnits(raw || "0", 18);
		} catch {
			return 0n;
		}
	}, [raw]);
	const positions = engine.launches.map((l) => ({
		launch: l,
		amount: tokenBalance(engine, l.id, account)
	})).filter((p) => p.amount > 0n);
	const created = engine.launches.filter((l) => l.creator === account);
	const watched = engine.launches.filter((l) => watchlist.includes(l.id));
	const value = positions.reduce((acc, p) => {
		const px = priceOf(p.launch);
		return acc + p.amount * px / WAD;
	}, 0n);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
				children: "Wallet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Your book"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-xs text-muted",
				children: [shortAddr(account, 6), " · curve tokens settle on Arc · USDC is gas and quote"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 12 }), " Arc USDC"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl tabular",
							children: formatUsdc(usdc)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Connected wallets show on-chain USDC. The faucet only credits the local demo account."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
							className: "mt-4",
							variant: "secondary",
							onClick: () => faucet(),
							children: ["Faucet ", formatUsdc(FAUCET_AMOUNT, 0)]
						}),
						lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-danger",
							children: errorCopy(lastError)
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-muted uppercase",
							children: "Token mark"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl tabular",
							children: formatUsdc(value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								positions.length,
								" positions · ",
								created.length,
								" launched"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "mt-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 12 }), " USDC by chain"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: CCTP_CHAINS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl bg-ink/5 px-3 py-2 dark:bg-paper/5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "inline-flex items-center gap-1 font-mono text-[10px] text-muted uppercase",
								children: [isArc(c.domain) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 10 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 10 }), c.short]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm tabular",
								children: formatUsdc(sourceBalance(engine, account, c.domain), 0)
							})]
						}, c.domain))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							"Buy from any of these. CCTP burns source USDC and mints on Arc (domain ",
							26,
							")."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted",
								children: ["Bridge out", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "ml-2 h-10 rounded-xl border border-ink/10 bg-paper px-2 font-mono text-sm dark:border-paper/15 dark:bg-ink",
									value: dest,
									onChange: (e) => setDest(Number(e.target.value)),
									children: CCTP_CHAINS.filter((c) => !isArc(c.domain)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.domain,
										children: c.name
									}, c.domain))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: raw,
								onChange: (e) => setRaw(e.target.value.replace(/[^0-9.]/g, "")),
								className: "h-10 w-28 rounded-xl border border-ink/10 bg-paper px-3 font-mono dark:border-paper/15 dark:bg-ink"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
								variant: "secondary",
								disabled: parsed <= 0n,
								onClick: () => {
									if (bridgeOut(dest, parsed)) setRaw("");
								},
								children: "Burn on Arc"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-medium",
				children: "Holdings"
			}),
			positions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					"Empty. Buy on ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app",
						children: "Discover"
					}),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: positions.map(({ launch, amount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app/t/$id",
					params: { id: launch.id },
					className: "flex min-h-14 items-center gap-3 rounded-2xl border border-ink/8 px-3 dark:border-paper/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
							symbol: launch.symbol,
							hue: launch.hue,
							size: 32
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: launch.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block font-mono text-[11px] text-muted",
								children: [
									formatPriceWad(priceOf(launch)),
									" · ",
									launch.status === "graduated" ? "Book" : "Curve",
									" · Arc"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular",
							children: formatToken(amount)
						})
					]
				}) }, launch.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-medium",
				children: "Watchlist"
			}),
			watched.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Star a market on its page."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: watched.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/t/$id",
					params: { id: l.id },
					className: "text-teal-2",
					children: l.symbol
				}) }, l.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				children: DEMO_USER
			})
		]
	});
}
//#endregion
export { Me as component };
