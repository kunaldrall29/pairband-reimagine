import { o as __toESM } from "../_runtime.mjs";
import { b as VIRTUAL_TOKENS, h as LAUNCH_FEE_USDC, x as VIRTUAL_USDC } from "./constants-CT0WK1Sd.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as useLaunchpad, _ as previewBuy } from "./store-BwIaYuXO.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as string, i as object } from "../_libs/zod.mjs";
import { _ as ExternalLink, b as CircleCheck, g as Globe, h as ImagePlus, i as Trash2, m as Link2, s as Sparkles, v as Copy } from "../_libs/lucide-react.mjs";
import { _ as parseUnits, c as formatUsdc, f as GlassPanel, i as errorCopy, s as formatToken } from "./router-DYi0iHDD.mjs";
import { t as ClayButton } from "./clay-button-16tkSY36.mjs";
import { t as TokenGlyph } from "./token-glyph-CtI3byco.mjs";
import { i as http, t as createPublicClient } from "../_libs/viem.mjs";
import { n as arcTestnet, t as ARC_TESTNET_DEPLOYMENT } from "./wagmi-C1bmYj8R.mjs";
import { n as fetchOnchainLaunches } from "./onchain-launches-BACo-5UB.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C1p7zOu_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useLiveTrade } from "./live-trade-C44aCdZg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-BPsKwDIn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
createServerFn({ method: "GET" }).handler(createSsrRpc("d49b5f05a526274697fe25bb5c47da3ad5a5829b11d4ae7715de1596c030cb99"));
var briefSchema = object({ brief: string().trim().min(8, "Describe your token in at least 8 characters.").max(500, "Keep the brief under 500 characters.") });
object({
	name: string().trim().min(2).max(32),
	symbol: string().trim().toUpperCase().regex(/^[A-Z0-9]{2,12}$/),
	description: string().trim().min(12).max(280)
});
var suggestTokenFromDescription = createServerFn({ method: "POST" }).validator((data) => briefSchema.parse(data)).handler(createSsrRpc("06a62b3267dd6dc5c59f05ecb34c44f6983a9530940bd1e6a4c8e5cd54070d7d"));
/**
* Fetch a creator website and look for Pairband verification markers:
* - <meta name="pairband:creator" content="0x…">
* - <meta name="pairband:twitter" content="handle">
* - plain text `pairband-verify:0x…`
* Optionally confirm an X handle appears on the page.
*/
var verifySchema = object({
	website: string().min(4).max(300),
	creator: string().min(6).max(66),
	twitter: string().max(40).optional()
});
var verifyTokenWebsite = createServerFn({ method: "POST" }).validator((data) => verifySchema.parse(data)).handler(createSsrRpc("190f082a97ea147b4fda13151c0c7fd32f17ed75edd1cddc32351ce40a106cc8"));
function emptyCurveLaunch() {
	return {
		id: "preview",
		token: "0x0",
		curve: "0x0",
		pair: null,
		book: null,
		name: "",
		symbol: "",
		description: "",
		hue: 0,
		creator: "",
		createdAt: 0,
		status: "curve",
		virtualUsdc: VIRTUAL_USDC,
		virtualTokens: VIRTUAL_TOKENS,
		realUsdc: 0n,
		tokensSold: 0n,
		reserveUsdc: 0n,
		reserveToken: 0n,
		lpSupply: 0n,
		lpBurned: 0n,
		graduatedAt: null,
		stageAAt: null,
		stageBAt: null,
		uniqueBuyers: [],
		protocolFees: 0n,
		creatorFees: 0n,
		holders: 0,
		volumeUsdc: 0n,
		txCount: 0,
		lastTradeAt: 0
	};
}
async function fileToLogoDataUrl(file) {
	if (!file.type.startsWith("image/")) throw new Error("Choose an image file");
	if (file.size > 25e5) throw new Error("Logo must be under 2.5MB");
	const bitmap = await createImageBitmap(file);
	const size = 256;
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	const scale = Math.max(size / bitmap.width, size / bitmap.height);
	const w = bitmap.width * scale;
	const h = bitmap.height * scale;
	ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
	const dataUrl = canvas.toDataURL("image/jpeg", .82);
	if (dataUrl.length > 32e4) throw new Error("Logo too large after compress — try a simpler image");
	return dataUrl;
}
function Create() {
	const navigate = useNavigate();
	const create = useLaunchpad((s) => s.create);
	const upsertOnchainLaunches = useLaunchpad((s) => s.upsertOnchainLaunches);
	const lastError = useLaunchpad((s) => s.lastError);
	const account = useLaunchpad((s) => s.account);
	const usdcBalance = useLaunchpad((s) => s.engine.usdc[s.account] ?? 0n);
	const { live, busy, createToken } = useLiveTrade();
	const [brief, setBrief] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [symbol, setSymbol] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [imageUrl, setImageUrl] = (0, import_react.useState)();
	const [website, setWebsite] = (0, import_react.useState)("");
	const [twitter, setTwitter] = (0, import_react.useState)("");
	const [telegram, setTelegram] = (0, import_react.useState)("");
	const [discord, setDiscord] = (0, import_react.useState)("");
	const [websiteVerified, setWebsiteVerified] = (0, import_react.useState)(false);
	const [twitterVerified, setTwitterVerified] = (0, import_react.useState)(false);
	const [verifyBusy, setVerifyBusy] = (0, import_react.useState)(false);
	const [verifyXBusy, setVerifyXBusy] = (0, import_react.useState)(false);
	const [first, setFirst] = (0, import_react.useState)("0");
	const [onChain, setOnChain] = (0, import_react.useState)(false);
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	const logoInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (live) setOnChain(true);
		else setOnChain(false);
	}, [live]);
	const hue = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
	const firstAmt = (0, import_react.useMemo)(() => {
		try {
			return parseUnits(first || "0", 18);
		} catch {
			return 0n;
		}
	}, [first]);
	const firstQuote = (0, import_react.useMemo)(() => {
		if (firstAmt <= 0n) return null;
		try {
			return previewBuy(emptyCurveLaunch(), firstAmt);
		} catch {
			return null;
		}
	}, [firstAmt]);
	const totalDue = LAUNCH_FEE_USDC + firstAmt;
	const verifySnippet = `<meta name="pairband:creator" content="${account}" />`;
	const twitterMetaSnippet = twitter.trim() ? `<meta name="pairband:twitter" content="${twitter.trim().replace(/^@/, "")}" />` : `<meta name="pairband:twitter" content="yourhandle" />`;
	const xChallenge = `pairband-x:${account.slice(2, 10).toLowerCase()}`;
	async function copyText(label, text) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(`${label} copied`);
		} catch {
			toast.message(text);
		}
	}
	async function onGenerate(e) {
		e.preventDefault();
		if (brief.trim().length < 8) {
			toast.error("Describe your idea in at least 8 characters.");
			return;
		}
		setAiBusy(true);
		try {
			const result = await suggestTokenFromDescription({ data: { brief: brief.trim() } });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			setName(result.suggestion.name);
			setSymbol(result.suggestion.symbol);
			setDescription(result.suggestion.description);
			toast.success(result.source === "grok" ? "Token draft ready — review and launch." : "Draft ready (local fallback) — review and launch.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI generation failed");
		} finally {
			setAiBusy(false);
		}
	}
	async function onLogo(file) {
		if (!file) return;
		try {
			const url = await fileToLogoDataUrl(file);
			setImageUrl(url);
			toast.success("Logo ready");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Logo upload failed");
		}
	}
	async function onVerifyWebsite() {
		if (!website.trim()) {
			toast.error("Add a website URL first.");
			return;
		}
		setVerifyBusy(true);
		try {
			const result = await verifyTokenWebsite({ data: {
				website: website.trim(),
				creator: account,
				twitter: twitter.trim() || void 0
			} });
			if (!result.ok) {
				toast.error(result.error || "Could not fetch website");
				setWebsiteVerified(false);
				return;
			}
			setWebsiteVerified(result.verified);
			if (result.verified && (result.twitterMetaMatch || result.foundTwitter)) setTwitterVerified(true);
			if (result.verified) toast.success(result.twitterMetaMatch ? "Website + X meta verified" : result.foundTwitter ? "Website verified · X handle found on site" : "Website verified — pairband:creator matches your wallet");
			else toast.message("Add the meta tag below to your site HTML, then verify again.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Verify failed");
		} finally {
			setVerifyBusy(false);
		}
	}
	async function onVerifyX() {
		if (!twitter.trim()) {
			toast.error("Add your X handle first.");
			return;
		}
		if (!website.trim()) {
			toast.error("Add a website with the pairband meta tags so we can verify X live.");
			return;
		}
		setVerifyXBusy(true);
		try {
			const result = await verifyTokenWebsite({ data: {
				website: website.trim(),
				creator: account,
				twitter: twitter.trim()
			} });
			if (!result.ok) {
				toast.error(result.error || "Could not fetch website");
				setTwitterVerified(false);
				return;
			}
			if (!result.verified) {
				toast.message("Verify the website creator meta first, then verify X.");
				setWebsiteVerified(false);
				setTwitterVerified(false);
				return;
			}
			setWebsiteVerified(true);
			if (result.twitterMetaMatch || result.foundTwitter) {
				setTwitterVerified(true);
				toast.success(result.twitterMetaMatch ? "X verified via pairband:twitter meta" : "X verified — handle found on your verified website");
			} else {
				setTwitterVerified(false);
				toast.message(`Add ${twitterMetaSnippet} (or link to x.com/${twitter.trim().replace(/^@/, "")}) on the site, then retry.`);
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "X verify failed");
		} finally {
			setVerifyXBusy(false);
		}
	}
	function openXVerifyTweet() {
		const handle = twitter.trim().replace(/^@/, "");
		const text = [
			symbol ? `Launching $${symbol} on Pairband.` : "Launching on Pairband.",
			`Creator verify: ${xChallenge}`,
			handle ? `@${handle}` : "",
			"https://pairband.com"
		].filter(Boolean).join(" ");
		window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (!onChain && totalDue > usdcBalance) {
			toast.error(`Need ${formatUsdc(totalDue)} USDC on Arc (launch fee + first buy).`);
			return;
		}
		const meta = {
			imageUrl,
			website: website.trim() || void 0,
			twitter: twitter.trim().replace(/^@/, "") || void 0,
			telegram: telegram.trim().replace(/^@/, "") || void 0,
			discord: discord.trim() || void 0,
			websiteVerified,
			twitterVerified
		};
		if (onChain && live) {
			try {
				const result = await createToken(name.trim(), symbol.trim().toUpperCase());
				create(name, symbol, description || `${name} on Arc`, 0n, {
					...meta,
					skipFee: true
				});
				try {
					const client = createPublicClient({
						chain: arcTestnet,
						transport: http(ARC_TESTNET_DEPLOYMENT.rpc ?? "https://rpc.testnet.arc.io")
					});
					const rows = await fetchOnchainLaunches(client);
					upsertOnchainLaunches(rows.map((r) => r.launch));
				} catch {}
				if (result.launchId != null) navigate({
					to: "/app/t/$id",
					params: { id: String(result.launchId) }
				});
				else {
					toast.message("Token created on Arc — open Discover after indexing");
					navigate({ to: "/app" });
				}
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Create failed");
			}
			return;
		}
		const id = create(name, symbol, description, firstAmt, meta);
		if (id) navigate({
			to: "/app/t/$id",
			params: { id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-8 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] tracking-[0.18em] text-teal uppercase",
				children: "Launch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl tracking-tight",
				children: "Create a token"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: [
					"One billion supply. Bonding curve quoted in USDC on Arc. Launch costs ",
					formatUsdc(LAUNCH_FEE_USDC),
					" USDC. Add a logo, website, and X — verify the site like pump.fun-style creator proofs."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: onGenerate,
				className: "mt-8 space-y-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
					className: "space-y-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								className: "size-4 text-teal",
								"aria-hidden": true
							}), "Describe your token"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: brief,
							onChange: (e) => setBrief(e.target.value),
							maxLength: 500,
							rows: 3,
							placeholder: "e.g. A community token for indie game devs who ship weekly builds and share revenue on Arc.",
							className: "w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
							type: "submit",
							variant: "secondary",
							className: "w-full",
							disabled: aiBusy || brief.trim().length < 8,
							children: aiBusy ? "Generating…" : "Generate name & symbol with AI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "AI fills the form below — you confirm before launch. One click per idea."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "space-y-4 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Token logo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted",
								children: "Square image works best · PNG, JPG, or WebP · under 2.5MB"
							})] }), imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setImageUrl(void 0);
									if (logoInputRef.current) logoInputRef.current.value = "";
									toast.message("Logo removed");
								},
								className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted hover:bg-ink/5 dark:hover:bg-paper/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 }), "Remove"]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => logoInputRef.current?.click(),
								className: "group relative mx-auto flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-ink/20 bg-ink/[0.03] transition hover:border-teal hover:bg-teal/5 sm:mx-0 dark:border-paper/20 dark:bg-paper/5",
								"aria-label": imageUrl ? "Change token logo" : "Upload token logo",
								children: [imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: imageUrl,
									alt: "Token logo preview",
									className: "size-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
									symbol: symbol || "??",
									hue,
									size: 72
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-ink text-paper shadow-md dark:bg-paper dark:text-ink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { size: 16 })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 space-y-3 text-center sm:text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: name || "Token name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-xs text-muted",
											children: [(symbol || "TICKER").toUpperCase(), " / USDC"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: imageUrl ? "Custom logo selected — shown on Discover and the token page" : "No logo yet — optional but recommended"
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col gap-2 sm:flex-row",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
											type: "button",
											variant: imageUrl ? "secondary" : "primary",
											className: "w-full sm:w-auto",
											onClick: () => logoInputRef.current?.click(),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { size: 16 }), imageUrl ? "Change logo" : "Upload logo"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: logoInputRef,
										type: "file",
										accept: "image/png,image/jpeg,image/webp,image/gif,image/*",
										className: "sr-only",
										onChange: (e) => {
											onLogo(e.target.files?.[0] ?? null);
											e.target.value = "";
										}
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "space-y-2 p-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Fees (USDC on Arc)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-1 font-mono text-xs text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Launch fee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-ink",
										children: formatUsdc(LAUNCH_FEE_USDC)
									})]
								}),
								firstAmt > 0n ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "First buy (preview)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-ink",
										children: formatUsdc(firstAmt)
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4 border-t border-ink/8 pt-2 font-medium text-ink dark:border-paper/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total due" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatUsdc(totalDue) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [
										"Your Arc USDC (",
										account.slice(0, 6),
										"…)"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: usdcBalance < totalDue ? "text-danger" : "text-teal",
										children: formatUsdc(usdcBalance)
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-xs font-medium text-muted",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							minLength: 2,
							maxLength: 32,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-xs font-medium text-muted",
							children: "Symbol"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							minLength: 2,
							maxLength: 12,
							value: symbol,
							onChange: (e) => setSymbol(e.target.value.toUpperCase()),
							className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mb-1 flex items-center justify-between text-xs font-medium text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "What is this token?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums",
								children: [description.length, "/280"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: !onChain,
							maxLength: 280,
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 3,
							placeholder: "One or two sentences — narrative, utility, meme, community. (Shown on Discover like pump.fun.)",
							className: "w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "space-y-4 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4 text-teal" }), "Socials & verification"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: "Same idea as pump.fun / Futardio: set links at create time, prove the website is yours with live HTML checks."
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mb-1 flex items-center gap-1.5 font-medium text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { size: 12 }), " Website"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: website,
									onChange: (e) => {
										setWebsite(e.target.value);
										setWebsiteVerified(false);
										setTwitterVerified(false);
									},
									placeholder: "https://yoursite.com",
									className: "h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 rounded-2xl border border-ink/8 bg-ink/[0.03] p-3 dark:border-paper/10 dark:bg-paper/5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium",
										children: "1. Add this to your site <head>"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "flex-1 rounded-xl bg-paper px-3 py-2 font-mono text-[11px] break-all dark:bg-ink-2",
											children: verifySnippet
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
											type: "button",
											variant: "ghost",
											className: "min-h-9 shrink-0 px-3",
											onClick: () => void copyText("Creator meta", verifySnippet),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 14 })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "flex-1 rounded-xl bg-paper px-3 py-2 font-mono text-[11px] break-all dark:bg-ink-2",
											children: twitterMetaSnippet
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
											type: "button",
											variant: "ghost",
											className: "min-h-9 shrink-0 px-3",
											onClick: () => void copyText("X meta", twitterMetaSnippet),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 14 })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] leading-relaxed text-muted",
										children: [
											"Or plain text anywhere on the page:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono",
												children: ["pairband-verify:", account]
											}),
											". Pairband fetches the URL live (no cache) and checks the wallet + X handle."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
										type: "button",
										variant: "secondary",
										className: "w-full",
										disabled: verifyBusy || !website.trim(),
										onClick: () => void onVerifyWebsite(),
										children: verifyBusy ? "Fetching site…" : websiteVerified ? "Re-verify website" : "Verify website live"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-medium text-muted",
									children: "X / Twitter"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex h-11 items-center rounded-2xl border border-ink/10 bg-ink/5 px-3 font-mono text-sm dark:border-paper/15 dark:bg-paper/10",
										children: "@"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: twitter,
										onChange: (e) => {
											setTwitter(e.target.value.replace(/^@/, ""));
											setTwitterVerified(false);
										},
										placeholder: "handle",
										className: "h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ClayButton, {
									type: "button",
									variant: "secondary",
									className: "flex-1",
									disabled: !twitter.trim(),
									onClick: openXVerifyTweet,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 14 }), "Post verify tweet"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
									type: "button",
									variant: "secondary",
									className: "flex-1",
									disabled: verifyXBusy || !twitter.trim() || !website.trim(),
									onClick: () => void onVerifyX(),
									children: verifyXBusy ? "Checking…" : twitterVerified ? "Re-verify X" : "Verify X via website"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] leading-relaxed text-muted",
								children: [
									"Tweet includes challenge ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: xChallenge
									}),
									". We confirm X by finding your handle (or ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: "pairband:twitter"
									}),
									" meta) on the same site that proves your wallet."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block font-medium text-muted",
										children: "Telegram"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: telegram,
										onChange: (e) => setTelegram(e.target.value.replace(/^@/, "")),
										placeholder: "group or channel",
										className: "h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block font-medium text-muted",
										children: "Discord"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: discord,
										onChange: (e) => setDiscord(e.target.value),
										placeholder: "invite link or server",
										className: "h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3 text-xs",
								children: [websiteVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-teal/15 px-2.5 py-1 text-teal",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 14 }), " Website verified"]
								}) : website.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-ink/5 px-2.5 py-1 text-muted dark:bg-paper/10",
									children: "Website pending"
								}) : null, twitterVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-teal/15 px-2.5 py-1 text-teal",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 14 }), " X verified"]
								}) : twitter.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-ink/5 px-2.5 py-1 text-muted dark:bg-paper/10",
									children: "X pending"
								}) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassPanel, {
						className: "space-y-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Launch preview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenGlyph, {
								symbol: symbol || "??",
								hue,
								size: 48,
								imageUrl
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: name || "Token name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-xs text-muted",
										children: [(symbol || "TICKER").toUpperCase(), " / USDC"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-xs text-muted",
										children: description || "Your “what is this token?” blurb shows here."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-2 text-[11px]",
										children: [
											website.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: websiteVerified ? "text-teal" : "text-muted",
												children: [websiteVerified ? "✓ " : "", "Website"]
											}) : null,
											twitter.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: twitterVerified ? "text-teal" : "text-muted",
												children: [
													twitterVerified ? "✓ " : "",
													"@",
													twitter.trim().replace(/^@/, "")
												]
											}) : null,
											telegram.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted",
												children: "TG"
											}) : null,
											discord.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted",
												children: "Discord"
											}) : null
										]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-xs font-medium text-muted",
								children: "First buy (USDC, optional · preview)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: first,
								onChange: (e) => setFirst(e.target.value.replace(/[^0-9.]/g, "")),
								inputMode: "decimal",
								disabled: onChain,
								className: "h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono outline-none focus:border-teal disabled:opacity-50 dark:border-paper/15 dark:bg-ink-2"
							}),
							firstQuote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									"Seeds about ",
									formatToken(firstQuote.tokensOut, 0),
									" tokens onto your wallet."
								]
							}) : null
						]
					}),
					live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: onChain,
							onChange: (e) => setOnChain(e.target.checked),
							className: "size-4 rounded border-ink/20"
						}), "Broadcast create to Arc testnet launchpad ($1 USDC fee on-chain)"]
					}) : null,
					lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: errorCopy(lastError)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClayButton, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Confirm in wallet…" : onChain ? "Launch on Arc testnet" : `Launch · ${formatUsdc(LAUNCH_FEE_USDC)} fee`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs leading-relaxed text-muted",
						children: [
							"Logo, blurb, and socials are saved with the launch (immutable after create, pump.fun-style). Website / X verification is a live HTML fetch for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: "pairband:creator"
							}),
							" and",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: "pairband:twitter"
							}),
							" meta tags."
						]
					})
				]
			})
		]
	});
}
//#endregion
export { Create as component };
