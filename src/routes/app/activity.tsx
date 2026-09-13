"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Tape } from "@/components/app/tape";
import { useLaunchpad } from "@/lib/engine/store.ts";

export const Route = createFileRoute("/app/activity")({
  component: Activity,
});

function Activity() {
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  void version;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-28">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Tape</p>
      <h1 className="font-display text-4xl">All prints</h1>
      <p className="mt-2 text-sm text-muted">Curve buys, sells, graduations, and Uniswap swaps in this book.</p>
      <div className="mt-6">
        <Tape trades={engine.trades} engine={engine} showMarket />
      </div>
    </div>
  );
}
