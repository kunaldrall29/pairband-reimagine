import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as useLaunchpad, S as raisedOf, a as graduateProgress, c as hydrateLaunchpad, p as marketCap, u as isOnchainLaunchId, x as protocolStats, y as priceOf } from "./store-BwIaYuXO.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as string, i as object, t as _enum } from "../_libs/zod.mjs";
import { a as formatCompact, c as formatUsdc, f as GlassPanel, h as cn, m as Wordmark, o as formatPriceWad } from "./router-DYi0iHDD.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { n as UsdcMark, t as ArcMark } from "./arc-mark-CtphBApM.mjs";
import { t as TokenGlyph } from "./token-glyph-CtI3byco.mjs";
import { t as StatusChip } from "./status-chip-Do3CAv8s.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C1p7zOu_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C7-Oay4V.js
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
/** Brand step art — CSS primary, photo enhancement when the still loads. */
function StepArt({ kind, still, alt, className }) {
	const [photoOk, setPhotoOk] = (0, import_react.useState)(false);
	const bindImg = (0, import_react.useCallback)((el) => {
		if (!el) return;
		if (el.complete && el.naturalWidth > 0) setPhotoOk(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative aspect-[16/10] w-full overflow-hidden bg-[#eceae4] sm:aspect-[4/3]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0",
			"aria-hidden": true,
			children: [
				kind === "create" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateArt, {}) : null,
				kind === "curve" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurveArt, {}) : null,
				kind === "book" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookArt, {}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			ref: bindImg,
			src: still,
			alt: photoOk ? alt : "",
			"aria-hidden": !photoOk,
			className: cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-300", photoOk ? "opacity-100" : "pointer-events-none opacity-0"),
			loading: "lazy",
			decoding: "async",
			onLoad: () => setPhotoOk(true),
			onError: () => setPhotoOk(false)
		})]
	});
}
function CreateArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(42,46,50,0.12),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(79,179,165,0.28),transparent_55%),linear-gradient(165deg,#f3f1ec,#e7e4dc)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[22%] left-[18%] size-[38%] rounded-full bg-[#cbb79a] shadow-[inset_0_-8px_16px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.1)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[28%] right-[16%] size-[34%] rounded-full bg-[#7aa8a0] shadow-[inset_0_-8px_16px_rgba(0,0,0,0.1),0_12px_28px_rgba(0,0,0,0.08)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 h-[22%] w-[58%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-full border border-white/60 bg-gradient-to-r from-[#E8B86D]/55 via-white/35 to-[#3D9B8F]/55 shadow-[0_8px_24px_rgba(61,155,143,0.2)] backdrop-blur-[2px]" })
		]
	});
}
function CurveArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 bg-[linear-gradient(160deg,#f5f3ee,#ebe8e1)] p-[12%]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-full w-full overflow-hidden rounded-[18px] border border-white/70 bg-white/45 shadow-[0_16px_40px_rgba(26,26,26,0.08)] backdrop-blur-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-[18%] h-[22%] bg-gradient-to-r from-[#E8B86D]/50 via-[#E8B86D]/15 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-[42%] h-[22%] bg-gradient-to-r from-transparent via-[#3D9B8F]/35 to-[#3D9B8F]/55" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-[12%] bottom-[14%] left-[12%] h-px bg-ink/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-[12%] bottom-[14%] left-[12%] h-16 origin-bottom-left scale-y-[0.85]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 200 64",
						className: "h-full w-full",
						preserveAspectRatio: "none",
						"aria-hidden": true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M0 56 C40 56 55 8 100 8 C145 8 160 56 200 56",
							fill: "none",
							stroke: "#3D9B8F",
							strokeWidth: "2.5",
							strokeLinecap: "round"
						})
					})
				})
			]
		})
	});
}
function BookArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(79,179,165,0.2),transparent_45%),linear-gradient(180deg,#f2f0ea,#e5e2da)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-[16%] right-[10%] left-[10%] h-[58%] rounded-[16px] border border-ink/8 bg-[#faf9f6] shadow-[0_18px_36px_rgba(26,26,26,0.1)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-3 left-3 right-3 flex gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-8 rounded-full bg-ink/15" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-12 rounded-full bg-teal/40" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-3 top-8 bottom-3 grid grid-cols-3 gap-1.5",
				children: [
					.35,
					.55,
					.8
				].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end rounded-md bg-ink/[0.04] p-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full rounded-sm bg-gradient-to-t from-teal/70 to-teal/25",
						style: { height: `${h * 100}%` }
					})
				}, i))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-[18%] bottom-[10%] size-10 rounded-lg border border-ink/10 bg-[#2a2e32] shadow-md" })]
	});
}
var joinSchema = object({
	wallet: string().regex(/^0x[a-fA-F0-9]{40}$/, "Valid Arc wallet required"),
	interest: _enum(["launch", "trade"]),
	projectName: string().trim().max(64).optional(),
	xHandle: string().trim().max(32).optional().transform((v) => v ? v.replace(/^@/, "") : void 0),
	pitch: string().trim().max(280).optional()
});
var joinWaitlist = createServerFn({ method: "POST" }).validator((data) => joinSchema.parse(data)).handler(createSsrRpc("e998f4dfaf860bc7a5bafd829ea7b84d7f5da4e556df4f2df4bf11ef938ec7dd"));
var waitlistStats = createServerFn({ method: "GET" }).handler(createSsrRpc("faae4b30c802a8eb331abca10ccbb8af85221948b9f08df1618f3ad39fed3ad5"));
var WALLET_RE = /^0x[a-fA-F0-9]{40}$/;
function WaitlistForm({ className }) {
	const [interest, setInterest] = (0, import_react.useState)("trade");
	const [wallet, setWallet] = (0, import_react.useState)("");
	const [projectName, setProjectName] = (0, import_react.useState)("");
	const [xHandle, setXHandle] = (0, import_react.useState)("");
	const [pitch, setPitch] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [done, setDone] = (0, import_react.useState)(false);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [pending, start] = (0, import_react.useTransition)();
	(0, import_react.useEffect)(() => {
		waitlistStats().then(setStats).catch(() => setStats({
			launch: 0,
			trade: 0,
			total: 0
		}));
	}, [done]);
	function submit(e) {
		e.preventDefault();
		setError(null);
		if (!WALLET_RE.test(wallet.trim())) {
			setError("Enter a valid 0x wallet on Arc.");
			return;
		}
		if (interest === "launch" && projectName.trim().length < 2) {
			setError("Name the project you want to launch.");
			return;
		}
		start(async () => {
			try {
				await joinWaitlist({ data: {
					wallet: wallet.trim(),
					interest,
					projectName: projectName.trim() || void 0,
					xHandle: xHandle.trim() || void 0,
					pitch: pitch.trim() || void 0
				} });
				setDone(true);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Could not join waitlist");
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
		className: cn("p-6 sm:p-8", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.22em] text-teal uppercase",
				children: "Mainnet waitlist"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl tracking-tight sm:text-4xl",
				children: "Early access, not a gate on trading."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
				children: "Selected projects get create access at mainnet open. Anyone can trade once markets are live. Join with your wallet — we select launchers from this list."
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-2xl border border-teal/30 bg-teal/10 px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-ink",
					children: "You're on the list."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: interest === "launch" ? "If selected, you’ll get create access for your project. Trading stays open to everyone." : "Trading is open to everyone at mainnet. We’ll ping your X if we need early trader feedback."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-2xl bg-ink/5 p-1",
						children: [{
							id: "trade",
							label: "I want to trade"
						}, {
							id: "launch",
							label: "I want to launch"
						}].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setInterest(opt.id),
							className: cn("min-h-11 flex-1 rounded-xl text-sm font-medium transition-colors", interest === opt.id ? "bg-paper text-ink shadow-border" : "text-muted"),
							children: opt.label
						}, opt.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block font-mono text-[11px] text-muted uppercase",
							children: "Wallet"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: wallet,
							onChange: (e) => setWallet(e.target.value),
							placeholder: "0x…",
							autoComplete: "off",
							spellCheck: false,
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono text-sm outline-none focus:border-teal"
						})]
					}),
					interest === "launch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block font-mono text-[11px] text-muted uppercase",
							children: "Project name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: projectName,
							onChange: (e) => setProjectName(e.target.value),
							maxLength: 64,
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-teal"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block font-mono text-[11px] text-muted uppercase",
							children: "Pitch (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: pitch,
							onChange: (e) => setPitch(e.target.value),
							maxLength: 280,
							rows: 3,
							className: "w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm outline-none focus:border-teal"
						})]
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block font-mono text-[11px] text-muted uppercase",
							children: "X handle (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: xHandle,
							onChange: (e) => setXHandle(e.target.value),
							placeholder: "@…",
							maxLength: 32,
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-teal"
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
						type: "submit",
						disabled: pending,
						className: "w-full sm:w-auto",
						children: pending ? "Joining…" : "Join waitlist"
					})
				]
			}),
			stats && stats.total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-[11px] text-muted",
				children: [
					stats.total,
					" on list · ",
					stats.launch,
					" launch · ",
					stats.trade,
					" trade"
				]
			}) : null
		]
	});
}
var STEPS = [
	{
		n: "01",
		kind: "create",
		title: "Create on Arc.",
		body: "Name, ticker, image. $1 USDC launch fee. One billion supply, 18 decimals. Optional first buy in the same transaction.",
		still: "/stills/bound-tokens.jpg",
		alt: "Two clay tokens bound by a liquid-glass amber-teal ring"
	},
	{
		n: "02",
		kind: "curve",
		title: "Sellable USDC curve.",
		body: "Constant-product quoted in native Arc USDC. 1.0% protocol + 0.5% creator. minAmountOut on every ticket — failed swaps take no fee. Exit anytime until Stage B.",
		still: "/stills/glass-card.jpg",
		alt: "Frosted glass card with amber and teal wave bands"
	},
	{
		n: "03",
		kind: "book",
		title: "Book, then locked Uniswap.",
		body: "Stage A opens the on-chain book at a real USDC threshold. Stage B locks liquidity in Uniswap — LP to 0xdead. Market orders walk the book, then the pool. Tokens never leave Arc.",
		still: "/stills/dashboard.jpg",
		alt: "Pairband desk with markets and a hardware wallet"
	}
];
function MarketingPage() {
	const root = (0, import_react.useRef)(null);
	const engine = useLaunchpad((s) => s.engine);
	useLaunchpad((s) => s.version);
	const stats = protocolStats(engine);
	const featured = engine.launches.filter((l) => isOnchainLaunchId(l.id)).slice(0, 6);
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
				gsap.from(".waitlist-block", {
					y: 36,
					opacity: 0,
					duration: .75,
					ease: "power2.out",
					scrollTrigger: {
						trigger: ".waitlist-block",
						start: "top 88%"
					}
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
				className: "fixed top-3 right-3 left-3 z-40 mx-auto max-w-6xl sm:top-4 sm:right-4 sm:left-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "flex items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5",
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
									href: "#waitlist",
									className: "transition-colors hover:text-ink",
									children: "Waitlist"
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#waitlist",
								className: "hidden sm:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
									variant: "secondary",
									className: "min-h-10 px-3 text-sm",
									children: "Waitlist"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
									className: "min-h-10 px-4 text-sm",
									children: "Open app"
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-[100svh] overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(42,46,50,0.18),transparent_42%),radial-gradient(ellipse_at_88%_70%,rgba(79,179,165,0.22),transparent_48%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto grid max-w-6xl gap-8 px-5 pt-24 pb-12 sm:gap-10 sm:pt-28 sm:pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-8 md:pt-32 md:pb-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-copy max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] tracking-[0.22em] text-teal uppercase",
								children: "Pairband · Arc testnet live"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-4 font-display text-[2.35rem] leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.1rem]",
								children: "Pairband"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg",
								children: "Launch in USDC on Arc. Buyers pay from any CCTP chain. The token never leaves. At a real USDC threshold — not eighty dollars — we lock Uniswap liquidity and keep an on-chain book beside it."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-7 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/app",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, { children: "Trade on testnet" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#waitlist",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
										variant: "secondary",
										children: "Mainnet waitlist"
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
											children: "USDC gas + quote"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": true,
										className: "text-paper-3",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcMark, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CCTP domain 26 · Settlement on Arc" })]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hero-visual mt-2 aspect-[5/4] max-h-[340px] w-full sm:max-h-none md:mt-0 md:aspect-auto md:h-[min(520px,70vh)]",
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
							children: "Stage B"
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
				className: "mx-auto max-w-6xl px-5 py-16 sm:py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.22em] text-teal uppercase",
						children: "How it works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl tracking-tight sm:text-4xl",
						children: "Curve. Book. Lock."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-sm text-muted",
						children: "Most pads graduate into a ghost pool: LP can flee, the quote is noisy, and there is no book. Pairband issues on Arc in USDC. The curve is sellable. Stage A is discovery. Stage B is permanent liquidity."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3",
						children: STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							className: "step-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
								className: "overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepArt, {
									kind: s.kind,
									still: s.still,
									alt: s.alt
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 sm:p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[11px] text-teal",
											children: s.n
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-1.5 text-xl tracking-tight sm:mt-2 sm:text-2xl",
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
							children: "On Arc testnet"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app",
							className: "hidden text-sm text-teal-2 transition-colors hover:text-ink sm:block",
							children: "Open discover"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm text-muted",
						children: "Status chips: Curve · Stage A Book · Stage B Locked. Connect a wallet on Arc testnet to create and trade."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 overflow-x-auto rounded-[20px] border border-ink/8 bg-paper-2 sm:mt-8 sm:rounded-[24px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[320px] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "font-mono text-[11px] text-muted uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Token"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Status"
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: featured.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "px-4 py-8 text-center text-muted",
								children: "No on-chain markets yet — open the app to sync Arc or create a token."
							}) }) : featured.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
										className: "px-4 py-3",
										children: l.status === "curve" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[11px] uppercase",
											children: [
												"Curve ",
												Math.round(graduateProgress(l) * 100),
												"%"
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
											status: l.status,
											compact: true
										})
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "waitlist",
				className: "mx-auto max-w-6xl px-5 py-16 sm:py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "waitlist-block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitlistForm, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-5 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.22em] text-teal uppercase",
						children: "Policy in bytecode"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-4xl tracking-tight",
						children: "Fees and invariants."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 overflow-hidden rounded-[24px] border border-ink/6 bg-paper-2 p-6 shadow-clay-sm md:p-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4",
							children: [
								["Quote", "Native Arc USDC"],
								["Settle", "Arc · CCTP 26"],
								["Pay from", "ETH · Base · ARB · OP · UNI · SOL"],
								["Testnet Stage B", "$80 (faucet demo)"],
								["Mainnet Stage A", "$2,000 · 15 buyers"],
								["Mainnet Stage B", "$12k / $20k hard"],
								["Launch fee", "$1 USDC"],
								["Curve fee", "1.0% + 0.5%"],
								["Book taker", "0.10%"],
								["Uniswap", "0.30% · LP dead"],
								["Fee cap", "2.00% in bytecode"],
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
						className: "mt-4 max-w-lg text-sm text-muted",
						children: "Pairband v1. Live on testnet. Mainnet after the hashes hold and the settler is under audit. Built on Circle CCTP and Uniswap on Arc — not a partnership claim."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://docs.pairband.com",
								children: "Docs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/security",
								children: "Security"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/trade",
								children: "Trade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/bridge",
								children: "Bridge USDC"
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
