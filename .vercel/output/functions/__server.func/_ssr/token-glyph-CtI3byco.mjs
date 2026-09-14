import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as cn } from "./router-DnRFdBgV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/token-glyph-CtI3byco.js
var import_jsx_runtime = require_jsx_runtime();
function TokenGlyph({ symbol, hue, size = 40, imageUrl, className }) {
	if (imageUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: imageUrl,
		alt: "",
		width: size,
		height: size,
		className: cn("shrink-0 rounded-full object-cover", className),
		style: {
			width: size,
			height: size
		}
	});
	const letters = symbol.slice(0, 2);
	const a = `hsl(${hue} 28% 42%)`;
	const b = `hsl(${(hue + 40) % 360} 32% 58%)`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 40 40",
		className: cn("shrink-0 rounded-full", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: `g-${symbol}-${hue}`,
				x1: "0",
				y1: "0",
				x2: "1",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: a
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: b
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "20",
				cy: "20",
				r: "20",
				fill: `url(#g-${symbol}-${hue})`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "20",
				cy: "20",
				r: "19",
				fill: "none",
				stroke: "rgba(244,241,234,0.35)",
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "20",
				y: "21",
				textAnchor: "middle",
				dominantBaseline: "middle",
				fill: "#F4F1EA",
				fontFamily: "IBM Plex Sans, sans-serif",
				fontSize: "13",
				fontWeight: "600",
				children: letters
			})
		]
	});
}
//#endregion
export { TokenGlyph as t };
