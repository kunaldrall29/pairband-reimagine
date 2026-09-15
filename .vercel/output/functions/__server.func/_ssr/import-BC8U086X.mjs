import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SASH } from "./constants-B2y20_qc.mjs";
import { t as SashShell } from "./shell-BPQyml0Y.mjs";
import { u as importTweetDraft } from "./server-Dm7hmQ9Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-BC8U086X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImportPage() {
	const nav = useNavigate();
	const [tweetUrl, setTweetUrl] = (0, import_react.useState)("https://x.com/sgfloorwalker/status/1234567890");
	const [tweetText, setTweetText] = (0, import_react.useState)("Token2049 Singapore — black hoodie on the floor + two side events. Chest and sleeve open for logos. host this @buysashdot");
	const [eventSlug, setEventSlug] = (0, import_react.useState)("token2049");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	async function onImport() {
		setBusy(true);
		setErr(null);
		try {
			const res = await importTweetDraft({ data: {
				tweetUrl,
				tweetText,
				eventSlug
			} });
			setResult(res);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Import failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl space-y-6 px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.18em] text-sash",
					children: "Tweet → funded listing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl",
					children: "Import an X post"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Paste a status URL. AI drafts the listing. Bot reply skips when X write is not configured — you still get a draft link."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tweet URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full min-h-11 rounded-xl border border-ink/10 bg-paper px-3",
					value: tweetUrl,
					onChange: (e) => setTweetUrl(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tweet text (paste if API fetch unavailable)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "min-h-28 w-full rounded-xl border border-ink/10 bg-paper px-3 py-2",
					value: tweetText,
					onChange: (e) => setTweetText(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Event" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "w-full min-h-11 rounded-xl border border-ink/10 bg-paper px-3",
					value: eventSlug,
					onChange: (e) => setEventSlug(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "token2049",
						children: "Token2049 Singapore"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "breakpoint",
						children: "Breakpoint"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy,
				onClick: onImport,
				className: "min-h-12 w-full rounded-2xl bg-sash font-semibold text-white hover:bg-sash-2 disabled:opacity-60",
				children: busy ? "Drafting…" : "Draft with AI"
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: err
			}) : null,
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-2xl border border-ink/8 bg-paper-2 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Draft ready"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: result.botNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-auto rounded-xl bg-ink p-3 text-xs text-paper",
						children: JSON.stringify(result.ai, null, 2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"Reply template we would send on ",
							SASH.handle,
							":",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: ["Drafted this on Sash. Review + publish: buysash.fun", result.link]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 w-full rounded-xl bg-ink text-paper",
						onClick: () => nav({
							to: "/list",
							search: { draft: result.token }
						}),
						children: "Review & publish"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/list",
						search: { draft: result.token },
						className: "block text-center text-sash",
						children: "Open draft link"
					})
				]
			}) : null
		]
	}) });
}
//#endregion
export { ImportPage as component };
