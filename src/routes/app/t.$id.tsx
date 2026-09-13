"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PoolCard } from "@/components/app/pool-card";
import { PriceChart } from "@/components/app/price-chart";
import { Tape } from "@/components/app/tape";
import { TradeTicket } from "@/components/app/trade-ticket";
import { CurveMeter } from "@/components/ui/curve-meter";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { UsdcMark } from "@/components/ui/usdc-mark";
import { ArcMark } from "@/components/ui/arc-mark";
import { GRADUATE_AT, TOTAL_SUPPLY } from "@/lib/engine/constants.ts";
import {
  graduateProgress,
  holdersOf,
  marketCap,
  priceOf,
  priceSeries,
  tokenBalance,
} from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { formatCompact, formatPriceWad, formatToken, formatUsdc } from "@/lib/format.ts";
import { cn, shortAddr } from "@/lib/utils";

export const Route = createFileRoute("/app/t/$id")({ component: TokenPage });

function TokenPage() {
  const { id } = Route.useParams();
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  const account = useLaunchpad((s) => s.account);
  const watchlist = useLaunchpad((s) => s.watchlist);
  const toggleWatch = useLaunchpad((s) => s.toggleWatch);
  void version;

  const launch = engine.launches.find((l) => l.id === id);
  if (!launch) {
    return (
      <div className="px-4 py-20 text-center">
        <p>Token not found.</p>
        <Link to="/app" className="mt-3 inline-block text-teal-2">
          Back to discover
        </Link>
      </div>
    );
  }

  const trades = engine.trades.filter((t) => t.launchId === id);
  const held = tokenBalance(engine, id, account);
  const px = priceOf(launch, engine.books[id]);
  const cap = marketCap(launch, engine.books[id]);
  const raised = launch.status === "graduated" ? launch.reserveUsdc : launch.realUsdc;
  const holders = holdersOf(engine, id);
  const watched = watchlist.includes(id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link to="/app" className="text-xs text-muted hover:text-ink dark:hover:text-paper">
        Discover
      </Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex items-start gap-4">
            <TokenGlyph symbol={launch.symbol} hue={launch.hue} size={56} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-4xl tracking-tight">{launch.name}</h1>
                <span className="inline-flex items-center gap-1 font-mono text-sm text-muted">
                  {launch.symbol}/<UsdcMark size={12} />USDC
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] uppercase dark:bg-paper/10">
                  {launch.status === "graduated" ? (
                    <>
                      <ArcMark size={10} /> Graduated · book
                    </>
                  ) : (
                    "Bonding curve"
                  )}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{launch.description}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleWatch(id)}
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl border",
                watched ? "border-amber bg-amber/20 text-amber-2" : "border-ink/10 text-muted dark:border-paper/15",
              )}
              aria-label="Watch"
            >
              <Star size={18} fill={watched ? "currentColor" : "none"} />
            </button>
          </div>

          <GlassPanel className="mt-6 p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[11px] text-muted uppercase">Last</p>
                <p className="font-mono text-3xl tabular">{formatPriceWad(px)}</p>
              </div>
              <p className="font-mono text-xs text-muted">{launch.txCount} prints</p>
            </div>
            <PriceChart points={priceSeries(engine, id)} className="mt-4" />
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <Stat label="FDV" value={formatCompact(cap)} />
              <Stat label={launch.status === "graduated" ? "Pair USDC" : "Raised"} value={formatUsdc(raised)} />
              <Stat label="Holders" value={String(launch.holders)} />
              <Stat label="Volume" value={formatCompact(launch.volumeUsdc)} />
            </dl>
            {launch.status === "curve" ? (
              <div className="mt-5">
                <CurveMeter progress={graduateProgress(launch)} label={`To book (${formatUsdc(GRADUATE_AT)})`} />
              </div>
            ) : null}
          </GlassPanel>

          {launch.status === "graduated" ? (
            <div className="mt-6">
              <PoolCard launch={launch} />
            </div>
          ) : null}

          <section className="mt-6">
            <h2 className="font-medium">Tape</h2>
            <div className="mt-2">
              <Tape trades={trades} engine={engine} symbol={launch.symbol} />
            </div>
          </section>

          <section className="mt-6">
            <h2 className="font-medium">Holders</h2>
            <ul className="mt-2 divide-y divide-ink/8 rounded-[20px] border border-ink/8 dark:divide-paper/10 dark:border-paper/10">
              {holders.slice(0, 8).map((h) => (
                <li key={h.account} className="flex items-center justify-between px-4 py-2 text-sm">
                  <span className="font-mono text-xs">{shortAddr(h.account)}</span>
                  <span className="font-mono tabular">{formatToken(h.amount, 0)}</span>
                </li>
              ))}
            </ul>
          </section>

          <dl className="mt-6 grid gap-2 text-xs text-muted sm:grid-cols-2">
            <div>Creator {shortAddr(launch.creator)}</div>
            <div>Token {shortAddr(launch.token)}</div>
            <div>Curve {shortAddr(launch.curve)}</div>
            <div>
              Your bag {formatToken(held)} {launch.symbol}
            </div>
            <div>Supply {formatToken(TOTAL_SUPPLY, 0)}</div>
            {launch.pair ? <div>Pair {shortAddr(launch.pair)}</div> : null}
          </dl>
        </div>
        <TradeTicket launch={launch} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 font-mono tabular">{value}</dd>
    </div>
  );
}
