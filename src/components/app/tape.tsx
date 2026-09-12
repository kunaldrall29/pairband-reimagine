"use client";

import { Link } from "@tanstack/react-router";
import type { EngineState, Trade } from "@/lib/engine/types.ts";
import { chainByDomain, isArc } from "@/lib/engine/cctp.ts";
import { formatToken, formatUsdc, timeAgo } from "@/lib/format.ts";
import { cn, shortAddr } from "@/lib/utils";

export function Tape({
  trades,
  engine,
  symbol,
  showMarket,
}: {
  trades: Trade[];
  engine: EngineState;
  symbol?: string;
  showMarket?: boolean;
}) {
  if (trades.length === 0) {
    return <p className="py-8 text-center text-sm text-muted">No prints yet.</p>;
  }
  return (
    <div className="max-w-full overflow-x-auto rounded-[20px] border border-ink/8 dark:border-paper/10">
      <table className="w-full min-w-[22rem] text-left text-sm sm:min-w-[28rem]">
        <thead className="bg-ink/5 font-mono text-[11px] text-muted uppercase dark:bg-paper/5">
          <tr>
            {showMarket ? <th className="px-3 py-2">Market</th> : null}
            <th className="px-3 py-2">Side</th>
            <th className="px-3 py-2">USDC</th>
            <th className="px-3 py-2">{symbol ?? "Token"}</th>
            <th className="px-3 py-2">Who</th>
            <th className="px-3 py-2">When</th>
          </tr>
        </thead>
        <tbody>
          {trades.slice(0, 24).map((t) => {
            const launch = engine.launches.find((l) => l.id === t.launchId);
            const buyish = t.side === "buy" || (t.side === "swap" && !symbol);
            const isBuy = t.side === "buy" || (t.side === "swap" && t.usdc > 0n && t.tokens > 0n);
            return (
              <tr key={t.id} className="border-t border-ink/5 dark:border-paper/10">
                {showMarket ? (
                  <td className="px-3 py-2">
                    {launch ? (
                      <Link to="/app/t/$id" params={{ id: launch.id }} className="font-medium hover:underline">
                        {launch.symbol}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                ) : null}
                <td
                  className={cn(
                    "px-3 py-2 capitalize",
                    t.side === "sell" ? "text-danger" : t.side === "fill" || t.side === "buy" || t.side === "swap" ? "text-teal-2" : "text-muted",
                  )}
                >
                  {t.side === "swap" ? "uniswap" : t.side === "fill" ? "book" : t.side}
                  {t.sourceDomain && !isArc(t.sourceDomain)
                    ? ` · ${chainByDomain(t.sourceDomain)?.short ?? t.sourceDomain}`
                    : ""}
                </td>
                <td className="px-3 py-2 font-mono tabular">{t.usdc > 0n ? formatUsdc(t.usdc) : "—"}</td>
                <td className="px-3 py-2 font-mono tabular">
                  {t.tokens > 0n && t.side !== "create" ? formatToken(t.tokens, 0) : "—"}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-muted">{shortAddr(t.account, 3)}</td>
                <td className="px-3 py-2 text-muted" suppressHydrationWarning>
                  {timeAgo(t.at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
