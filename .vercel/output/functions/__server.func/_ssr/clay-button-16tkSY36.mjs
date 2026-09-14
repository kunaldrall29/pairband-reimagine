import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as cn } from "./router-DYi0iHDD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clay-button-16tkSY36.js
var import_jsx_runtime = require_jsx_runtime();
var variants = {
	primary: "bg-ink text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_16px_rgba(11,15,20,0.22)] hover:bg-ink-2 dark:bg-paper dark:text-ink dark:hover:bg-paper-2",
	secondary: "bg-paper text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_18px_rgba(11,15,20,0.12)] border border-ink/8 hover:bg-paper-2 dark:bg-ink-2 dark:text-paper dark:border-paper/15",
	ghost: "bg-transparent text-ink hover:bg-ink/5 border border-ink/10 dark:text-paper dark:border-paper/15 dark:hover:bg-paper/5",
	danger: "bg-danger text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:brightness-95"
};
function ClayButton({ variant = "primary", className, children, type = "button", ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium tracking-tight", "transition-[background,box-shadow,transform] duration-150 ease-out", "active:not-disabled:translate-y-px active:not-disabled:scale-[0.96]", "disabled:cursor-not-allowed disabled:opacity-40", variants[variant], className),
		...rest,
		children
	});
}
//#endregion
export { ClayButton as t };
