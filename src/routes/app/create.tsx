"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClayButton } from "@/components/ui/clay-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { GRADUATE_AT, TOTAL_SUPPLY, WAD } from "@/lib/engine/constants.ts";
import { previewBuy } from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { errorCopy, formatToken, formatUsdc } from "@/lib/format.ts";
import { parseUnits } from "@/lib/utils";
import { useLiveTrade } from "@/lib/live-trade";
import { toast } from "sonner";

export const Route = createFileRoute("/app/create")({ component: Create });

function Create() {
  const navigate = useNavigate();
  const create = useLaunchpad((s) => s.create);
  const lastError = useLaunchpad((s) => s.lastError);
  const { live, busy, createToken } = useLiveTrade();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [first, setFirst] = useState("0");
  const [onChain, setOnChain] = useState(false);

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
      return previewBuy(
        {
          status: "curve",
          virtualUsdc: 80n * WAD,
          virtualTokens: TOTAL_SUPPLY,
        } as never,
        firstAmt,
      );
    } catch {
      return null;
    }
  }, [firstAmt]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onChain && live) {
      try {
        await createToken(name.trim(), symbol.trim().toUpperCase());
        toast.message("Token created on Arc — open Discover after indexing");
        void navigate({ to: "/app" });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Create failed");
      }
      return;
    }
    const id = create(name, symbol, description, firstAmt);
    if (id) void navigate({ to: "/app/t/$id", params: { id } });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="font-mono text-[11px] tracking-[0.18em] text-teal uppercase">Launch</p>
      <h1 className="text-4xl tracking-tight">Create a token</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        One billion supply. Bonding curve quoted in USDC on Arc. The buy that fills {formatUsdc(GRADUATE_AT)} seeds a
        Uniswap pair and burns the LP. You keep 0.5% of curve volume.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <GlassPanel className="flex items-center gap-4 p-4">
          <TokenGlyph symbol={symbol || "??"} hue={hue} size={56} />
          <div>
            <p className="font-medium">{name || "Token name"}</p>
            <p className="font-mono text-xs text-muted">{(symbol || "TICKER").toUpperCase()} / USDC</p>
          </div>
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
          <span className="mb-1 block text-xs font-medium text-muted">Description</span>
          <textarea
            required={!onChain}
            maxLength={280}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
          />
        </label>
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
            Broadcast create to Arc testnet launchpad
          </label>
        ) : null}
        {lastError ? <p className="text-sm text-danger">{errorCopy(lastError)}</p> : null}
        <ClayButton type="submit" className="w-full" disabled={busy}>
          {busy ? "Confirm in wallet…" : onChain ? "Launch on Arc testnet" : "Launch in preview"}
        </ClayButton>
        <p className="text-xs leading-relaxed text-muted">
          After graduation, swaps use Uniswap constant-product math (0.30%). LP cannot be withdrawn. Preview executes
          locally; connected wallets can broadcast to the live testnet factory.
        </p>
      </form>
    </div>
  );
}
