import { o as __toESM } from "./_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime, v as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as Route } from "./_ssr/router-DhTF1r14.mjs";
import { n as SignedIn, r as SignedOut, t as SashShell } from "./_ssr/shell-BPQyml0Y.mjs";
import { _ as submitProof, g as runAiProofReport } from "./_ssr/server-Dm7hmQ9Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_deal-DtMmmH_l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProofUploadPage() {
	const { deal } = Route.useParams();
	const nav = useNavigate();
	const [wideUrl, setWideUrl] = (0, import_react.useState)("/art/proof.jpg");
	const [closeupUrl, setCloseupUrl] = (0, import_react.useState)("/art/sash-crop.jpg");
	const [recapUrl, setRecapUrl] = (0, import_react.useState)("/art/banner.jpg");
	const [recapPostUrl, setRecapPostUrl] = (0, import_react.useState)("https://x.com/buysashdot/status/proof");
	const [notes, setNotes] = (0, import_react.useState)("Wide venue + close-up mark + recap post");
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [hash, setHash] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit() {
		setBusy(true);
		setMsg(null);
		try {
			const res = await submitProof({ data: {
				dealId: deal,
				wideUrl,
				closeupUrl,
				recapUrl,
				recapPostUrl,
				notes
			} });
			setHash(res.contentHash);
			await runAiProofReport({ data: { dealId: deal } });
			setMsg("Proof uploaded + AI attestation drafted. Challenge window opened.");
			nav({
				to: "/p/$deal",
				params: { deal }
			});
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Upload failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SashShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "text-sash",
				children: "Sign in"
			}),
			" ",
			"to upload proof."
		]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl space-y-4 px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: "Proof pack"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Wide shot at the venue. Close-up of the mark. One public recap post. Hash must match the public proof page."
			}),
			[
				[
					"Wide URL",
					wideUrl,
					setWideUrl
				],
				[
					"Close-up URL",
					closeupUrl,
					setCloseupUrl
				],
				[
					"Recap media URL",
					recapUrl,
					setRecapUrl
				],
				[
					"Recap post URL",
					recapPostUrl,
					setRecapPostUrl
				]
			].map(([label, val, set]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full min-h-11 rounded-xl border border-ink/10 px-3",
					value: val,
					onChange: (e) => set(e.target.value)
				})]
			}, label)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "min-h-20 w-full rounded-xl border border-ink/10 px-3 py-2",
					value: notes,
					onChange: (e) => setNotes(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy,
				onClick: onSubmit,
				className: "min-h-12 w-full rounded-2xl bg-sash font-semibold text-white disabled:opacity-60",
				children: busy ? "Submitting…" : "Submit proof + attest"
			}),
			hash ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "break-all font-mono text-xs text-muted",
				children: ["hash ", hash]
			}) : null,
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-sash-2",
				children: msg
			}) : null
		]
	}) })] });
}
//#endregion
export { ProofUploadPage as component };
