import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as statusChip } from "./store-BwIaYuXO.mjs";
import { h as cn } from "./router-DYi0iHDD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-chip-Do3CAv8s.js
var import_jsx_runtime = require_jsx_runtime();
var TONE = {
	curve: "bg-amber/20 text-amber-2 dark:bg-amber/25 dark:text-amber",
	book: "bg-teal/15 text-teal-2 dark:bg-teal/20 dark:text-teal",
	locked: "bg-ink/90 text-paper dark:bg-paper/90 dark:text-ink"
};
function StatusChip({ status, className, compact }) {
	const chip = statusChip(status === "graduated" ? "stage_b" : status === "stage_a" || status === "stage_b" || status === "curve" ? status : "curve");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full font-mono uppercase tracking-wide", compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]", TONE[chip.tone], className),
		children: chip.label
	});
}
//#endregion
export { StatusChip as t };
