import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as GlassPanel, g as formatUsd, n as Route, v as shortAddr } from "./router-DYi0iHDD.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-C1bmYj8R.mjs";
import { o as useVault, t as AGENT_FEE_USDC_LABEL } from "./vault-store-BVPX-fFK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._chainId._vault-Dcuh4Bff.js
var import_jsx_runtime = require_jsx_runtime();
function VaultDetailPage() {
	const { chainId, vault } = Route.useParams();
	const engine = useVault((s) => s.engine);
	useVault((s) => s.version);
	const desk = ARC_TESTNET_DEPLOYMENT?.agentDesk;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-6 pb-28 md:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[11px] uppercase tracking-[0.2em] text-teal",
				children: ["Vault · ", chainId]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl",
				children: engine.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-sm text-muted",
				children: shortAddr(vault, 8)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-wider text-muted",
							children: "Band"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-mono text-xl",
							children: [
								"[",
								engine.band.tickLower,
								", ",
								engine.band.tickUpper,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: ["tick ", engine.tick]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-wider text-muted",
							children: "Inventory"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm",
							children: [
								"Idle ",
								formatUsd(engine.idle0),
								" USDC · ",
								formatUsd(engine.idle1),
								" USD1"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: ["liq ", engine.totalLiquidity.toString()]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "mt-4 p-5 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Agent ",
					shortAddr(engine.policy.agent, 6),
					" · Curator ",
					shortAddr(engine.policy.curator, 6),
					" · fee",
					" ",
					AGENT_FEE_USDC_LABEL,
					" / propose"
				] }), desk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-xs text-muted",
					children: [
						"Desk ",
						shortAddr(desk, 8),
						" on Arc testnet"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/curator",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, { children: "Open agent desk" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/docs/vault-agent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
						variant: "secondary",
						children: "Vault agent docs"
					})
				})]
			})
		]
	});
}
//#endregion
export { VaultDetailPage as component };
