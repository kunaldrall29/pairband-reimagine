"use client";

import { formatPrice, formatTick } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  tick: number;
  tickLower: number;
  tickUpper: number;
  proposal?: { tickLower: number; tickUpper: number } | null;
  minTick?: number;
  maxTick?: number;
  className?: string;
};

export function BandMeter({
  tick,
  tickLower,
  tickUpper,
  proposal,
  minTick,
  maxTick,
  className,
}: Props) {
  const lo = minTick ?? Math.min(tickLower - 80, proposal?.tickLower ?? tickLower, tick) - 40;
  const hi = maxTick ?? Math.max(tickUpper + 80, proposal?.tickUpper ?? tickUpper, tick) + 40;
  const span = hi - lo || 1;
  const pct = (v: number) => `${((v - lo) / span) * 100}%`;
  const bandLeft = pct(tickLower);
  const bandWidth = `${((tickUpper - tickLower) / span) * 100}%`;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Spot</p>
          <p className="font-mono text-sm tabular text-ink dark:text-paper">
            tick {formatTick(tick)} · {formatPrice(tick)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Band</p>
          <p className="font-mono text-sm tabular text-teal">
            [{formatTick(tickLower)}, {formatTick(tickUpper)}) · {formatPrice(tickLower)}–{formatPrice(tickUpper)}
          </p>
        </div>
      </div>
      <div className="relative h-10 overflow-hidden rounded-full bg-paper-2 dark:bg-ink-2">
        {proposal && proposal.tickLower !== tickLower && (
          <div
            className="absolute top-1 bottom-1 rounded-full border border-dashed border-ink/25 dark:border-paper/25"
            style={{
              left: pct(proposal.tickLower),
              width: `${((proposal.tickUpper - proposal.tickLower) / span) * 100}%`,
            }}
            title="Pending proposal"
          />
        )}
        <div
          className="absolute top-1 bottom-1 rounded-full border-2 border-teal bg-teal/15"
          style={{ left: bandLeft, width: bandWidth }}
        />
        <div
          className="absolute top-0 z-10 h-full w-0.5 bg-amber shadow-[0_0_12px_#E8B86D]"
          style={{ left: pct(tick) }}
        />
        <div
          className="absolute top-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber"
          style={{ left: pct(tick) }}
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted tabular">
        <span>{formatTick(lo)}</span>
        <span>{formatTick(hi)}</span>
      </div>
    </div>
  );
}
