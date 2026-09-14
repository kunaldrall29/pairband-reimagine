import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as isArc, i as chainByDomain } from "./store-DuP6GcAD.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as formatUsdc, h as cn, s as formatToken, u as timeAgo, v as shortAddr } from "./router-DnRFdBgV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tape-D5UlmEkt.js
var import_jsx_runtime = require_jsx_runtime();
function Tape({ trades, engine, symbol, showMarket }) {
	if (trades.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-8 text-center text-sm text-muted",
		children: "No prints yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-full overflow-x-auto rounded-[20px] border border-ink/8 dark:border-paper/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[22rem] text-left text-sm sm:min-w-[28rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-ink/5 font-mono text-[11px] text-muted uppercase dark:bg-paper/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					showMarket ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "Market"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "Side"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "USDC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: symbol ?? "Token"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "Who"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "When"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: trades.slice(0, 24).map((t) => {
				const launch = engine.launches.find((l) => l.id === t.launchId);
				t.side === "buy" || t.side;
				t.side === "buy" || t.side === "swap" && t.usdc > 0n && t.tokens;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-ink/5 dark:border-paper/10",
					children: [
						showMarket ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: launch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/t/$id",
								params: { id: launch.id },
								className: "font-medium hover:underline",
								children: launch.symbol
							}) : "—"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: cn("px-3 py-2 capitalize", t.side === "sell" ? "text-danger" : t.side === "fill" || t.side === "buy" || t.side === "swap" ? "text-teal-2" : "text-muted"),
							children: [t.side === "swap" ? "uniswap" : t.side === "fill" ? "book" : t.side, t.sourceDomain && !isArc(t.sourceDomain) ? ` · ${chainByDomain(t.sourceDomain)?.short ?? t.sourceDomain}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-mono tabular",
							children: t.usdc > 0n ? formatUsdc(t.usdc) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-mono tabular",
							children: t.tokens > 0n && t.side !== "create" ? formatToken(t.tokens, 0) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-mono text-xs text-muted",
							children: shortAddr(t.account, 3)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-muted",
							suppressHydrationWarning: true,
							children: timeAgo(t.at)
						})
					]
				}, t.id);
			}) })]
		})
	});
}
//#endregion
export { Tape as t };
