import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as StatusPill, n as SignedIn, r as SignedOut, t as SashShell } from "./shell-BPQyml0Y.mjs";
import { h as releaseDeal, m as refundDeal, t as adminOverview } from "./server-Dm7hmQ9Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin--95rEA4T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	function reload() {
		adminOverview().then(setData).catch((e) => setErr(e.message));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SashShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "text-sash",
				children: "Sign in"
			}),
			" ",
			"for admin desk."
		]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: "Admin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: data?.note
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-danger",
				children: err
			}) : null,
			data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: Object.entries(data.counts || {}).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-paper-2 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-wider text-muted",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-display",
							children: v
						})]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-muted",
					children: [
						"Treasury ",
						data.treasury,
						" · USDC ",
						data.usdcMint,
						" · ",
						data.escrowMode
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg",
					children: "Recent deals"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: data.recent.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink/8 px-3 py-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/d/$id",
								params: { id: d.id },
								className: "font-mono text-xs",
								children: d.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: d.status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-lg border border-ink/10 px-2 py-1 text-xs",
									onClick: async () => {
										await releaseDeal({ data: {
											dealId: d.id,
											force: true
										} });
										reload();
									},
									children: "Force release"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-lg border border-ink/10 px-2 py-1 text-xs",
									onClick: async () => {
										await refundDeal({ data: {
											dealId: d.id,
											reason: "Admin refund"
										} });
										reload();
									},
									children: "Refund"
								})]
							})
						]
					}, d.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg",
					children: "Ledger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 font-mono text-[11px]",
					children: data.ledger.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "truncate rounded bg-paper-2 px-2 py-1",
						children: [
							e.kind,
							" ",
							Number(e.amount_usdc),
							" ",
							e.tx_sig
						]
					}, e.id))
				})
			] }) : null
		]
	}) })] });
}
//#endregion
export { AdminPage as component };
