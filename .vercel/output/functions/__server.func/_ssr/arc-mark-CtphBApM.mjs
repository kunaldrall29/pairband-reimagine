import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as cn } from "./router-DnRFdBgV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/arc-mark-CtphBApM.js
var import_jsx_runtime = require_jsx_runtime();
/** Circle USDC mark. Official blue; keep size ≥ 16. */
function UsdcMark({ size = 20, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 32 32",
		"aria-hidden": true,
		className: cn("shrink-0", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "16",
			cy: "16",
			r: "16",
			fill: "#2775CA"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#fff",
			d: "M20.55 18.72c0-1.72-1.05-2.78-3.18-3.12v-3.46c1.18.14 1.96.7 2.22 1.68h1.92c-.38-1.84-1.86-2.98-4.14-3.2V9.2h-1.5v1.4c-2.62.2-4.28 1.62-4.28 3.66 0 1.74 1.08 2.82 3.28 3.16v3.52c-1.36-.16-2.28-.78-2.62-1.9h-1.98c.48 2.14 2.16 3.38 4.6 3.58v1.42h1.5v-1.4c2.7-.2 4.38-1.66 4.38-3.72zm-6.36-4.78c0-.84.62-1.36 1.76-1.48v2.98c-1.12-.18-1.76-.7-1.76-1.5zm4.62 4.86c0 .9-.64 1.44-1.86 1.56v-3.16c1.28.18 1.86.74 1.86 1.6z"
		})]
	});
}
/** Arc gateway mark. Silver on dark, ink on paper. */
function ArcMark({ size = 20, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 32 32",
		"aria-hidden": true,
		className: cn("shrink-0", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M5.2 25.8C5.2 14.4 14.2 6.6 26.2 6.6c.7 0 1.4.04 2.1.12v5.05c-.7-.12-1.4-.18-2.1-.18-8.1 0-13.7 5.1-13.7 13.1 0 .7.04 1.4.12 2.1H5.4c-.14-.7-.2-1.4-.2-2.1z"
		})
	});
}
//#endregion
export { UsdcMark as n, ArcMark as t };
