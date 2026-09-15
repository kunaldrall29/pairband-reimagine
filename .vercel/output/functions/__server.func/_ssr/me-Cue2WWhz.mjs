import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useCurrentUser, i as StatusPill, n as SignedIn, r as SignedOut, t as SashShell } from "./shell-BPQyml0Y.mjs";
import { c as getMyDeals, l as getMyProfile, v as upsertMyProfile } from "./server-Dm7hmQ9Z.mjs";
import { i as truncateAddr } from "./ids-C0GLR5Pk.mjs";
import { t as connectPhantom } from "./phantom-DHsMjiMx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-Cue2WWhz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SashShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: "Your Sash desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "Sign in with X to manage listings and proof."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "mt-6 inline-flex min-h-11 rounded-xl bg-sash px-4 py-3 text-white",
				children: "Sign in"
			})
		]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeInner, {}) })] });
}
function MeInner() {
	const user = useCurrentUser();
	const [wallet, setWallet] = (0, import_react.useState)(null);
	const [deals, setDeals] = (0, import_react.useState)([]);
	const [msg, setMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getMyProfile().then((p) => {
			if (p?.wallet_pubkey) setWallet(p.wallet_pubkey);
		}).catch(() => void 0);
		getMyDeals().then(setDeals).catch((e) => setMsg(e.message));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: "Me"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted",
				children: user?.displayName || user?.primaryEmail || user?.id
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-ink/8 bg-paper-2 p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg",
					children: "Solana wallet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-xl bg-sash px-4 text-white",
					onClick: async () => {
						try {
							const pk = await connectPhantom();
							setWallet(pk);
							await upsertMyProfile({ data: { walletPubkey: pk } });
							setMsg("Wallet saved");
						} catch (e) {
							setMsg(e instanceof Error ? e.message : "Wallet error");
						}
					},
					children: wallet ? truncateAddr(wallet) : "Connect Phantom"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg",
					children: "Deals"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/import",
					className: "text-sm text-sash",
					children: "Import tweet"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: deals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "No deals yet — browse Token2049 slots."
				}) : deals.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink/8 px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/d/$id",
						params: { id: d.id },
						className: "font-medium hover:text-sash",
						children: [
							d.listing_title,
							" · ",
							d.zone
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [Number(d.amount_usdc), " USDC"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: d.status }), ["locked", "proof_submitted"].includes(d.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/me/proof/$deal",
							params: { deal: d.id },
							className: "text-sm text-sash",
							children: "Proof"
						}) : null]
					})]
				}, d.id))
			})] }),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: msg
			}) : null
		]
	});
}
//#endregion
export { MePage as component };
