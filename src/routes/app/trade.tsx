"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PoolCard } from "@/components/app/pool-card";
import { PriceChart } from "@/components/app/price-chart";
import { Tape } from "@/components/app/tape";
import { TradeTicket } from "@/components/app/trade-ticket";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { UsdcMark } from "@/components/ui/usdc-mark";
import { priceOf, priceSeries } from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { formatPriceWad, formatUsdc } from "@/lib/format.ts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/trade")({ component: Trade });

function Trade() {
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  void version;
  const [id, setId] = useState(engine.launches[0]?.id ?? "");
  const [q, setQ] = useState("");
  const launch = engine.launches.find((l) => l.id === id) ?? engine.launches[0];

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    let rows = engine.launches.slice();
    if (query) {
      rows = rows.filter((l) => l.symbol.toLowerCase().includes(query) || l.name.toLowerCase().includes(query));
    }
    return rows;
  }, [engine, q, version]);

  if (!launch) {
    return <p className="px-4 py-16 text-center text-muted">No markets yet.</p>;
  }

  const series = priceSeries(engine, launch.id);
  const trades = engine.trades.filter((t) => t.launchId === launch.id);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)_340px]">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Trade</p>
        <h1 className="inline-flex items-center gap-2 font-display text-3xl tracking-tight">
          <UsdcMark size={22} /> USDC pairs
        </h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter"
          className="mt-4 h-10 w-full rounded-xl border border-ink/10 bg-paper px-3 text-sm outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
        />
        <ul className="mt-3 max-h-[70vh] space-y-1 overflow-auto pr-1">
          {list.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setId(l.id)}
                className={cn(
                  "flex w-full min-h-14 items-center gap-3 rounded-2xl border px-3 text-left transition-colors",
                  l.id === launch.id
                    ? "border-ink/20 bg-paper-2 dark:border-paper/20 dark:bg-ink-2"
                    : "border-ink/8 hover:bg-ink/5 dark:border-paper/10",
                )}
              >
                <TokenGlyph symbol={l.symbol} hue={l.hue} size={32} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{l.symbol}</span>
                  <span className="block font-mono text-[11px] text-muted">
                    {l.status === "graduated" ? "Book" : "Curve"}
                  </span>
                </span>
                <span className="font-mono text-xs tabular">{formatPriceWad(priceOf(l))}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0">
        <GlassPanel className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <TokenGlyph symbol={launch.symbol} hue={launch.hue} size={40} />
              <div>
                <h2 className="inline-flex items-center gap-2 font-display text-3xl">
                  {launch.symbol}/<UsdcMark size={18} />
                  <span className="text-xl text-muted">USDC</span>
                </h2>
                <p className="font-mono text-[11px] text-muted uppercase">
                  {launch.status === "graduated" ? "On-chain book · Uniswap backstop" : "Bonding curve"}
                </p>
              </div>
            </div>
            <p className="font-mono text-2xl tabular">{formatPriceWad(priceOf(launch))}</p>
          </div>
          <PriceChart points={series} className="mt-4" />
        </GlassPanel>
        {launch.status === "graduated" ? (
          <div className="mt-4">
            <PoolCard launch={launch} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Raised {formatUsdc(launch.realUsdc)} of $80.00. Next venue is a locked Uniswap pair.
          </p>
        )}
        <h3 className="mt-6 font-medium">Tape</h3>
        <div className="mt-2">
          <Tape trades={trades} engine={engine} symbol={launch.symbol} />
        </div>
      </div>

      <TradeTicket launch={launch} />
    </div>
  );
}
