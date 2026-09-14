import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as useLaunchpad, C as sourceBalance, k as usdcBalance, l as isArc, t as CCTP_CHAINS } from "./store-BwIaYuXO.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as parseUnits, c as formatUsdc, f as GlassPanel, i as errorCopy } from "./router-DYi0iHDD.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { n as UsdcMark, t as ArcMark } from "./arc-mark-CtphBApM.mjs";
import { t as SourcePicker } from "./source-picker-CQ8gVxQ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bridge-DJLOVxgf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BridgePage() {
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const account = useLaunchpad((s) => s.account);
	const lastError = useLaunchpad((s) => s.lastError);
	const sourceDomain = useLaunchpad((s) => s.sourceDomain);
	const bridgeOut = useLaunchpad((s) => s.bridgeOut);
	const [mode, setMode] = (0, import_react.useState)("in");
	const defaultDest = CCTP_CHAINS.find((c) => !isArc(c.domain))?.domain ?? 0;
	const [dest, setDest] = (0, import_react.useState)(defaultDest);
	const [raw, setRaw] = (0, import_react.useState)("100");
	const parsed = (0, import_react.useMemo)(() => {
		try {
			return parseUnits(raw || "0", 18);
		} catch {
			return 0n;
		}
	}, [raw]);
	const arcUsdc = usdcBalance(engine, account);
	const sourceUsdc = sourceBalance(engine, account, sourceDomain);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
				children: "CCTP / Gateway"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Pay USDC from any chain"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-lg text-sm leading-relaxed text-muted",
				children: "Only USDC moves cross-chain. Launch tokens never enter a messenger. Inbound burns on the source and mints to the Pairband Settler on Arc (domain 26), then forwards into the market vault in the same transaction."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex rounded-2xl bg-ink/5 p-1 dark:bg-paper/10",
				children: [{
					id: "in",
					label: "Pay in"
				}, {
					id: "out",
					label: "Bridge out"
				}].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(m.id),
					className: `min-h-11 flex-1 rounded-xl text-sm font-medium ${mode === m.id ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"}`,
					children: m.label
				}, m.id))
			}),
			mode === "in" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "mt-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 12 }), " Source → Arc"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Pick a CCTP chain Circle has enabled for Arc domain 26. Missing domains stay hidden — we do not ship a custom bridge."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourcePicker, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-mono text-[11px] text-muted uppercase",
							children: "Source balance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono tabular",
							children: formatUsdc(sourceUsdc)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-mono text-[11px] text-muted uppercase",
							children: "Arc USDC"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono tabular",
							children: formatUsdc(arcUsdc)
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 rounded-2xl border border-ink/8 bg-paper-2 px-4 py-3 text-xs leading-relaxed text-muted dark:border-paper/10 dark:bg-ink-2",
						children: [
							"In the trade ticket, buys with a non-Arc source mint via the Settler hook (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: "BUY_CURVE | BID_BOOK"
							}),
							"). Preview mirrors Fast Transfer settle; production uses the audited settler path."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/trade",
						className: "mt-4 inline-block text-sm text-teal-2 underline underline-offset-4",
						children: "Open trade ticket to buy with source USDC"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "mt-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 12 }), " Arc → source"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Sell on Arc first (curve or book + pool). Then burn Arc USDC to your source domain. No protocol fee on bridge-out — you pay CCTP only."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block font-mono text-[11px] text-muted uppercase",
							children: "Destination"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: dest,
							onChange: (e) => setDest(Number(e.target.value)),
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none dark:border-paper/15 dark:bg-ink",
							children: CCTP_CHAINS.filter((c) => !isArc(c.domain)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: c.domain,
								children: [
									c.name,
									" · domain ",
									c.domain
								]
							}, c.domain))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block font-mono text-[11px] text-muted uppercase",
							children: "Amount (USDC)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: raw,
							onChange: (e) => setRaw(e.target.value.replace(/[^0-9.]/g, "")),
							inputMode: "decimal",
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono text-lg tabular outline-none focus:border-teal dark:border-paper/15 dark:bg-ink"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-muted",
						children: ["Available ", formatUsdc(arcUsdc)]
					}),
					lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-danger",
						children: errorCopy(lastError)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
						className: "mt-4 w-full",
						disabled: parsed <= 0n || parsed > arcUsdc || dest === 26,
						onClick: () => {
							bridgeOut(dest, parsed);
							setRaw("");
						},
						children: ["Bridge out ", parsed > 0n ? formatUsdc(parsed) : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							"Preview uses the local engine. Production path: sell → wallet USDC on Arc →",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: "depositForBurn"
							}),
							" to source domain."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "mt-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.16em] text-muted uppercase",
					children: "Domains in v1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: CCTP_CHAINS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-ink/8 px-3 py-2 text-sm dark:border-paper/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-0.5 block font-mono text-[10px] text-muted",
							children: ["domain ", c.domain]
						})]
					}, c.domain))
				})]
			})
		]
	});
}
//#endregion
export { BridgePage as component };
