import { o as __toESM } from "./_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as Route$4 } from "./_ssr/router-DhTF1r14.mjs";
import { i as StatusPill, t as SashShell } from "./_ssr/shell-BPQyml0Y.mjs";
import { d as listLiveListings, o as getEventBySlug } from "./_ssr/server-Dm7hmQ9Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-CaeZsH2V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ListingCard({ listing }) {
	const open = listing.slots.filter((s) => s.status === "open").length;
	const locked = listing.slots.filter((s) => s.status === "locked").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/l/$id",
		params: { id: listing.id },
		className: "group rise block overflow-hidden rounded-2xl border border-ink/8 bg-paper-2/60 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-paper/10 dark:bg-ink-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-[4/3] overflow-hidden bg-paper-3 dark:bg-ink",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: listing.cover_image || "/art/hoodie.jpg",
				alt: "",
				className: "h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base leading-snug",
						children: listing.title
					}), listing.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: "featured" }) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted dark:text-muted-dark",
					children: [
						"@",
						listing.seller_x_handle,
						" · ",
						listing.item_type
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 pt-1",
					children: listing.slots.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-md bg-paper px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-ink dark:bg-ink dark:text-paper",
						children: [
							s.zone,
							" · ",
							Number(s.price_usdc),
							" · ",
							s.status
						]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pt-1 text-xs text-muted dark:text-muted-dark",
					children: [
						open,
						" open · ",
						locked,
						" locked"
					]
				})
			]
		})]
	});
}
function EventHub() {
	const { slug } = Route$4.useParams();
	const [event, setEvent] = (0, import_react.useState)(null);
	const [listings, setListings] = (0, import_react.useState)([]);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		Promise.all([getEventBySlug({ data: slug }), listLiveListings({ data: { eventSlug: slug } })]).then(([ev, list]) => {
			if (!alive) return;
			setEvent(ev);
			setListings(list);
		}).catch((e) => alive && setErr(e.message));
		return () => {
			alive = false;
		};
	}, [slug]);
	const dark = event?.theme === "dark" || slug === "breakpoint";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SashShell, {
		dark,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
			children: [
				err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-danger",
					children: err
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rise grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.2em] text-sash",
							children: [
								event?.city || "Event",
								" · ",
								event?.starts_on || "TBA",
								event?.ends_on ? ` – ${event.ends_on}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-4xl sm:text-5xl",
							children: event?.name || slug
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-lg text-muted dark:text-muted-dark",
							children: event?.blurb || "Marketplace hub for logo slots on event clothes."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/import",
								className: "inline-flex min-h-11 items-center rounded-xl bg-sash px-4 font-medium text-white hover:bg-sash-2",
								children: "List from X"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: `${listings.length} live` })]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: event?.hero_image || (dark ? "/art/hallway.jpg" : "/art/hero.jpg"),
						alt: "",
						className: "max-h-72 w-full rounded-3xl object-cover shadow-soft"
					})]
				}),
				slug === "breakpoint" && listings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 rounded-2xl border border-paper/15 bg-ink-2 p-6 text-muted-dark",
					children: "Breakpoint hub is ready (dark theme). Listings open closer to the event — Token2049 is live now."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
					children: listings.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing: l }, l.id))
				})
			]
		})
	});
}
//#endregion
export { EventHub as component };
