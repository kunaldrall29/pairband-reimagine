import { o as __toESM } from "./_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as Route$5 } from "./_ssr/router-DhTF1r14.mjs";
import { i as StatusPill, o as useCurrentUserState, t as SashShell } from "./_ssr/shell-BPQyml0Y.mjs";
import { f as lockDeal, g as runAiProofReport, h as releaseDeal, i as getDeal, m as refundDeal, n as challengeDeal } from "./_ssr/server-Dm7hmQ9Z.mjs";
import { i as truncateAddr } from "./_ssr/ids-C0GLR5Pk.mjs";
import { n as getPhantomProvider, t as connectPhantom } from "./_ssr/phantom-DHsMjiMx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CmxKBzkz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DealPage() {
	const { id } = Route$5.useParams();
	const { user } = useCurrentUserState();
	const [data, setData] = (0, import_react.useState)(null);
	const [lockTx, setLockTx] = (0, import_react.useState)("");
	const [wallet, setWallet] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const reload = (0, import_react.useCallback)(() => {
		getDeal({ data: id }).then(setData).catch((e) => setMsg(e.message));
	}, [id]);
	(0, import_react.useEffect)(() => {
		reload();
		const p = getPhantomProvider();
		if (p?.publicKey) setWallet(p.publicKey.toString());
	}, [reload]);
	async function onConnect() {
		try {
			const pk = await connectPhantom();
			setWallet(pk);
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Wallet error");
		}
	}
	async function onLock() {
		if (!user) {
			setMsg("Sign in first");
			return;
		}
		setBusy(true);
		setMsg(null);
		try {
			await lockDeal({ data: {
				dealId: id,
				lockTx: lockTx || `SIM_LOCK_${id}_${Date.now()}`,
				fromPubkey: wallet ?? void 0
			} });
			setMsg(lockTx ? "Locked with provided tx signature." : "Locked with simulated treasury ledger entry (set real USDC tx when treasury is live).");
			reload();
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Lock failed");
		} finally {
			setBusy(false);
		}
	}
	if (!data?.deal) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-8 text-muted",
		children: msg || "Loading deal…"
	}) });
	const { deal, listing, slot, ledger, treasury, usdcMint } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.18em] text-sash",
					children: "Deal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl",
					children: listing?.title || deal.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-muted",
					children: [
						slot?.zone,
						" · ",
						Number(deal.amount_usdc),
						" USDC"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: deal.status })
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-ink/8 bg-paper-2 p-5 space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Escrow: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: deal.escrow_mode
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Treasury: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: truncateAddr(treasury, 6)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["USDC mint: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: truncateAddr(usdcMint, 6)
					})] }),
					deal.lock_tx ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Lock tx: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono break-all",
						children: deal.lock_tx
					})] }) : null,
					deal.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: deal.logo_url,
						alt: "Logo",
						className: "mt-2 h-16 w-16 rounded-lg object-cover"
					}) : null
				]
			}),
			deal.status === "pending_payment" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-2xl border border-sash/30 bg-sash/5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Lock USDC before print"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Transfer USDC to the treasury, then paste the signature. Without a configured treasury key, you can simulate the ledger lock for demo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onConnect,
						className: "min-h-11 rounded-xl border border-ink/10 bg-paper px-4",
						children: wallet ? `Phantom ${truncateAddr(wallet)}` : "Connect Phantom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full min-h-11 rounded-xl border border-ink/10 bg-paper px-3 font-mono text-sm",
						placeholder: "Solana tx signature",
						value: lockTx,
						onChange: (e) => setLockTx(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: onLock,
						className: "min-h-11 w-full rounded-xl bg-sash font-medium text-white hover:bg-sash-2 disabled:opacity-60",
						children: "Confirm lock"
					})
				]
			}) : null,
			[
				"locked",
				"proof_submitted",
				"attested",
				"challenged"
			].includes(deal.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/me/proof/$deal",
						params: { deal: deal.id },
						className: "min-h-11 rounded-xl bg-ink px-4 py-3 text-paper",
						children: "Upload proof"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/p/$deal",
						params: { deal: deal.id },
						className: "min-h-11 rounded-xl border border-ink/10 px-4 py-3",
						children: "Public proof page"
					}),
					deal.status === "proof_submitted" || deal.status === "locked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-xl border border-ink/10 px-4",
						onClick: async () => {
							try {
								await runAiProofReport({ data: { dealId: deal.id } });
								reload();
							} catch (e) {
								setMsg(e instanceof Error ? e.message : "Report failed");
							}
						},
						children: "Run AI attestation"
					}) : null,
					deal.status === "attested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-xl border border-danger/40 px-4 text-danger",
						onClick: async () => {
							try {
								await challengeDeal({ data: {
									dealId: deal.id,
									reason: "Proof does not match slot"
								} });
								reload();
							} catch (e) {
								setMsg(e instanceof Error ? e.message : "Challenge failed");
							}
						},
						children: "Challenge"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-xl bg-ok px-4 text-white",
						onClick: async () => {
							try {
								await releaseDeal({ data: {
									dealId: deal.id,
									force: true
								} });
								reload();
							} catch (e) {
								setMsg(e instanceof Error ? e.message : "Release failed");
							}
						},
						children: "Release (skip wait)"
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-xl border border-ink/10 px-4",
						onClick: async () => {
							try {
								await refundDeal({ data: {
									dealId: deal.id,
									reason: "Buyer/seller refund"
								} });
								reload();
							} catch (e) {
								setMsg(e instanceof Error ? e.message : "Refund failed");
							}
						},
						children: "Refund path"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg",
				children: "Ledger"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2 text-sm",
				children: ledger.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-paper-2 px-3 py-2 font-mono text-xs",
					children: [
						e.kind,
						" · ",
						Number(e.amount_usdc),
						" · ",
						e.tx_sig || "—"
					]
				}, e.id))
			})] }),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-sash-2",
				children: msg
			}) : null
		]
	}) });
}
//#endregion
export { DealPage as component };
