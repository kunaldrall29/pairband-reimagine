import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SASH } from "./constants-B2y20_qc.mjs";
import { t as GROK_PROVIDERS } from "./server-BI5z7mix.mjs";
import { r as signIn } from "./client-B40BzJxt.mjs";
import { t as SashShell } from "./shell-BPQyml0Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Cwo0d_jB.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto grid min-h-[70dvh] max-w-md place-items-center px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full space-y-5 rise",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/art/logo.jpg",
					alt: "",
					className: "h-12 w-12 rounded-xl object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-3xl",
					children: ["Sign in to ", SASH.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Connect with X to publish listings from your tweets. Then attach a Solana wallet for USDC escrow."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(p.providerId, { callbackURL: "/me" }),
						className: "w-full min-h-12 rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-left font-medium hover:bg-paper-2",
						children: ["Continue with ", p.label]
					}, p.providerId))
				})
			]
		})
	}) });
}
//#endregion
export { Login as component };
