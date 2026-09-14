import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as GlassPanel, m as Wordmark, v as shortAddr } from "./router-DnRFdBgV.mjs";
import { t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-OCoCqeUz.mjs";
import { t as AGENT_FEE_USDC_LABEL } from "./vault-store-DRZ_J-J6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs.vault-agent-4uRDSyml.js
var import_jsx_runtime = require_jsx_runtime();
function VaultAgentDocs() {
	const desk = ARC_TESTNET_DEPLOYMENT?.agentDesk;
	const explorer = ARC_TESTNET_DEPLOYMENT?.explorer ?? "https://testnet.arcscan.app";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-3xl items-center justify-between px-5 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/docs",
					className: "underline underline-offset-4",
					children: "Docs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/curator",
					className: "underline underline-offset-4",
					children: "Open agent"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto max-w-3xl px-5 pb-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.2em] text-teal",
					children: "Vault agent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-5xl",
					children: "Propose. Delay. Execute."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-muted",
					children: [
						"The vault agent is live on Arc testnet. It posts a new concentrated-liquidity band; the named curator executes after a short delay. Agent proposals cost ",
						AGENT_FEE_USDC_LABEL,
						" USDC — same fee as the on-chain desk."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-10 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "What you can do"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-ink",
										children: "Act as agent"
									}),
									" — propose a suggested band centered on spot (pays ",
									AGENT_FEE_USDC_LABEL,
									" USDC)."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-ink",
									children: "Act as curator"
								}), " — execute after the delay, or reject."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-ink",
									children: "Act as LP"
								}), " — deposit USDC + USD1, then watch the band move."] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/curator",
							className: "mt-4 inline-block text-sm text-teal underline underline-offset-4",
							children: "Open the agent desk →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "How to use"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-3 list-decimal space-y-2 pl-5 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Open the Agent desk and choose ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-ink",
									children: "Act as agent"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Click ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-ink",
									children: "Propose suggested band"
								}),
								". Ticks are computed deterministically — never by the LLM."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Switch to ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-ink",
									children: "Act as curator"
								}),
								". Wait for the proposal delay."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Click ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-ink",
									children: "Execute rebalance"
								}),
								" to move the live band, or Reject to discard."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "As LP, deposit both tokens, then open the vault detail page to inspect inventory." })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Create with AI draft"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "On Launch, describe a token idea and generate a name, symbol, and description. Review the draft, then confirm — nothing launches until you submit. If Grok is configured it drafts with the model; otherwise a local fallback fills the form."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/create",
							className: "mt-4 inline-block text-sm text-teal underline underline-offset-4",
							children: "Create with AI draft →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "On-chain desk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-ink",
									children: "VaultAgentDesk"
								}),
								" on Arc testnet (",
								ARC_TESTNET_DEPLOYMENT?.agentDeskSeedVaultId ?? 0,
								" seed vault). Fee",
								" ",
								AGENT_FEE_USDC_LABEL,
								" USDC per agent proposal."
							]
						}),
						desk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `${explorer}/address/${desk}`,
							target: "_blank",
							rel: "noreferrer",
							className: "mt-3 inline-block font-mono text-sm text-teal underline underline-offset-4",
							children: shortAddr(desk, 8)
						}) : null
					]
				})
			]
		})]
	});
}
//#endregion
export { VaultAgentDocs as component };
