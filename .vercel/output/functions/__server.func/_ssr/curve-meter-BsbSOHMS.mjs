import { y as cn } from "./format-BlK3yrc5.mjs";
import { c as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/curve-meter-BsbSOHMS.js
var import_jsx_runtime = require_jsx_runtime();
function CurveMeter({ progress, label, className }) {
	const p = Math.max(0, Math.min(1, progress));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("w-full", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between font-mono text-[11px] text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label ?? "Curve" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round(p * 100), "%"] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-teal transition-[width] duration-300 ease-out",
				style: { width: `${p * 100}%` }
			})
		})]
	});
}
//#endregion
export { CurveMeter as t };
