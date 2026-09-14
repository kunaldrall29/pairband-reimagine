import { o as __toESM } from "../_runtime.mjs";
import { S as WAD, f as DEPLOYER, p as GRADUATE_AT } from "./constants-CT0WK1Sd.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { _ as createFileRoute, d as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as string, i as object, n as literal, o as union, r as number } from "../_libs/zod.mjs";
import { r as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-B5gpnJ4b.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function shortAddr(addr, size = 4) {
	if (!addr) return "";
	return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}
function formatUnits(amount, decimals, digits = 2) {
	const neg = amount < 0n;
	const v = neg ? -amount : amount;
	const base = 10n ** BigInt(decimals);
	const whole = v / base;
	const fracStr = (v % base).toString().padStart(decimals, "0").slice(0, digits);
	const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	if (digits === 0 || decimals === 0) return `${neg ? "−" : ""}${wholeStr}`;
	return `${neg ? "−" : ""}${wholeStr}.${fracStr}`;
}
function parseUnits(value, decimals) {
	const trimmed = value.trim();
	if (!trimmed) return 0n;
	const [w, f = ""] = trimmed.replace(/,/g, "").split(".");
	const frac = (f + "0".repeat(decimals)).slice(0, decimals);
	return (w.startsWith("-") ? -1n : 1n) * (BigInt(w.replace("-", "") || "0") * 10n ** BigInt(decimals) + BigInt(frac || "0"));
}
function formatUsd(amount, decimals = 6) {
	return `$${formatUnits(amount, decimals, 2)}`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DYi0iHDD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-BXf2aS_N.css";
var APP_NAME = "Pairband";
var Route$15 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Launch in USDC on Arc. Buyers pay from any CCTP chain. Curve → Stage A book → Stage B locked Uniswap."
			},
			{
				name: "theme-color",
				content: "#F5F5F2"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grain",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$12 = () => import("./routes-C7-Oay4V.mjs");
var Route$14 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$12, "component"),
	head: () => ({ meta: [{ title: "Pairband — Launch in USDC. Graduate to Uniswap." }] })
});
var $$splitComponentImporter$11 = () => import("./route-KI_33S7I.mjs");
var Route$13 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./docs-DH2bUCmA.mjs");
var Route$12 = createFileRoute("/docs")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
/** Interlocking pill mark — Pairband brand. */
function PairMark({ size = 22, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 32 32",
		fill: "none",
		"aria-hidden": true,
		className: cn("shrink-0", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "2",
			y: "6",
			width: "20",
			height: "10",
			rx: "5",
			transform: "rotate(-18 12 11)",
			className: "fill-ink dark:fill-paper"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "10",
			y: "16",
			width: "20",
			height: "10",
			rx: "5",
			transform: "rotate(-18 20 21)",
			className: "fill-teal"
		})]
	});
}
function Wordmark({ className, size = "md" }) {
	const h = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
	const mark = size === "lg" ? 28 : size === "sm" ? 18 : 22;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2 font-sans font-semibold tracking-tight text-ink lowercase dark:text-paper", h, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PairMark, { size: mark }), "pairband"]
	});
}
function GlassPanel({ className, children, radius = "xl", ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("glass", radius === "lg" ? "rounded-[16px]" : radius === "2xl" ? "rounded-[24px]" : "rounded-[20px]", className),
		...rest,
		children
	});
}
var Route$11 = createFileRoute("/security")({
	component: Security,
	head: () => ({ meta: [{ title: "Security — Pairband" }] })
});
var ADDRS = [
	["Launchpad", "0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4"],
	["Settler", "0x229BD1BcdE44c26E0c7741B46854Ccfb4e54CC40"],
	["AMM factory", "0x0769121558BB51Fb71Edb933010D294D770e6e18"],
	["USDC (Arc)", "0x3600000000000000000000000000000000000000"]
];
function Security() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-3xl items-center justify-between px-5 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app",
				className: "text-sm underline underline-offset-4",
				children: "Open app"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto max-w-3xl px-5 pb-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.2em] text-muted",
					children: "Threat model"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-5xl tracking-tight",
					children: "Honest risk copy."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-base leading-relaxed text-muted",
					children: "Before Stage B you can lose money on the curve. After Stage B the pool cannot be rugged of LP. A bad token still trades. This is not insured downside."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Stage B LP is burned"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: "Graduation seeds Uniswap (or a PairbandPair fallback) and sends LP to 0xdead or a locker with no decreaseLiquidity path. There is no withdraw, no owner escape, no migrate."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Curve can still hurt you"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: "Before Stage B, price is the bonding curve. You can be early, late, or last. Fees are taken in USDC. minAmountOut is required; failed swaps take no fee. This is not risk-free yield."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Invariants"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Settlement chain is Arc. Only USDC moves cross-chain via CCTP." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No proxy / no delegatecall on the launch path." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Per-market vault isolation — one market cannot pay another." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Fee cap 2.00% in bytecode." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1B supply; minting permanently disabled after Stage B." })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Audit boundary (v1)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: "In scope: Settler, Launchpad + MarketVault, Token, Book, graduation handoff. Out of scope for first audit — do not ship on mainnet: Uniswap v4 PairbandHook, agent vaults, Gateway-specific code until the hook path matches CCTP, any messenger for launch tokens. Audit: not started."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl",
									children: "Testnet addresses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "mt-3 space-y-2 font-mono text-xs",
									children: ADDRS.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-0.5 sm:flex-row sm:justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: k
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "break-all",
											children: v
										})]
									}, k))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted",
									children: "Verified source on Arcscan the day of deploy. Immunefi (or equivalent) bounty live the same day as mainnet — even if small."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Keys"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: "The app never holds user keys. The deployer key lives only in the local ops file, never in public env vars, never in the browser."
							})]
						})
					]
				})
			]
		})]
	});
}
var $$splitComponentImporter$9 = () => import("./app-zr0VGPz9.mjs");
var Route$10 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./activity-8GLRgZoE.mjs");
var Route$9 = createFileRoute("/app/activity")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./bridge-DJLOVxgf.mjs");
var Route$8 = createFileRoute("/app/bridge")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({ meta: [{ title: "Bridge USDC — Pairband" }] })
});
var $$splitComponentImporter$6 = () => import("./create-BPsKwDIn.mjs");
var Route$7 = createFileRoute("/app/create")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./curator-BYiVtQZ5.mjs");
var Route$6 = createFileRoute("/app/curator")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "Vault agent — Pairband" }] })
});
var $$splitComponentImporter$4 = () => import("./me-CCjeJoVG.mjs");
var Route$5 = createFileRoute("/app/me")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./trade-D-56bY7-.mjs");
var Route$4 = createFileRoute("/app/trade")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
function formatUsdc(amount, digits = 2) {
	return `$${formatUnits(amount, 18, digits)}`;
}
function formatToken(amount, digits = 2) {
	return formatUnits(amount, 18, digits);
}
function formatPriceWad(price) {
	const n = Number(price) / Number(WAD);
	if (!Number.isFinite(n) || n <= 0) return "$0.00";
	if (n >= 1) return `$${n.toFixed(4)}`;
	if (n >= .01) return `$${n.toFixed(6)}`;
	if (n >= 1e-4) return `$${n.toFixed(8)}`;
	return `$${n.toExponential(2)}`;
}
function formatCompact(amount) {
	const n = Number(amount) / Number(WAD);
	if (!Number.isFinite(n)) return "—";
	const abs = Math.abs(n);
	const sign = n < 0 ? "−" : "";
	if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
	if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(2)}K`;
	if (abs >= 1) return `${sign}$${abs.toFixed(2)}`;
	if (abs >= .01) return `${sign}$${abs.toFixed(4)}`;
	return `${sign}$${abs.toFixed(6)}`;
}
function timeAgo(ts) {
	const s = Math.max(0, Math.floor((Date.now() - ts) / 1e3));
	if (s < 60) return `${s}s`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 48) return `${h}h`;
	return `${Math.floor(h / 24)}d`;
}
function toInput(amount, decimals = 18) {
	const base = 10n ** BigInt(decimals);
	const whole = amount / base;
	const frac = (amount % base).toString().padStart(decimals, "0").replace(/0+$/, "");
	return frac ? `${whole}.${frac}` : `${whole}`;
}
function impactLabel(bps) {
	if (bps < 5) return `${(bps / 100).toFixed(2)}%`;
	if (bps < 100) return `${(bps / 100).toFixed(2)}%`;
	return `${(bps / 100).toFixed(1)}%`;
}
function errorCopy(code) {
	switch (code) {
		case "ZeroAmount": return "Enter an amount.";
		case "Slippage": return "Price moved. Tighten size or retry.";
		case "BelowMinLp": return "That buy would drain the Uniswap reserve.";
		case "InsufficientRealUsdc": return "Not enough USDC in the curve.";
		case "InsufficientBalance": return "Not enough USDC on Arc (launch fee, buy, or agent fee).";
		case "AlreadyGraduated": return "Already on Uniswap.";
		case "NotGraduated": return "Curve has not filled yet.";
		case "BookNotOpen": return "Book opens at Stage A.";
		case "PriceContinuity": return "Graduation price continuity failed.";
		case "CurveClosed": return "Curve closed after Stage B.";
		case "UnknownLaunch": return "Token not found.";
		case "InvalidMeta": return "Name 2–32 chars. Symbol 2–12 A–Z / 0–9.";
		case "InsufficientLiquidity": return "Not enough liquidity.";
		case "FaucetCapped": return "Faucet cap reached.";
		case "NotOwner": return "Not your order.";
		case "OrderNotFound": return "Order already filled or cancelled.";
		case "UnknownDomain": return "That chain is not a CCTP domain we settle.";
		case "SameDomain": return "Already on Arc. Pick a destination chain.";
		default: return code ?? "";
	}
}
var Route$3 = createFileRoute("/docs/")({
	component: Docs,
	head: () => ({ meta: [{ title: "Docs — Pairband" }] })
});
function Docs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-3xl items-center justify-between px-5 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app",
				className: "text-sm underline underline-offset-4",
				children: "Open app"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto max-w-3xl px-5 pb-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.2em] text-muted",
					children: "Launchpad"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-5xl",
					children: "Curve, then Uniswap."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-muted",
					children: [
						"Pairband is the Arc launchpad. Tokens are quoted in USDC. At ",
						formatUsdc(GRADUATE_AT),
						" raised, remaining inventory and cash mint a constant-product pair. LP is burned to 0xdead."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-10 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Venues"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"One ticket. If ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink",
								children: "status == curve"
							}),
							", buy/sell hit x·y=k virtual reserves (80 USDC × 1B tokens). If graduated, the same function routes through the pair: Uniswap v2 getAmountOut, 0.30% fee, k conserved after fee."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Graduation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "The filling buy transfers remaining tokens and real USDC into a new pair, mints LP, and sends it to 0xdead. There is no removeLiquidity on the locker. After that, price impact is the Uniswap curve, not the bonding curve."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Fees"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-1 font-mono text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Launch $1.00 USDC on Arc · one-time at create" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Vault agent $0.25 USDC per rebalance proposal on Arc" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Curve protocol 1.00% · creator 0.50% · paid in USDC" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Uniswap swap 0.30% · stays in the pool" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cap 2.00% in code · no fee on a failed swap" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://docs.pairband.com/business-model",
							className: "mt-4 inline-block text-sm text-teal underline underline-offset-4",
							children: "Business model →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Arc"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"Chain ID 5042002 (testnet), 5042 (mainnet). USDC is gas and quote. ERC-20 interface 0x3600000000000000000000000000000000000000. Deployer ",
							shortAddr(DEPLOYER, 6),
							". Same bytecode on both networks. Private keys never enter the app."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Any chain, settle on Arc"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"Circle CCTP v2. Arc is domain 26. TokenMessenger",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink",
								children: "0x8FE6…2DAA"
							}),
							". A buy from Ethereum, Base, Unichain, Arbitrum, OP, or Solana burns source USDC and mints on Arc into",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink",
								children: "PairbandSettler"
							}),
							", which routes into the launchpad or book. Tokens never leave Arc. Bridge out burns Arc USDC back to the dest domain. Preview settles instantly; live Fast Transfer applies on ETH/Base/Unichain."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "On-chain book"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"After graduation, ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink",
								children: "PairbandBook"
							}),
							" is a fully on-chain CLOB: escrowed bids and asks, price-time via a linked list, cancel returns the remainder. Market orders walk the book then the locked Uniswap pair (0.30%). Arc's USDC gas and ~0.5s finality make resting on-chain viable. There is no off-chain matcher."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Vault agent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Automate vault rebalances: agent proposes a band, curator executes after a delay. Live on Arc testnet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/docs/vault-agent",
							className: "mt-4 inline-block text-sm text-teal underline underline-offset-4",
							children: "Vault agent guide →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "mt-6 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Contracts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink",
								children: "PairbandLaunchpad"
							}),
							" creates tokens and routes buys.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink",
								children: " PairbandBook"
							}),
							" is the CLOB.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink",
								children: "PairbandSettler"
							}),
							" is the CCTP inbox. Addresses live in packages/config/deployments.json per chain."
						]
					})]
				})
			]
		})]
	});
}
var $$splitComponentImporter$2 = () => import("./docs.vault-agent-B4Q4bKCH.mjs");
var Route$2 = createFileRoute("/docs/vault-agent")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Vault agent — Pairband docs" }] })
});
var $$splitComponentImporter$1 = () => import("./t._id-D8BbqPS1.mjs");
var Route$1 = createFileRoute("/app/t/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./p._chainId._vault-Dcuh4Bff.mjs");
var Route = createFileRoute("/app/p/$chainId/$vault")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Vault — Pairband" }] })
});
var IndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var AppRouteRoute = Route$13.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$15
});
var DocsRoute = Route$12.update({
	id: "/docs",
	path: "/docs",
	getParentRoute: () => Route$15
});
var SecurityRoute = Route$11.update({
	id: "/security",
	path: "/security",
	getParentRoute: () => Route$15
});
var AppIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRouteRoute
});
var AppActivityRoute = Route$9.update({
	id: "/activity",
	path: "/activity",
	getParentRoute: () => AppRouteRoute
});
var AppBridgeRoute = Route$8.update({
	id: "/bridge",
	path: "/bridge",
	getParentRoute: () => AppRouteRoute
});
var AppCreateRoute = Route$7.update({
	id: "/create",
	path: "/create",
	getParentRoute: () => AppRouteRoute
});
var AppCuratorRoute = Route$6.update({
	id: "/curator",
	path: "/curator",
	getParentRoute: () => AppRouteRoute
});
var AppMeRoute = Route$5.update({
	id: "/me",
	path: "/me",
	getParentRoute: () => AppRouteRoute
});
var AppTradeRoute = Route$4.update({
	id: "/trade",
	path: "/trade",
	getParentRoute: () => AppRouteRoute
});
var DocsIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => DocsRoute
});
var DocsVaultAgentRoute = Route$2.update({
	id: "/vault-agent",
	path: "/vault-agent",
	getParentRoute: () => DocsRoute
});
var AppRouteRouteChildren = {
	AppActivityRoute,
	AppBridgeRoute,
	AppCreateRoute,
	AppCuratorRoute,
	AppMeRoute,
	AppTradeRoute,
	AppIndexRoute,
	AppTIdRoute: Route$1.update({
		id: "/t/$id",
		path: "/t/$id",
		getParentRoute: () => AppRouteRoute
	}),
	AppPChainIdVaultRoute: Route.update({
		id: "/p/$chainId/$vault",
		path: "/p/$chainId/$vault",
		getParentRoute: () => AppRouteRoute
	})
};
var AppRouteRouteWithChildren = AppRouteRoute._addFileChildren(AppRouteRouteChildren);
var DocsRouteChildren = {
	DocsVaultAgentRoute,
	DocsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRouteRoute: AppRouteRouteWithChildren,
	DocsRoute: DocsRoute._addFileChildren(DocsRouteChildren),
	SecurityRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { parseUnits as _, formatCompact as a, formatUsdc as c, toInput as d, GlassPanel as f, formatUsd as g, cn as h, errorCopy as i, impactLabel as l, Wordmark as m, Route as n, formatPriceWad as o, PairMark as p, Route$1 as r, formatToken as s, router_exports as t, timeAgo as u, shortAddr as v };
