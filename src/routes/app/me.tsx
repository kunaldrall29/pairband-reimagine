"use client";

import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ClayButton } from "@/components/ui/clay-button";
import { CCTP_CHAINS, ARC_CCTP_DOMAIN, isArc } from "@/lib/engine/cctp.ts";
import { DEMO_USER, FAUCET_AMOUNT, WAD } from "@/lib/engine/constants.ts";
import { priceOf, sourceBalance, tokenBalance, usdcBalance } from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { errorCopy, formatPriceWad, formatToken, formatUsdc } from "@/lib/format.ts";
import { parseUnits, shortAddr } from "@/lib/utils";
import { ArcMark } from "@/components/ui/arc-mark";
import { UsdcMark } from "@/components/ui/usdc-mark";

export const Route = createFileRoute("/app/me")({ component: Me });

function Me() {
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  const account = useLaunchpad((s) => s.account);
  const faucet = useLaunchpad((s) => s.faucet);
  const lastError = useLaunchpad((s) => s.lastError);
  const watchlist = useLaunchpad((s) => s.watchlist);
  const bridgeOut = useLaunchpad((s) => s.bridgeOut);
  void version;

  const usdc = usdcBalance(engine, account);
  const [dest, setDest] = useState(0);
  const [raw, setRaw] = useState("100");
  const parsed = useMemo(() => {
    try {
      return parseUnits(raw || "0", 18);
    } catch {
      return 0n;
    }
  }, [raw]);

  const positions = engine.launches
    .map((l) => ({ launch: l, amount: tokenBalance(engine, l.id, account) }))
    .filter((p) => p.amount > 0n);
  const created = engine.launches.filter((l) => l.creator === account);
  const watched = engine.launches.filter((l) => watchlist.includes(l.id));
  const value = positions.reduce((acc, p) => {
    const px = priceOf(p.launch);
    return acc + (p.amount * px) / WAD;
  }, 0n);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Wallet</p>
      <h1 className="font-display text-4xl tracking-tight">Your book</h1>
      <p className="mt-1 font-mono text-xs text-muted">
        {shortAddr(account, 6)} · curve tokens settle on Arc · USDC is gas and quote
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <GlassPanel className="p-5">
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase">
            <UsdcMark size={12} /> Arc USDC
          </p>
          <p className="mt-1 font-mono text-2xl tabular">{formatUsdc(usdc)}</p>
          <p className="mt-1 text-xs text-muted">Connected wallets show on-chain USDC. The faucet only credits the local demo account.</p>
          <ClayButton className="mt-4" variant="secondary" onClick={() => faucet()}>
            Faucet {formatUsdc(FAUCET_AMOUNT, 0)}
          </ClayButton>
          {lastError ? <p className="mt-2 text-xs text-danger">{errorCopy(lastError)}</p> : null}
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="font-mono text-[11px] text-muted uppercase">Token mark</p>
          <p className="mt-1 font-mono text-2xl tabular">{formatUsdc(value)}</p>
          <p className="mt-1 text-xs text-muted">
            {positions.length} positions · {created.length} launched
          </p>
        </GlassPanel>
      </div>

      <GlassPanel className="mt-4 p-5">
        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase">
          <UsdcMark size={12} /> USDC by chain
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CCTP_CHAINS.map((c) => (
            <li key={c.domain} className="rounded-2xl bg-ink/5 px-3 py-2 dark:bg-paper/5">
              <p className="inline-flex items-center gap-1 font-mono text-[10px] text-muted uppercase">
                {isArc(c.domain) ? <ArcMark size={10} /> : <UsdcMark size={10} />}
                {c.short}
              </p>
              <p className="font-mono text-sm tabular">{formatUsdc(sourceBalance(engine, account, c.domain), 0)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          Buy from any of these. CCTP burns source USDC and mints on Arc (domain {ARC_CCTP_DOMAIN}).
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="text-xs text-muted">
            Bridge out
            <select
              className="ml-2 h-10 rounded-xl border border-ink/10 bg-paper px-2 font-mono text-sm dark:border-paper/15 dark:bg-ink"
              value={dest}
              onChange={(e) => setDest(Number(e.target.value))}
            >
              {CCTP_CHAINS.filter((c) => !isArc(c.domain)).map((c) => (
                <option key={c.domain} value={c.domain}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <input
            value={raw}
            onChange={(e) => setRaw(e.target.value.replace(/[^0-9.]/g, ""))}
            className="h-10 w-28 rounded-xl border border-ink/10 bg-paper px-3 font-mono dark:border-paper/15 dark:bg-ink"
          />
          <ClayButton
            variant="secondary"
            disabled={parsed <= 0n}
            onClick={() => {
              if (bridgeOut(dest, parsed)) setRaw("");
            }}
          >
            Burn on Arc
          </ClayButton>
        </div>
      </GlassPanel>

      <h2 className="mt-8 font-medium">Holdings</h2>
      {positions.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Empty. Buy on <Link to="/app">Discover</Link>.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {positions.map(({ launch, amount }) => (
            <li key={launch.id}>
              <Link
                to="/app/t/$id"
                params={{ id: launch.id }}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-ink/8 px-3 dark:border-paper/10"
              >
                <TokenGlyph symbol={launch.symbol} hue={launch.hue} size={32} />
                <span className="flex-1">
                  <span className="block font-medium">{launch.symbol}</span>
                  <span className="block font-mono text-[11px] text-muted">
                    {formatPriceWad(priceOf(launch))} · {launch.status === "graduated" ? "Book" : "Curve"} · Arc
                  </span>
                </span>
                <span className="font-mono text-sm tabular">{formatToken(amount)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 font-medium">Watchlist</h2>
      {watched.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Star a market on its page.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {watched.map((l) => (
            <li key={l.id}>
              <Link to="/app/t/$id" params={{ id: l.id }} className="text-teal-2">
                {l.symbol}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="sr-only">{DEMO_USER}</p>
    </div>
  );
}
