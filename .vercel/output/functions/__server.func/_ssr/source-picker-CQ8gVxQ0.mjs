import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as useLaunchpad, C as sourceBalance, i as chainByDomain, l as isArc, t as CCTP_CHAINS } from "./store-BwIaYuXO.mjs";
import { c as formatUsdc, h as cn } from "./router-DYi0iHDD.mjs";
import { n as UsdcMark, t as ArcMark } from "./arc-mark-CtphBApM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/source-picker-CQ8gVxQ0.js
var import_jsx_runtime = require_jsx_runtime();
function SourcePicker({ className }) {
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const account = useLaunchpad((s) => s.account);
	const sourceDomain = useLaunchpad((s) => s.sourceDomain);
	const setSource = useLaunchpad((s) => s.setSourceDomain);
	const src = chainByDomain(sourceDomain);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-wrap gap-1", className),
		children: [CCTP_CHAINS.map((c) => {
			const bal = sourceBalance(engine, account, c.domain);
			const on = sourceDomain === c.domain;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setSource(c.domain),
				className: cn("inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 font-mono text-[10px] tracking-wide uppercase", on ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "bg-ink/5 text-muted dark:bg-paper/10"),
				children: [
					isArc(c.domain) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 10 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 10 }),
					c.short,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular",
						children: formatUsdc(bal, 0)
					})
				]
			}, c.domain);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "flex w-full items-center gap-1 pt-1 font-mono text-[10px] text-muted",
			children: isArc(sourceDomain) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 10 }), " Paying on Arc. Settlement is local."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 10 }),
				src?.name,
				" → ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 10 }),
				" Arc domain 26. Book stays on Arc."
			] })
		})]
	});
}
//#endregion
export { SourcePicker as t };
