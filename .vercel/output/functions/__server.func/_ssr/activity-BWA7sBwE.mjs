import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as useLaunchpad } from "./store-DuP6GcAD.mjs";
import { t as Tape } from "./tape-D5UlmEkt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-BWA7sBwE.js
var import_jsx_runtime = require_jsx_runtime();
function Activity() {
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-6 pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
				children: "Tape"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "All prints"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Curve buys, sells, graduations, and Uniswap swaps in this book."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tape, {
					trades: engine.trades,
					engine,
					showMarket: true
				})
			})
		]
	});
}
//#endregion
export { Activity as component };
