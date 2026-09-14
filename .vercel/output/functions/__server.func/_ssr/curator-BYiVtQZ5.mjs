import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as BookOpen, S as Bot, l as Shield, s as Sparkles } from "../_libs/lucide-react.mjs";
import { f as GlassPanel, g as formatUsd, v as shortAddr } from "./router-DYi0iHDD.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-C1bmYj8R.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as suggestedBandLabel, i as VAULT_DEMO_ID, n as DEMO_AGENT, o as useVault, r as DEMO_CURATOR, t as AGENT_FEE_USDC_LABEL } from "./vault-store-BVPX-fFK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/curator-BYiVtQZ5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VaultAgentPage() {
	const engine = useVault((s) => s.engine);
	const version = useVault((s) => s.version);
	const role = useVault((s) => s.role);
	const account = useVault((s) => s.account);
	const lastError = useVault((s) => s.lastError);
	const lastHash = useVault((s) => s.lastHash);
	const setRole = useVault((s) => s.setRole);
	const doDeposit = useVault((s) => s.deposit);
	const doWithdraw = useVault((s) => s.withdraw);
	const proposeSuggested = useVault((s) => s.proposeSuggested);
	const doReject = useVault((s) => s.reject);
	const doExecute = useVault((s) => s.execute);
	const reset = useVault((s) => s.reset);
	const [amount0, setAmount0] = (0, import_react.useState)("50");
	const [amount1, setAmount1] = (0, import_react.useState)("50");
	const shares = engine.shares.get(account) ?? 0n;
	const wallet = engine.wallets.get(account) ?? {
		t0: 0n,
		t1: 0n
	};
	const suggestion = (0, import_react.useMemo)(() => suggestedBandLabel(engine), [engine, version]);
	const desk = ARC_TESTNET_DEPLOYMENT?.agentDesk;
	const explorer = ARC_TESTNET_DEPLOYMENT?.explorer ?? "https://testnet.arcscan.app";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.2em] text-teal",
						children: "Vault agent · practice desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl md:text-4xl",
						children: "Propose. Delay. Execute."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-xl text-sm text-muted",
						children: [
							"The vault agent posts a new liquidity band. Curators execute after the delay. Agent proposals cost",
							" ",
							AGENT_FEE_USDC_LABEL,
							" USDC on Arc — same fee as the on-chain desk."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/docs/vault-agent",
						className: "inline-flex min-h-10 items-center gap-2 rounded-2xl border border-ink/10 px-3 text-sm hover:bg-ink/5 dark:border-paper/15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 16 }), " How to use"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/create",
						className: "inline-flex min-h-10 items-center gap-2 rounded-2xl border border-ink/10 px-3 text-sm hover:bg-ink/5 dark:border-paper/15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 }), " AI draft"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "mt-6 flex flex-wrap items-center gap-3 p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, {
					size: 18,
					className: "text-teal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"On-chain desk",
					" ",
					desk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "font-mono text-teal underline underline-offset-2",
						href: `${explorer}/address/${desk}`,
						target: "_blank",
						rel: "noreferrer",
						children: shortAddr(desk, 6)
					}) : "pending",
					" · ",
					"fee ",
					AGENT_FEE_USDC_LABEL,
					" USDC · seed vault #",
					ARC_TESTNET_DEPLOYMENT?.agentDeskSeedVaultId ?? 0
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [[
					["agent", "Act as agent"],
					["curator", "Act as curator"],
					["user", "Act as LP"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
					variant: role === id ? "primary" : "secondary",
					onClick: () => setRole(id),
					children: label
				}, id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
					variant: "ghost",
					onClick: () => reset(),
					children: "Reset practice desk"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-muted",
				children: [
					"Acting as ",
					role,
					" · ",
					shortAddr(account, 6),
					role === "agent" ? ` (${shortAddr(DEMO_AGENT, 4)})` : "",
					role === "curator" ? ` (${shortAddr(DEMO_CURATOR, 4)})` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-wider text-muted",
								children: "Practice band"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-2xl",
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
								children: [
									"spot tick ",
									engine.tick,
									" · fee ",
									engine.fee / 1e4,
									"%"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-wider text-muted",
								children: "Your wallet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-lg",
								children: [formatUsd(wallet.t0), " USDC"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-lg",
								children: [formatUsd(wallet.t1), " USD1"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted",
								children: ["shares ", shares.toString()]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-wider text-muted",
								children: "Policy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: [
									"Agent ",
									shortAddr(engine.policy.agent, 4),
									" · Curator ",
									shortAddr(engine.policy.curator, 4)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									"delay ",
									engine.policy.proposalDelay,
									"s · maxWidth ",
									engine.policy.maxWidth,
									" · maxShift",
									" ",
									engine.policy.maxShift
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, {
								size: 18,
								className: "text-teal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Agent propose"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: suggestion
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
							className: "mt-4 w-full",
							onClick: () => {
								proposeSuggested();
								const err = useVault.getState().lastError;
								if (err) toast.error(err);
								else toast.success(`Proposal posted · agent fee ${AGENT_FEE_USDC_LABEL} USDC`);
							},
							disabled: role !== "agent" && role !== "curator",
							children: ["Propose suggested band · ", AGENT_FEE_USDC_LABEL]
						}),
						engine.proposal?.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-2xl bg-teal/10 p-3 text-sm",
							children: [
								"Active proposal [",
								engine.proposal.tickLower,
								", ",
								engine.proposal.tickUpper,
								") by",
								" ",
								shortAddr(engine.proposal.proposer ?? engine.proposal.postedBy ?? account, 4)
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted",
							children: "No active proposal."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
								size: 18,
								className: "text-teal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Curator execute"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "After the delay, only the curator can execute or reject. Execution moves the live band."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
								onClick: () => {
									doExecute();
									const err = useVault.getState().lastError;
									if (err) toast.error(err);
									else toast.success("Band executed — vault rebalanced");
								},
								disabled: role !== "curator" || !engine.proposal?.active,
								children: "Execute rebalance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
								variant: "secondary",
								onClick: () => {
									doReject();
									const err = useVault.getState().lastError;
									if (err) toast.error(err);
									else toast.message("Proposal rejected");
								},
								disabled: role !== "curator" || !engine.proposal?.active,
								children: "Reject"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "mt-6 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "LP deposit / withdraw"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["USDC", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: amount0,
								onChange: (e) => setAmount0(e.target.value),
								className: "mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-3 font-mono dark:border-paper/15 dark:bg-ink-2"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["USD1", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: amount1,
								onChange: (e) => setAmount1(e.target.value),
								className: "mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-3 font-mono dark:border-paper/15 dark:bg-ink-2"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
								onClick: () => {
									doDeposit(amount0, amount1);
									const err = useVault.getState().lastError;
									if (err) toast.error(err);
									else toast.success("Deposited");
								},
								children: "Deposit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
								variant: "secondary",
								onClick: () => {
									doWithdraw(shares.toString());
									const err = useVault.getState().lastError;
									if (err) toast.error(err);
									else toast.success("Withdrew");
								},
								disabled: shares === 0n,
								children: "Withdraw all shares"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/p/$chainId/$vault",
								params: {
									chainId: String(engine.chainId),
									vault: VAULT_DEMO_ID
								},
								className: "inline-flex min-h-11 items-center text-sm text-teal underline underline-offset-4",
								children: "Open vault detail →"
							})
						]
					})
				]
			}),
			(lastError || lastHash) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-mono text-xs text-muted",
				children: lastError ? `Error: ${lastError}` : `Last tx ${lastHash?.slice(0, 18)}…`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
				className: "mt-6 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Activity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 max-h-64 space-y-2 overflow-y-auto text-sm",
					children: engine.activity.slice(0, 12).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3 border-b border-ink/5 pb-2 dark:border-paper/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-teal",
								children: a.kind
							}),
							" · ",
							a.detail
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 font-mono text-xs text-muted",
							children: shortAddr(a.hash, 4)
						})]
					}, a.id))
				})]
			})
		]
	});
}
//#endregion
export { VaultAgentPage as component };
