"use client";

import { ladder, spreadBps } from "@/lib/engine/book.ts";
import type { Book } from "@/lib/engine/types.ts";
import { formatPriceWad, formatToken, formatUsdc } from "@/lib/format.ts";
import { cn } from "@/lib/utils";

export function OrderBook({
  book,
  onPrice,
  symbol,
}: {
  book: Book | undefined;
  onPrice?: (price: bigint) => void;
  symbol: string;
}) {
  const { bids, asks } = ladder(book, 8);
  const spread = spreadBps(book);
  const max = [...asks, ...bids].reduce((m, l) => (l.usdc > m ? l.usdc : m), 1n);
  const asksRev = [...asks].reverse();

  return (
    <div className="font-mono text-xs">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="tracking-[0.16em] text-muted uppercase">On-chain book</p>
        <p className="text-muted">
          {spread === null ? "—" : `${(spread / 100).toFixed(2)}% spread`} · {symbol}/USDC
        </p>
      </div>
      <div className="grid grid-cols-3 px-1 text-[10px] tracking-wide text-muted uppercase">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">USDC</span>
      </div>
      <ul className="mt-1 space-y-0.5">
        {asksRev.map((l) => (
          <Level key={`a${l.price}`} level={l} max={max} tone="ask" onPrice={onPrice} />
        ))}
      </ul>
      <p className="my-2 text-center text-[11px] text-muted">
        {asks[0] && bids[0]
          ? `ask ${formatPriceWad(asks[0].price)} · bid ${formatPriceWad(bids[0].price)}`
          : "Empty side — Uniswap backstop"}
      </p>
      <ul className="space-y-0.5">
        {bids.map((l) => (
          <Level key={`b${l.price}`} level={l} max={max} tone="bid" onPrice={onPrice} />
        ))}
      </ul>
    </div>
  );
}

function Level({
  level,
  max,
  tone,
  onPrice,
}: {
  level: { price: bigint; tokens: bigint; usdc: bigint; count: number };
  max: bigint;
  tone: "bid" | "ask";
  onPrice?: (price: bigint) => void;
}) {
  const pct = Number((level.usdc * 1000n) / (max === 0n ? 1n : max)) / 10;
  return (
    <li>
      <button
        type="button"
        onClick={() => onPrice?.(level.price)}
        className="relative flex min-h-8 w-full items-center overflow-hidden rounded-md px-1 text-left"
      >
        <span
          className={cn("absolute inset-y-0 right-0", tone === "bid" ? "bg-teal/20" : "bg-danger/15")}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
        <span className={cn("relative z-[1] flex-1 tabular", tone === "bid" ? "text-teal-2" : "text-danger")}>
          {formatPriceWad(level.price)}
        </span>
        <span className="relative z-[1] flex-1 text-right tabular">{formatToken(level.tokens, 0)}</span>
        <span className="relative z-[1] flex-1 text-right tabular text-muted">{formatUsdc(level.usdc)}</span>
      </button>
    </li>
  );
}
