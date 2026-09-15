import { o as __toESM } from "./_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime, v as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as Route$3 } from "./_ssr/router-DhTF1r14.mjs";
import { i as StatusPill, o as useCurrentUserState, t as SashShell } from "./_ssr/shell-BPQyml0Y.mjs";
import { r as createDeal, s as getListing } from "./_ssr/server-Dm7hmQ9Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-QNQUhSvn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ListingPage() {
	const { id } = Route$3.useParams();
	const nav = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const [listing, setListing] = (0, import_react.useState)(null);
	const [logoUrl, setLogoUrl] = (0, import_react.useState)("/art/sticker.jpg");
	const [bidAmount, setBidAmount] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getListing({ data: id }).then(setListing).catch((e) => setMsg(e.message));
	}, [id]);
	async function buy(slotId, auction) {
		if (isPending) return;
		if (!user) {
			nav({ to: "/login" });
			return;
		}
		setBusy(slotId);
		setMsg(null);
		try {
			const res = await createDeal({ data: {
				listingId: id,
				slotId,
				logoUrl,
				bidAmount: auction && bidAmount ? Number(bidAmount) : void 0
			} });
			nav({
				to: "/d/$id",
				params: { id: res.dealId }
			});
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(null);
		}
	}
	if (!listing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-8 text-muted",
		children: msg || "Loading listing…"
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: listing.cover_image || "/art/hoodie.jpg",
			alt: "",
			className: "w-full rounded-3xl object-cover shadow-soft"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.18em] text-sash",
						children: [
							listing.event_name || "Event",
							" · @",
							listing.seller_x_handle
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-3xl sm:text-4xl",
						children: listing.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: listing.description
					}),
					listing.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: "featured" })
					}) : null,
					listing.referral_code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-muted",
						children: ["Ref ", listing.referral_code]
					}) : null
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Logo URL (buyer mark)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full min-h-11 rounded-xl border border-ink/10 bg-paper px-3",
						value: logoUrl,
						onChange: (e) => setLogoUrl(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.16em] text-muted",
						children: "Pick a zone · print after lock"
					}), listing.slots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 rounded-2xl border border-ink/8 bg-paper-2 p-4 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: s.zone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-sm text-muted",
								children: [
									Number(s.price_usdc),
									" USDC · ",
									s.pricing_mode
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: s.status })
							})
						] }), s.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:items-end",
							children: [s.pricing_mode === "auction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								placeholder: "Bid USDC",
								className: "min-h-11 w-full rounded-xl border border-ink/10 bg-paper px-3 sm:w-36",
								value: bidAmount,
								onChange: (e) => setBidAmount(e.target.value)
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy === s.id,
								onClick: () => buy(s.id, s.pricing_mode === "auction"),
								className: "min-h-11 rounded-xl bg-sash px-4 font-medium text-white hover:bg-sash-2 disabled:opacity-60",
								children: busy === s.id ? "…" : s.pricing_mode === "auction" ? "Fund bid" : "Buy & lock"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/d/$id",
							params: { id: "deal_demo_locked" },
							className: "text-sm text-sash hover:underline",
							children: "View locked deal"
						})]
					}, s.id))]
				}),
				msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: msg
				}) : null
			]
		})]
	}) });
}
//#endregion
export { ListingPage as component };
