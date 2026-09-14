import { o as __toESM } from "../_runtime.mjs";
import { g as GRADUATE_AT } from "./constants-BJEdPgzX.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as useLaunchpad, a as graduateProgress, g as priceOf, s as hydrateLaunchpad, u as marketCap, v as protocolStats, y as raisedOf } from "./store-DuP6GcAD.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatCompact, c as formatUsdc, f as GlassPanel, h as cn, m as Wordmark, o as formatPriceWad } from "./router-DnRFdBgV.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { t as TokenGlyph } from "./token-glyph-CtI3byco.mjs";
import { n as UsdcMark, t as ArcMark } from "./arc-mark-CtphBApM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C7a_9-Ho.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Frosted interlocking capsules — brand hero visual. */
function HeroPills({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative isolate h-full min-h-[280px] w-full overflow-hidden rounded-[28px]", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(42,46,50,0.22),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(79,179,165,0.35),transparent_50%),linear-gradient(160deg,#ecece7,#f5f5f2_45%,#e8f4f1)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pill-float absolute top-[12%] right-[8%] h-[42%] w-[78%] rounded-full",
				style: { ["--pill-rot"]: "-22deg" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full rounded-full border border-white/50 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_24px_48px_rgba(26,26,26,0.12)] backdrop-blur-2xl" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pill-float pill-float-delay absolute bottom-[8%] left-[4%] h-[38%] w-[72%] rounded-full",
				style: { ["--pill-rot"]: "-16deg" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full rounded-full border border-teal-soft/30 bg-gradient-to-br from-white/50 to-teal/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_20px_40px_rgba(61,155,143,0.18)] backdrop-blur-2xl" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/15 blur-3xl" })
		]
	});
}
var STEPS = [
	{
		n: "01",
		title: "Create on Arc.",
		body: "Name, ticker, optional first buy. Supply is one billion. The quote asset is native USDC — the same token that pays gas on Arc.",
		still: "/stills/bound-tokens.jpg",
		alt: "Two clay tokens bound by a liquid-glass amber-teal ring"
	},
	{
		n: "02",
		title: "Fill the USDC curve.",
		body: "Buys and sells hit a constant-product bonding curve. 1.0% protocol + 0.5% creator, taken in USDC. You can exit on the curve before it fills.",
		still: "/stills/glass-card.jpg",
		alt: "Frosted glass card with amber and teal wave bands, embossed Pairband"
	},
	{
		n: "03",
		title: "Book, then Uniswap.",
		body: "At $80 the remaining inventory and USDC mint a locked Uniswap pair. An on-chain order book opens on the same ticket. Market walks the book (price-time); leftover hits the pair at 0.30%. Limits rest. LP burns to 0xdead.",
		still: "/stills/dashboard.jpg",
		alt: "Pairband desk with markets and a hardware wallet"
	}
];
function MarketingPage() {
	const root = (0, import_react.useRef)(null);
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const stats = protocolStats(engine);
	const featured = engine.launches.slice(0, 6);
	(0, import_react.useEffect)(() => {
		hydrateLaunchpad();
	}, []);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.current) return;
		let reverted = false;
		let ctx;
		(async () => {
			const { gsap } = await import("../_libs/gsap.mjs").then((n) => n.t);
			const { ScrollTrigger } = await import("../_libs/gsap.mjs").then((n) => n.n);
			if (reverted || !root.current) return;
			gsap.registerPlugin(ScrollTrigger);
			ctx = gsap.context(() => {
				gsap.from(".hero-copy", {
					y: 28,
					opacity: 0,
					duration: .85,
					ease: "power2.out"
				});
				gsap.from(".hero-visual", {
					opacity: 0,
					scale: .97,
					duration: 1,
					ease: "power2.out",
					delay: .1
				});
				gsap.utils.toArray(".step-card").forEach((el, i) => {
					gsap.from(el, {
						y: 40,
						opacity: 0,
						duration: .7,
						delay: i * .12,
						ease: "power2.out",
						scrollTrigger: {
							trigger: el,
							start: "top 86%"
						}
					});
				});
			}, root);
		})();
		return () => {
			reverted = true;
			ctx?.revert();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: root,
		className: "bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed top-4 right-4 left-4 z-40 mx-auto max-w-6xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "flex items-center justify-between px-4 py-2.5 md:px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-6 text-sm text-muted md:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#markets",
									className: "transition-colors hover:text-ink",
									children: "Markets"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://docs.pairband.com",
									className: "transition-colors hover:text-ink",
									children: "Docs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/security",
									className: "transition-colors hover:text-ink",
									children: "Security"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
								className: "min-h-10 px-4 text-sm",
								children: "Open app"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-[100svh] overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(42,46,50,0.18),transparent_42%),radial-gradient(ellipse_at_88%_70%,rgba(79,179,165,0.22),transparent_48%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto grid max-w-6xl gap-10 px-5 pt-28 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-8 md:pt-32 md:pb-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-copy max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] tracking-[0.22em] text-teal uppercase",
								children: "Stablecoin launchpad on Arc"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-4 text-[2.35rem] leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.25rem]",
								children: [
									"Cover the downside.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Keep the upside."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg",
								children: "Pay USDC from any CCTP chain. Fill the Arc book. Tokens never leave."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-7 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/app",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, { children: "Trade" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/app/create",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
										variant: "secondary",
										children: "Create token"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-6 flex flex-wrap items-center gap-2 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsdcMark, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] tracking-wide uppercase",
											children: "USDC"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": true,
										className: "text-paper-3",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quoted in USDC · Settled on Arc" })]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hero-visual aspect-[5/4] w-full md:aspect-auto md:h-[min(520px,70vh)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroPills, { className: "h-full shadow-clay" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-6xl px-5 pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-3 gap-4 font-mono text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] text-muted uppercase",
							children: "Markets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 tabular text-lg font-medium",
							children: stats.count
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] text-muted uppercase",
							children: "Books"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 tabular text-lg font-medium",
							children: stats.graduated
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] text-muted uppercase",
							children: "Volume"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 tabular text-lg font-medium",
							children: formatCompact(stats.volume)
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-5 py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.22em] text-teal uppercase",
						children: "How it works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-4xl tracking-tight",
						children: "Curve. Pair. Lock."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-6 md:grid-cols-3",
						children: STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							className: "step-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
								className: "overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: s.still,
									alt: s.alt,
									className: "aspect-[4/3] w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[11px] text-teal",
											children: s.n
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-2 text-2xl tracking-tight",
											children: s.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm leading-relaxed text-muted",
											children: s.body
										})
									]
								})]
							})
						}, s.n))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "markets",
				className: "mx-auto max-w-6xl px-5 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] tracking-[0.22em] text-teal uppercase",
							children: "Live markets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-4xl tracking-tight",
							children: "Markets on Arc"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app",
							className: "hidden text-sm text-teal-2 transition-colors hover:text-ink sm:block",
							children: "Open discover"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm text-muted",
						children: "Preview book mirrors the contracts. Connect a wallet on Arc testnet to broadcast when the factory is live."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 overflow-hidden rounded-[24px] border border-ink/8 bg-paper-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "font-mono text-[11px] text-muted uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Token"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Venue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Price"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "hidden px-4 py-3 sm:table-cell",
										children: "FDV"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Raised"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: featured.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-ink/8 transition-colors hover:bg-paper/80",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/app/t/$id",
											params: { id: l.id },
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
												symbol: l.symbol,
												hue: l.hue,
												size: 28
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block font-medium",
												children: l.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block font-mono text-[11px] text-muted",
												children: [l.symbol, "/USDC"]
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono text-[11px] uppercase",
										children: l.status === "graduated" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-teal-2",
											children: "Uniswap"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Curve ",
											Math.round(graduateProgress(l) * 100),
											"%"
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono tabular",
										children: formatPriceWad(priceOf(l))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "hidden px-4 py-3 font-mono tabular sm:table-cell",
										children: formatCompact(marketCap(l))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono tabular",
										children: formatUsdc(raisedOf(l))
									})
								]
							}, l.id)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-5 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.22em] text-teal uppercase",
						children: "Policy, not vibes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-4xl tracking-tight",
						children: "The pair is the lock."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 overflow-hidden rounded-[24px] border border-ink/6 bg-paper-2 p-6 shadow-clay-sm md:p-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4",
							children: [
								["Quote", "USDC (Arc native)"],
								["Settle", "Arc CCTP domain 26"],
								["In", "ETH · Base · UNI · ARB · OP · SOL"],
								["Graduate", formatUsdc(GRADUATE_AT)],
								["Launch fee", "$1 USDC"],
								["Agent fee", "$0.25 / propose"],
								["Curve fee", "1.0% + 0.5%"],
								["Uniswap fee", "0.30%"],
								["LP", "Burned to 0xdead"],
								["Bytecode", "Same on mainnet 5042"]
							].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-[11px] text-muted uppercase",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-mono text-sm",
								children: v
							})] }, k))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mx-auto max-w-6xl px-5 py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {
						size: "lg",
						className: "footer-mark"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-sm text-muted",
						children: "Pairband. Any chain in. Settlement on Arc. Testnet live. No audit. Mainnet when testnet hashes hold."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://docs.pairband.com",
								children: "Docs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://docs.pairband.com/docs/business-model",
								children: "Business model"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/security",
								children: "Security"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/trade",
								children: "Trade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://testnet.arcscan.app/address/0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4",
								children: "Arcscan"
							})
						]
					})
				]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingPage, {});
}
//#endregion
export { Link, Home as component };
