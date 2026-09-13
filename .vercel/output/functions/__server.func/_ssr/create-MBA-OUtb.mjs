import { i as __toESM } from "../_runtime.mjs";
import { C as formatToken, E as parseUnits, b as errorCopy, d as GRADUATE_AT, m as TOTAL_SUPPLY, v as WAD, w as formatUsdc } from "./format-BlK3yrc5.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useLaunchpad, c as previewBuy } from "./store-BFkd_wST.mjs";
import { t as ClayButton } from "./clay-button-Bi5H0-iU.mjs";
import { t as TokenGlyph } from "./token-glyph-m-nzutxZ.mjs";
import { r as GlassPanel } from "./router-CJlix3MW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-MBA-OUtb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Create() {
	const navigate = useNavigate();
	const create = useLaunchpad((s) => s.create);
	const lastError = useLaunchpad((s) => s.lastError);
	const [name, setName] = (0, import_react.useState)("");
	const [symbol, setSymbol] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [first, setFirst] = (0, import_react.useState)("0");
	const hue = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
	const firstAmt = (0, import_react.useMemo)(() => {
		try {
			return parseUnits(first || "0", 18);
		} catch {
			return 0n;
		}
	}, [first]);
	const firstQuote = (0, import_react.useMemo)(() => {
		if (firstAmt <= 0n) return null;
		try {
			return previewBuy({
				status: "curve",
				virtualUsdc: 80n * WAD,
				virtualTokens: TOTAL_SUPPLY
			}, firstAmt);
		} catch {
			return null;
		}
	}, [firstAmt]);
	function onSubmit(e) {
		e.preventDefault();
		const id = create(name, symbol, description, firstAmt);
		if (id) navigate({
			to: "/app/t/$id",
			params: { id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
				children: "Launch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Create a token"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: [
					"One billion supply. Bonding curve quoted in USDC on Arc. The buy that fills ",
					formatUsdc(GRADUATE_AT),
					" seeds a Uniswap pair and burns the LP. You keep 0.5% of curve volume."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "flex items-center gap-4 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
							symbol: symbol || "??",
							hue,
							size: 56
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: name || "Token name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-muted",
							children: [(symbol || "TICKER").toUpperCase(), " / USDC"]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-xs font-medium text-muted",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							minLength: 2,
							maxLength: 32,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-xs font-medium text-muted",
							children: "Symbol"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							minLength: 2,
							maxLength: 12,
							value: symbol,
							onChange: (e) => setSymbol(e.target.value.toUpperCase()),
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-xs font-medium text-muted",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							maxLength: 280,
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 3,
							className: "w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-xs font-medium text-muted",
								children: "First buy (USDC, optional)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: first,
								onChange: (e) => setFirst(e.target.value.replace(/[^0-9.]/g, "")),
								inputMode: "decimal",
								className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
							}),
							firstQuote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									"Seeds about ",
									formatToken(firstQuote.tokensOut, 0),
									" tokens onto your wallet."
								]
							}) : null
						]
					}),
					lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: errorCopy(lastError)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
						type: "submit",
						className: "w-full",
						children: "Launch on Arc"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-muted",
						children: "After graduation, swaps use Uniswap constant-product math (0.30%). LP cannot be withdrawn. This preview executes locally until the factory is funded on Arc Testnet."
					})
				]
			})
		]
	});
}
//#endregion
export { Create as component };
