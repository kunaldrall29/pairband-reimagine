import { i as __toESM } from "../_runtime.mjs";
import { D as shortAddr, S as formatPriceWad, c as DEPLOYER, d as GRADUATE_AT, w as formatUsdc, x as formatCompact } from "./format-BlK3yrc5.mjs";
import { a as TorusGeometry, c as require_jsx_runtime, i as Float32BufferAttribute, l as require_react, n as useFrame, r as Color, t as Canvas } from "../_libs/@react-three/fiber+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useLaunchpad, a as marketCap, f as protocolStats, i as hydrateLaunchpad, n as graduateProgress, p as raisedOf, u as priceOf } from "./store-BFkd_wST.mjs";
import { t as ClayButton } from "./clay-button-Bi5H0-iU.mjs";
import { t as TokenGlyph } from "./token-glyph-m-nzutxZ.mjs";
import { i as Wordmark, r as GlassPanel } from "./router-CJlix3MW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CdtsfYlu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GradientTorus() {
	const ref = (0, import_react.useRef)(null);
	const geom = (0, import_react.useMemo)(() => {
		const g = new TorusGeometry(1.18, .2, 48, 128);
		const colors = [];
		const pos = g.attributes.position;
		const amber = new Color("#E8B86D");
		const teal = new Color("#3D9B8F");
		const c = new Color();
		for (let i = 0; i < pos.count; i++) {
			const t = (pos.getX(i) + 1.5) / 3;
			c.copy(amber).lerp(teal, Math.min(1, Math.max(0, t)));
			colors.push(c.r, c.g, c.b);
		}
		g.setAttribute("color", new Float32BufferAttribute(colors, 3));
		return g;
	}, []);
	useFrame((_, delta) => {
		const d = Math.min(delta, .1);
		const t = performance.now() / 1e3;
		if (ref.current) {
			const s = 1 + Math.sin(t * .7) * .028;
			ref.current.scale.setScalar(s);
			ref.current.rotation.z += d * .08;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		ref,
		geometry: geom,
		rotation: [
			Math.PI / 2.15,
			0,
			0
		],
		position: [
			0,
			.08,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshPhysicalMaterial", {
			vertexColors: true,
			transmission: .72,
			thickness: .45,
			roughness: .12,
			metalness: .04,
			ior: 1.48,
			transparent: true,
			opacity: .95,
			attenuationColor: "#f4f1ea",
			attenuationDistance: 2
		})
	});
}
function ClayToken({ position, color, child }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.42,
				.42,
				.38,
				48
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .82,
				metalness: .04
			})]
		}), child === "eth" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.28,
				0
			],
			rotation: [
				0,
				Math.PI / 4,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.22, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c4b49a",
				roughness: .55
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.22,
				0
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.22,
				.035,
				12,
				40
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#2c7369",
				roughness: .5
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.22,
				0
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.12,
				.03,
				12,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#2c7369",
				roughness: .5
			})]
		})] })]
	});
}
function Scene() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#F4F1EA"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#fff6e8",
			"#c4b8a4",
			.85
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				3,
				5,
				2
			],
			intensity: 1.4,
			castShadow: true,
			color: "#fff3d8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-3,
				2,
				-2
			],
			intensity: .35,
			color: "#3d9b8f"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				-.42,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [4.5, 64] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e4d9c6",
				roughness: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayToken, {
			position: [
				-.48,
				-.18,
				0
			],
			color: "#cbb79a",
			child: "eth"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayToken, {
			position: [
				.48,
				-.18,
				0
			],
			color: "#7aa8a0",
			child: "usd"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientTorus, {})
	] });
}
function BandField({ className }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [reduce, setReduce] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduce(mq.matches);
		const on = () => setReduce(mq.matches);
		mq.addEventListener("change", on);
		return () => mq.removeEventListener("change", on);
	}, []);
	if (!ready || reduce) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/stills/bound-tokens.jpg",
		alt: "Two clay tokens bound by an amber-teal glass ring",
		className,
		style: {
			width: "100%",
			height: "100%",
			minHeight: 320,
			objectFit: "cover",
			borderRadius: 24,
			background: "#e8e2d6"
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		style: {
			borderRadius: 24,
			overflow: "hidden",
			height: "100%",
			width: "100%"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			dpr: [1, 1.75],
			camera: {
				position: [
					0,
					1.15,
					3.15
				],
				fov: 32
			},
			gl: {
				antialias: true,
				alpha: false
			},
			shadows: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
		})
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
		title: "Graduate to Uniswap.",
		body: "The buy that fills $80 seeds a constant-product pair with the remaining inventory and USDC, then burns LP to 0xdead. After that, every swap is a 0.30% Uniswap-style trade. Nobody pulls the pool.",
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
					y: 24,
					opacity: 0,
					duration: .8,
					ease: "power2.out"
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
									className: "hover:text-ink",
									children: "Markets"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/docs",
									className: "hover:text-ink",
									children: "Docs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/security",
									className: "hover:text-ink",
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
				className: "relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-5 pt-28 pb-16 md:flex-row md:items-center md:pt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-copy max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] tracking-[0.22em] text-muted uppercase",
							children: "Launch in USDC. Graduate to Uniswap."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-display text-5xl leading-[1.05] text-ink md:text-6xl",
							children: "The Arc launchpad that settles into a locked pair."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-5 max-w-md text-lg leading-relaxed text-muted",
							children: [
								"Create a token. Trade a USDC curve. At ",
								formatUsdc(GRADUATE_AT),
								" the remaining inventory and cash become a Uniswap-style pool. LP burns. Same ticket, two venues."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-10 grid grid-cols-3 gap-4 font-mono text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[11px] text-muted uppercase",
									children: "Markets"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular",
									children: stats.count
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[11px] text-muted uppercase",
									children: "On Uniswap"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular",
									children: stats.graduated
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[11px] text-muted uppercase",
									children: "Volume"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular",
									children: formatCompact(stats.volume)
								})] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[380px] min-h-[320px] w-full md:h-[520px] md:flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandField, { className: "h-full w-full rounded-[24px] shadow-[20px_20px_40px_rgba(11,15,20,0.18)]" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-5 py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.22em] text-muted uppercase",
						children: "How it works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl",
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
											className: "font-mono text-[11px] text-amber-2",
											children: s.n
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-2 font-display text-2xl",
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
							className: "font-mono text-[11px] tracking-[0.22em] text-muted uppercase",
							children: "Live in this preview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-4xl",
							children: "Markets on Arc"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app",
							className: "hidden text-sm text-teal-2 sm:block",
							children: "Open discover"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm text-muted",
						children: "Numbers are this demo book, not a published TVL. Teal Machine is one buy from Uniswap."
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
								className: "border-t border-ink/8",
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
						className: "font-mono text-[11px] tracking-[0.22em] text-muted uppercase",
						children: "Policy, not vibes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl",
						children: "The pair is the lock."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 overflow-hidden rounded-[24px] bg-paper-2 p-6 shadow-[20px_20px_40px_rgba(11,15,20,0.18)] md:p-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4",
							children: [
								["Quote", "USDC (Arc native)"],
								["Graduate", formatUsdc(GRADUATE_AT)],
								["Curve fee", "1.0% + 0.5%"],
								["Uniswap fee", "0.30%"],
								["LP", "Burned to 0xdead"],
								["Chain", "Arc Testnet 5042002"],
								["Deployer", shortAddr(DEPLOYER, 4)],
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
						children: "Pairband. Launch on Arc. Graduate to Uniswap. Testnet only until the factory is funded. No audit."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/docs",
								children: "Docs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/security",
								children: "Security"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/trade",
								children: "Trade"
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
