import { C as formatToken, D as shortAddr, S as formatPriceWad, b as errorCopy, c as DEPLOYER, l as FAUCET_AMOUNT, w as formatUsdc } from "./format-BlK3yrc5.mjs";
import { c as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useLaunchpad, g as usdcBalance, h as tokenBalance, u as priceOf } from "./store-BFkd_wST.mjs";
import { t as ClayButton } from "./clay-button-Bi5H0-iU.mjs";
import { t as TokenGlyph } from "./token-glyph-m-nzutxZ.mjs";
import { r as GlassPanel } from "./router-CJlix3MW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-DtXHZqeu.js
var import_jsx_runtime = require_jsx_runtime();
function Me() {
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const account = useLaunchpad((s) => s.account);
	const faucet = useLaunchpad((s) => s.faucet);
	const lastError = useLaunchpad((s) => s.lastError);
	const watchlist = useLaunchpad((s) => s.watchlist);
	const usdc = usdcBalance(engine, account);
	const positions = engine.launches.map((l) => ({
		launch: l,
		amount: tokenBalance(engine, l.id, account)
	})).filter((p) => p.amount > 0n);
	const created = engine.launches.filter((l) => l.creator === account);
	const watched = engine.launches.filter((l) => watchlist.includes(l.id));
	const value = positions.reduce((acc, p) => {
		const px = priceOf(p.launch);
		return acc + p.amount * px / 10n ** 18n;
	}, 0n);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.18em] text-muted uppercase",
				children: "Wallet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Your book"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-xs text-muted",
				children: shortAddr(account, 6)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-muted uppercase",
							children: "USDC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl tabular",
							children: formatUsdc(usdc)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Demo balance. Same asset as Arc gas."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
							className: "mt-4",
							variant: "secondary",
							onClick: () => faucet(),
							children: ["Faucet ", formatUsdc(FAUCET_AMOUNT, 0)]
						}),
						lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-danger",
							children: errorCopy(lastError)
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-muted uppercase",
							children: "Token mark"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-2xl tabular",
							children: formatUsdc(value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								positions.length,
								" positions · ",
								created.length,
								" launched"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-medium",
				children: "Holdings"
			}),
			positions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					"Empty. Buy on ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app",
						children: "Discover"
					}),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: positions.map(({ launch, amount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app/t/$id",
					params: { id: launch.id },
					className: "flex min-h-14 items-center gap-3 rounded-2xl border border-ink/8 px-3 dark:border-paper/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
							symbol: launch.symbol,
							hue: launch.hue,
							size: 32
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: launch.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block font-mono text-[11px] text-muted",
								children: [
									formatPriceWad(priceOf(launch)),
									" · ",
									launch.status === "graduated" ? "Uniswap" : "Curve"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular",
							children: formatToken(amount)
						})
					]
				}) }, launch.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-medium",
				children: "Watchlist"
			}),
			watched.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Star a market on its page."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: watched.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/t/$id",
					params: { id: l.id },
					className: "font-medium",
					children: l.symbol
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 font-mono text-xs text-muted",
					children: formatPriceWad(priceOf(l))
				})] }, l.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-medium",
				children: "Created"
			}),
			created.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					"You have not launched. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/create",
						children: "Create a token"
					}),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: created.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-2xl border border-ink/8 px-3 py-3 text-sm dark:border-paper/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						l.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-muted",
							children: l.symbol
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-muted",
						children: [formatUsdc(l.creatorFees), " fees"]
					})]
				}, l.id))
			}),
			account === "0xA11CE00000000000000000000000000000000A11" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-10 text-xs leading-relaxed text-muted",
				children: [
					"Preview wallet. Live factory deploys from ",
					shortAddr(DEPLOYER, 6),
					" on Arc Testnet. Private keys never enter this app. Fund the deployer at faucet.circle.com to broadcast."
				]
			}) : null
		]
	});
}
//#endregion
export { Me as component };
