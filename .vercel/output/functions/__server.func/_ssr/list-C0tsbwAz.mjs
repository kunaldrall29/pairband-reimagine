import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Route$8 } from "./router-DhTF1r14.mjs";
import { o as useCurrentUserState, t as SashShell } from "./shell-BPQyml0Y.mjs";
import { a as getDraftByToken, p as publishDraft } from "./server-Dm7hmQ9Z.mjs";
import { i as truncateAddr } from "./ids-C0GLR5Pk.mjs";
import { t as connectPhantom } from "./phantom-DHsMjiMx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/list-C0tsbwAz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ListPublishPage() {
	const { draft: token } = Route$8.useSearch();
	const { user, isPending } = useCurrentUserState();
	const nav = useNavigate();
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [itemType, setItemType] = (0, import_react.useState)("hoodie");
	const [xUserId, setXUserId] = (0, import_react.useState)("");
	const [xHandle, setXHandle] = (0, import_react.useState)("");
	const [wallet, setWallet] = (0, import_react.useState)(null);
	const [authorGate, setAuthorGate] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!token) return;
		getDraftByToken({ data: token }).then((d) => {
			if (!d) {
				setMsg("Draft not found");
				return;
			}
			const ai = d.ai_payload || {};
			setTitle(ai.title || "");
			setDescription(ai.description || d.tweet_text || "");
			setItemType(ai.item_type || "hoodie");
			setXHandle(d.tweet_author_handle || "");
			setAuthorGate(d.tweet_author_id);
		});
	}, [token]);
	async function onPublish() {
		if (!token) {
			setMsg("Missing draft token — import a tweet first");
			return;
		}
		if (!user) {
			nav({ to: "/login" });
			return;
		}
		if (!wallet) {
			setMsg("Connect a Solana wallet before publish");
			return;
		}
		setBusy(true);
		setMsg(null);
		try {
			const res = await publishDraft({ data: {
				token,
				title,
				description,
				itemType,
				xUserId: xUserId || authorGate || void 0,
				xHandle: xHandle || void 0,
				walletPubkey: wallet
			} });
			nav({
				to: "/l/$id",
				params: { id: res.listingId }
			});
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Publish failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl space-y-5 px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: "Publish listing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Same X author as the source tweet must connect. Gate:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "font-mono text-xs",
						children: "draft.tweet.author_id === connected_x_user_id"
					})
				]
			}),
			!token ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-xl bg-paper-2 p-4 text-sm",
				children: [
					"No draft token. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-sash",
						href: "/import",
						children: "Import a tweet"
					}),
					" first."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full min-h-11 rounded-xl border border-ink/10 px-3",
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: ["Description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "min-h-24 w-full rounded-xl border border-ink/10 px-3 py-2",
					value: description,
					onChange: (e) => setDescription(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: ["Item type", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full min-h-11 rounded-xl border border-ink/10 px-3",
					value: itemType,
					onChange: (e) => setItemType(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: ["X handle", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full min-h-11 rounded-xl border border-ink/10 px-3",
					value: xHandle,
					onChange: (e) => setXHandle(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: ["Connected X user id (must match tweet author when set)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full min-h-11 rounded-xl border border-ink/10 px-3 font-mono text-sm",
					value: xUserId,
					placeholder: authorGate || "optional if draft has no author id",
					onChange: (e) => setXUserId(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 w-full rounded-xl border border-ink/10",
				onClick: async () => {
					try {
						setWallet(await connectPhantom());
					} catch (e) {
						setMsg(e instanceof Error ? e.message : "Phantom error");
					}
				},
				children: wallet ? `Wallet ${truncateAddr(wallet)}` : "Connect Phantom (Solana)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy || isPending,
				onClick: onPublish,
				className: "min-h-12 w-full rounded-2xl bg-sash font-semibold text-white disabled:opacity-60",
				children: busy ? "Publishing…" : "Publish to event hub"
			}),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: msg
			}) : null
		]
	}) });
}
//#endregion
export { ListPublishPage as component };
