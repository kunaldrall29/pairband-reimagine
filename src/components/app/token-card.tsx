import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { Sparkline } from "@/components/ui/sparkline";
import { CurveMeter } from "@/components/ui/curve-meter";
import { UsdcMark } from "@/components/ui/usdc-mark";
import { graduateProgress, marketCap, priceOf } from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import type { EngineState, Launch } from "@/lib/engine/types.ts";
import { formatCompact, formatPriceWad, formatUsdc } from "@/lib/format.ts";
import { cn } from "@/lib/utils";

export function TokenCard({ launch, engine }: { launch: Launch; engine: EngineState }) {
  const watchlist = useLaunchpad((s) => s.watchlist);
  const toggleWatch = useLaunchpad((s) => s.toggleWatch);
  const prices = engine.trades
    .filter((t) => t.launchId === launch.id && t.price > 0n)
    .slice(0, 24)
    .reverse()
    .map((t) => Number(t.price) / 1e18);
  const book = engine.books[launch.id];
  const cap = marketCap(launch, book);
  const px = priceOf(launch, book);
  const graduated = launch.status === "graduated";
  const watched = watchlist.includes(launch.id);

  return (
    <Link
      to="/app/t/$id"
      params={{ id: launch.id }}
      className={cn(
        "relative block overflow-hidden rounded-[24px] border border-ink/8 bg-paper p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5 dark:border-paper/10 dark:bg-ink-2",
      )}
    >
      <div className="flex items-start gap-3">
        <TokenGlyph symbol={launch.symbol} hue={launch.hue} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{launch.name}</p>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
              {launch.symbol}/<UsdcMark size={10} />
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">{launch.description}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase",
            graduated ? "bg-teal/15 text-teal-2" : "bg-amber/20 text-amber-2",
          )}
        >
          {graduated ? "Book" : "Curve"}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-lg tabular">{formatPriceWad(px)}</p>
          <p className="text-xs text-muted">
            FDV {formatCompact(cap)} · vol {formatUsdc(launch.volumeUsdc, 0)}
          </p>
        </div>
        <Sparkline values={prices.length > 1 ? prices : [1, 1.02, 0.99, 1.04]} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        {graduated ? (
          <p className="font-mono text-[11px] text-teal-2">LP locked · book live</p>
        ) : (
          <CurveMeter progress={graduateProgress(launch)} label="To Uniswap" className="flex-1" />
        )}
        <button
          type="button"
          aria-label={watched ? "Unwatch" : "Watch"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWatch(launch.id);
          }}
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            watched ? "text-amber-2" : "text-muted",
          )}
        >
          <Star size={14} fill={watched ? "currentColor" : "none"} />
        </button>
      </div>
    </Link>
  );
}
