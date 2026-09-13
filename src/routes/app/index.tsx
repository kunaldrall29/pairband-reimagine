"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TokenCard } from "@/components/app/token-card";
import { ClayButton } from "@/components/ui/clay-button";
import { ArcMark } from "@/components/ui/arc-mark";
import { UsdcMark } from "@/components/ui/usdc-mark";
import { graduateProgress, marketCap, protocolStats } from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { formatCompact, formatUsdc } from "@/lib/format.ts";
import { GRADUATE_AT } from "@/lib/engine/constants.ts";

export const Route = createFileRoute("/app/")({ component: Discover });

type Filter = "new" | "mcap" | "volume" | "curve" | "uniswap" | "graduating";

function Discover() {
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  void version;
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("new");
  const stats = protocolStats(engine);

  const rows = useMemo(() => {
    let list = engine.launches.slice();
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.symbol.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query),
      );
    }
    if (filter === "curve") list = list.filter((l) => l.status === "curve");
    if (filter === "uniswap") list = list.filter((l) => l.status === "graduated");
    if (filter === "graduating") {
      list = list.filter((l) => l.status === "curve" && graduateProgress(l) >= 0.6);
      list.sort((a, b) => graduateProgress(b) - graduateProgress(a));
    } else if (filter === "mcap") list.sort((a, b) => (marketCap(b) > marketCap(a) ? 1 : -1));
    else if (filter === "volume") list.sort((a, b) => (a.volumeUsdc < b.volumeUsdc ? 1 : -1));
    else list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [engine, q, filter, version]);

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Discover</p>
          <h1 className="font-display text-4xl tracking-tight">Markets on Arc</h1>
          <p className="mt-1 inline-flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <ArcMark size={12} /> {stats.count} tokens
            </span>
            <span>·</span>
            <span>{stats.graduated} books</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <UsdcMark size={12} /> {formatCompact(stats.volume)} volume
            </span>
          </p>
        </div>
        <Link to="/app/create">
          <ClayButton>Create token</ClayButton>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or symbol"
          className="h-11 min-h-11 flex-1 rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-teal dark:border-paper/15 dark:bg-ink-2"
        />
        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-ink/5 p-1 dark:bg-paper/10">
          {(
            [
              ["new", "New"],
              ["mcap", "Market cap"],
              ["volume", "Volume"],
              ["graduating", "Near book"],
              ["curve", "Curve"],
              ["uniswap", "Book"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`min-h-10 shrink-0 rounded-xl px-3 text-sm ${
                filter === id ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 inline-flex flex-wrap items-center gap-2 text-xs text-muted">
        <UsdcMark size={12} /> quoted · <ArcMark size={12} /> settled. Graduation at {formatUsdc(GRADUATE_AT)}.
        LP is burned. Demo book, not live TVL. Buy Teal Machine to watch the pair mint.
      </p>

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-muted">No markets match that filter.</p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((l) => (
            <TokenCard key={l.id} launch={l} engine={engine} />
          ))}
        </div>
      )}
    </div>
  );
}
