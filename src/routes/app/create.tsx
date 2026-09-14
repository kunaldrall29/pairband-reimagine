"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ImagePlus, Link2, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPublicClient, http } from "viem";
import { ClayButton } from "@/components/ui/clay-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { suggestTokenFromDescription } from "@/lib/ai/suggest-token";
import {
  GRADUATE_AT,
  LAUNCH_FEE_USDC,
  VIRTUAL_TOKENS,
  VIRTUAL_USDC,
} from "@/lib/engine/constants.ts";
import { previewBuy } from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import type { Launch } from "@/lib/engine/types.ts";
import { errorCopy, formatToken, formatUsdc } from "@/lib/format.ts";
import { useLiveTrade } from "@/lib/live-trade";
import { fetchOnchainLaunches } from "@/lib/onchain-launches.ts";
import { verifyTokenWebsite } from "@/lib/verify-website";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi.ts";
import { arcTestnet } from "@/lib/chains";
import { parseUnits } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/create")({ component: Create });

function emptyCurveLaunch(): Launch {
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
    protocolFees: 0n,
    creatorFees: 0n,
    holders: 0,
    volumeUsdc: 0n,
    txCount: 0,
    lastTradeAt: 0,
  };
}

async function fileToLogoDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file");
  if (file.size > 2_500_000) throw new Error("Logo must be under 2.5MB");
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
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  if (dataUrl.length > 320_000) throw new Error("Logo too large after compress — try a simpler image");
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

  const [brief, setBrief] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [websiteVerified, setWebsiteVerified] = useState(false);
  const [twitterVerified, setTwitterVerified] = useState(false);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [first, setFirst] = useState("0");
  const [onChain, setOnChain] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (live) setOnChain(true);
    else setOnChain(false);
  }, [live]);

  const hue = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const firstAmt = useMemo(() => {
    try {
      return parseUnits(first || "0", 18);
    } catch {
      return 0n;
    }
  }, [first]);

  const firstQuote = useMemo(() => {
    if (firstAmt <= 0n) return null;
    try {
      return previewBuy(emptyCurveLaunch(), firstAmt);
    } catch {
      return null;
    }
  }, [firstAmt]);

  const totalDue = LAUNCH_FEE_USDC + firstAmt;
  const verifySnippet = `<meta name="pairband:creator" content="${account}" />`;

  async function onGenerate(e: React.FormEvent) {
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
      toast.success(
        result.source === "grok"
          ? "Token draft ready — review and launch."
          : "Draft ready (local fallback) — review and launch.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setAiBusy(false);
    }
  }

  async function onLogo(file: File | null) {
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
      const result = await verifyTokenWebsite({
        data: {
          website: website.trim(),
          creator: account,
          twitter: twitter.trim() || undefined,
        },
      });
      if (!result.ok) {
        toast.error(result.error || "Could not fetch website");
        setWebsiteVerified(false);
        return;
      }
      setWebsiteVerified(result.verified);
      if (result.foundTwitter) setTwitterVerified(true);
      if (result.verified) {
        toast.success(
          result.foundTwitter
            ? "Website verified · X handle found on site"
            : "Website verified — pairband:creator meta matches your wallet",
        );
      } else {
        toast.message("Add the meta tag below to your site, then verify again.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verify failed");
    } finally {
      setVerifyBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onChain && totalDue > usdcBalance) {
      toast.error(`Need ${formatUsdc(totalDue)} USDC on Arc (launch fee + first buy).`);
      return;
    }
    const meta = {
      imageUrl,
      website: website.trim() || undefined,
      twitter: twitter.trim().replace(/^@/, "") || undefined,
      telegram: telegram.trim().replace(/^@/, "") || undefined,
      websiteVerified,
      twitterVerified,
    };
    if (onChain && live) {
      try {
        const result = await createToken(name.trim(), symbol.trim().toUpperCase());
        // Mirror logo/socials locally without charging the demo launch fee again.
        create(name, symbol, description || `${name} on Arc`, 0n, { ...meta, skipFee: true });
        try {
          const client = createPublicClient({
            chain: arcTestnet,
            transport: http(ARC_TESTNET_DEPLOYMENT.rpc ?? "https://rpc.testnet.arc.io"),
          });
          const rows = await fetchOnchainLaunches(client);
          upsertOnchainLaunches(rows.map((r) => r.launch));
        } catch {
          /* navigate even if index sync lags */
        }
        if (result.launchId != null) {
          void navigate({ to: "/app/t/$id", params: { id: String(result.launchId) } });
        } else {
          toast.message("Token created on Arc — open Discover after indexing");
          void navigate({ to: "/app" });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Create failed");
      }
      return;
    }
    const id = create(name, symbol, description, firstAmt, meta);
    if (id) void navigate({ to: "/app/t/$id", params: { id } });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 pb-10">
      <p className="font-mono text-[11px] tracking-[0.18em] text-teal uppercase">Launch</p>
      <h1 className="text-4xl tracking-tight">Create a token</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        One billion supply. Bonding curve quoted in USDC on Arc. Launch costs {formatUsdc(LAUNCH_FEE_USDC)} USDC. Add a
        logo, website, and X — verify the site like pump.fun-style creator proofs.
      </p>

      <form onSubmit={onGenerate} className="mt-8 space-y-3">
        <GlassPanel className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-teal" aria-hidden />
            Describe your token
          </div>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="e.g. A community token for indie game devs who ship weekly builds and share revenue on Arc."
            className="w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
          />
          <ClayButton type="submit" variant="secondary" className="w-full" disabled={aiBusy || brief.trim().length < 8}>
            {aiBusy ? "Generating…" : "Generate name & symbol with AI"}
          </ClayButton>
          <p className="text-xs text-muted">AI fills the form below — you confirm before launch. One click per idea.</p>
        </GlassPanel>
      </form>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <GlassPanel className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Token logo</p>
              <p className="mt-0.5 text-xs text-muted">Square image works best · PNG, JPG, or WebP · under 2.5MB</p>
            </div>
            {imageUrl ? (
              <button
                type="button"
                onClick={() => {
                  setImageUrl(undefined);
                  if (logoInputRef.current) logoInputRef.current.value = "";
                  toast.message("Logo removed");
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted hover:bg-ink/5 dark:hover:bg-paper/10"
              >
                <Trash2 size={14} />
                Remove
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="group relative mx-auto flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-ink/20 bg-ink/[0.03] transition hover:border-teal hover:bg-teal/5 sm:mx-0 dark:border-paper/20 dark:bg-paper/5"
              aria-label={imageUrl ? "Change token logo" : "Upload token logo"}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Token logo preview" className="size-full object-cover" />
              ) : (
                <TokenGlyph symbol={symbol || "??"} hue={hue} size={72} />
              )}
              <span className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-ink text-paper shadow-md dark:bg-paper dark:text-ink">
                <ImagePlus size={16} />
              </span>
            </button>

            <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
              <div>
                <p className="font-medium">{name || "Token name"}</p>
                <p className="font-mono text-xs text-muted">{(symbol || "TICKER").toUpperCase()} / USDC</p>
                <p className="mt-1 text-xs text-muted">
                  {imageUrl ? "Custom logo selected — shown on Discover and the token page" : "No logo yet — optional but recommended"}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <ClayButton
                  type="button"
                  variant={imageUrl ? "secondary" : "primary"}
                  className="w-full sm:w-auto"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <ImagePlus size={16} />
                  {imageUrl ? "Change logo" : "Upload logo"}
                </ClayButton>
              </div>              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/*"
                className="sr-only"
                onChange={(e) => {
                  void onLogo(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-2 p-4 text-sm">
          <p className="font-medium">Fees (USDC on Arc)</p>
          <dl className="space-y-1 font-mono text-xs text-muted">
            <div className="flex justify-between gap-4">
              <dt>Launch fee</dt>
              <dd className="text-ink">{formatUsdc(LAUNCH_FEE_USDC)}</dd>
            </div>
            {firstAmt > 0n ? (
              <div className="flex justify-between gap-4">
                <dt>First buy (preview)</dt>
                <dd className="text-ink">{formatUsdc(firstAmt)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4 border-t border-ink/8 pt-2 font-medium text-ink dark:border-paper/10">
              <dt>Total due</dt>
              <dd>{formatUsdc(totalDue)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Your Arc USDC ({account.slice(0, 6)}…)</dt>
              <dd className={usdcBalance < totalDue ? "text-danger" : "text-teal"}>{formatUsdc(usdcBalance)}</dd>
            </div>
          </dl>
        </GlassPanel>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Name</span>
          <input
            required
            minLength={2}
            maxLength={32}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Symbol</span>
          <input
            required
            minLength={2}
            maxLength={12}
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">What is this token?</span>
          <textarea
            required={!onChain}
            maxLength={280}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="One or two sentences — narrative, utility, meme, community."
            className="w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
          />
        </label>

        <GlassPanel className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link2 className="size-4 text-teal" />
            Socials & website
          </div>
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-muted">Website</span>
            <input
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                setWebsiteVerified(false);
              }}
              placeholder="https://yoursite.com"
              className="h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
            />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-muted">X / Twitter</span>
            <input
              value={twitter}
              onChange={(e) => {
                setTwitter(e.target.value.replace(/^@/, ""));
                setTwitterVerified(false);
              }}
              placeholder="handle"
              className="h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
            />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-muted">Telegram (optional)</span>
            <input
              value={telegram}
              onChange={(e) => setTelegram(e.target.value.replace(/^@/, ""))}
              placeholder="group or channel"
              className="h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
            />
          </label>
          <div className="rounded-2xl bg-ink/5 p-3 font-mono text-[11px] break-all dark:bg-paper/10">
            {verifySnippet}
          </div>
          <p className="text-xs text-muted">
            Add that meta tag (or plain text <span className="font-mono">pairband-verify:{account}</span>) to your
            homepage HTML. Pairband fetches the page live and checks it matches your wallet.
          </p>
          <div className="flex flex-wrap gap-2">
            <ClayButton type="button" variant="secondary" disabled={verifyBusy || !website.trim()} onClick={() => void onVerifyWebsite()}>
              {verifyBusy ? "Checking…" : "Verify website"}
            </ClayButton>
            <ClayButton
              type="button"
              variant="ghost"
              disabled={!twitter.trim()}
              onClick={() => {
                setTwitterVerified(true);
                toast.success("X handle linked on this launch (shown on the token page)");
              }}
            >
              Link X handle
            </ClayButton>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {websiteVerified ? (
              <span className="inline-flex items-center gap-1 text-teal">
                <CheckCircle2 size={14} /> Website verified
              </span>
            ) : null}
            {twitterVerified ? (
              <span className="inline-flex items-center gap-1 text-teal">
                <CheckCircle2 size={14} /> X linked
              </span>
            ) : null}
          </div>
        </GlassPanel>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">First buy (USDC, optional · preview)</span>
          <input
            value={first}
            onChange={(e) => setFirst(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            disabled={onChain}
            className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono outline-none focus:border-teal disabled:opacity-50 dark:border-paper/15 dark:bg-ink-2"
          />
          {firstQuote ? (
            <p className="mt-1 text-xs text-muted">
              Seeds about {formatToken(firstQuote.tokensOut, 0)} tokens onto your wallet.
            </p>
          ) : null}
        </label>
        {live ? (
          <label className="flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={onChain}
              onChange={(e) => setOnChain(e.target.checked)}
              className="size-4 rounded border-ink/20"
            />
            Broadcast create to Arc testnet launchpad ($1 USDC fee on-chain)
          </label>
        ) : null}
        {lastError ? <p className="text-sm text-danger">{errorCopy(lastError)}</p> : null}
        <ClayButton type="submit" className="w-full" disabled={busy}>
          {busy ? "Confirm in wallet…" : onChain ? "Launch on Arc testnet" : `Launch · ${formatUsdc(LAUNCH_FEE_USDC)} fee`}
        </ClayButton>
        <p className="text-xs leading-relaxed text-muted">
          Logo and socials are stored with the launch in-app. Website verification is live HTML fetch for the
          pairband:creator meta (or pairband-verify text). Uncheck broadcast to keep a full local preview with metadata.
        </p>
      </form>
    </div>
  );
}
