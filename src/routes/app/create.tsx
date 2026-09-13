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

export const Route = createFileRoute("/app/create")({ component: Create });

function Create() {
  const navigate = useNavigate();
  const create = useLaunchpad((s) => s.create);
  const lastError = useLaunchpad((s) => s.lastError);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [first, setFirst] = useState("0");

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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = create(name, symbol, description, firstAmt);
    if (id) void navigate({ to: "/app/t/$id", params: { id } });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Launch</p>
      <h1 className="font-display text-4xl tracking-tight">Create a token</h1>
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
            required
            maxLength={280}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">First buy (USDC, optional)</span>
          <input
            value={first}
            onChange={(e) => setFirst(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
          />
          {firstQuote ? (
            <p className="mt-1 text-xs text-muted">
              Seeds about {formatToken(firstQuote.tokensOut, 0)} tokens onto your wallet.
            </p>
          ) : null}
        </label>
        {lastError ? <p className="text-sm text-danger">{errorCopy(lastError)}</p> : null}
        <ClayButton type="submit" className="w-full">
          Launch on Arc
        </ClayButton>
        <p className="text-xs leading-relaxed text-muted">
          After graduation, swaps use Uniswap constant-product math (0.30%). LP cannot be withdrawn. This preview
          executes locally until the factory is funded on Arc Testnet.
        </p>
      </form>
    </div>
  );
}
