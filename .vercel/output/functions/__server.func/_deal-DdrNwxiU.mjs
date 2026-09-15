import { o as __toESM } from "./_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as Route$2 } from "./_ssr/router-DhTF1r14.mjs";
import { i as StatusPill, t as SashShell } from "./_ssr/shell-BPQyml0Y.mjs";
import { i as getDeal } from "./_ssr/server-Dm7hmQ9Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_deal-DdrNwxiU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicProofPage() {
	const { deal: dealId } = Route$2.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getDeal({ data: dealId }).then(setData).catch((e) => setErr(e.message));
	}, [dealId]);
	const proof = data?.proofs[0];
	const report = data?.reports[0];
	const attestation = data?.deal.attestation;
	const hashMatch = proof?.content_hash && (data?.deal.proof_hash === proof.content_hash || attestation?.proof_hash === proof.content_hash);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.18em] text-sash",
					children: "Public proof"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl",
					children: data?.listing?.title || "Deal proof"
				}),
				data?.deal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: data.deal.status }) : null
			] }),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-danger",
				children: err
			}) : null,
			!data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "Loading…"
			}) : null,
			proof ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					proof.wide_url,
					proof.closeup_url,
					proof.recap_url
				].filter(Boolean).map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					className: "aspect-square rounded-2xl object-cover"
				}, src))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No proof uploaded yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-ink/8 bg-paper-2 p-5 space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Content hash:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "break-all font-mono text-xs",
							children: proof?.content_hash || "—"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Deal proof_hash:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "break-all font-mono text-xs",
							children: data?.deal.proof_hash || "—"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: hashMatch ? "text-ok" : "text-muted",
						children: hashMatch ? "Public page agrees with hash ✓" : "Hash pending or mismatched"
					}),
					proof?.recap_post_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: proof.recap_post_url,
						className: "text-sash hover:underline",
						target: "_blank",
						rel: "noreferrer",
						children: "Recap post"
					}) : null,
					report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-auto rounded-xl bg-ink p-3 text-xs text-paper",
						children: JSON.stringify(report.report, null, 2)
					}) : null,
					attestation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"Attested ",
							attestation.signed_at,
							" · pass=",
							String(attestation.report?.pass)
						]
					}) : null,
					data?.deal.challenge_deadline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: ["Challenge deadline ", data.deal.challenge_deadline]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/d/$id",
				params: { id: dealId },
				className: "text-sash hover:underline",
				children: "Open deal"
			})
		]
	}) });
}
//#endregion
export { PublicProofPage as component };
