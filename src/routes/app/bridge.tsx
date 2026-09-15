"use client";

import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ClayButton } from "@/components/ui/clay-button";
import { UsdcMark } from "@/components/ui/usdc-mark";
import { ArcMark } from "@/components/ui/arc-mark";
import { SourcePicker } from "@/components/app/source-picker";
import { CCTP_CHAINS, ARC_CCTP_DOMAIN, isArc } from "@/lib/engine/cctp.ts";
import { sourceBalance, usdcBalance } from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { errorCopy, formatUsdc } from "@/lib/format.ts";
import { parseUnits } from "@/lib/utils";

export const Route = createFileRoute("/app/bridge")({
  component: BridgePage,
  head: () => ({ meta: [{ title: "Bridge USDC — Pairband" }] }),
});

function BridgePage() {
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  const account = useLaunchpad((s) => s.account);
  const lastError = useLaunchpad((s) => s.lastError);
  const sourceDomain = useLaunchpad((s) => s.sourceDomain);
  const bridgeOut = useLaunchpad((s) => s.bridgeOut);
  void version;

  const [mode, setMode] = useState<"in" | "out">("in");
  const defaultDest = CCTP_CHAINS.find((c) => !isArc(c.domain))?.domain ?? 0;
  const [dest, setDest] = useState(defaultDest);
  const [raw, setRaw] = useState("100");
  const parsed = useMemo(() => {
    try {
      return parseUnits(raw || "0", 18);
    } catch {
      return 0n;
    }
  }, [raw]);

  const arcUsdc = usdcBalance(engine, account);
  const sourceUsdc = sourceBalance(engine, account, sourceDomain);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">CCTP / Gateway</p>
      <h1 className="font-display text-4xl tracking-tight">Pay USDC from any chain</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
        Only USDC moves cross-chain. Launch tokens never enter a messenger. Inbound burns on the source and mints to
        the Pairband Settler on Arc (domain 26), then forwards into the market vault in the same transaction.
      </p>

      <p className="mt-4 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-xs leading-relaxed text-ink dark:border-amber/40 dark:bg-amber/15 dark:text-paper">
        <span className="font-mono uppercase tracking-wide">Preview</span> — this desk simulates CCTP balance moves
        in the local engine. It is not a production Circle settle; live burn/mint still goes through the Arc settler
        path when you trade with a non-Arc source.
      </p>

      <div className="mt-6 flex rounded-2xl bg-ink/5 p-1 dark:bg-paper/10">
        {(
          [
            { id: "in" as const, label: "Pay in" },
            { id: "out" as const, label: "Bridge out" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`min-h-11 flex-1 rounded-xl text-sm font-medium ${
              mode === m.id ? "bg-paper text-ink shadow-border dark:bg-ink dark:text-paper" : "text-muted"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "in" ? (
        <GlassPanel className="mt-4 p-5">
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase">
            <UsdcMark size={12} /> Source → Arc
          </p>
          <p className="mt-2 text-sm text-muted">
            Pick a CCTP chain Circle has enabled for Arc domain 26. Missing domains stay hidden — we do not ship a
            custom bridge.
          </p>
          <div className="mt-4">
            <SourcePicker />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="font-mono text-[11px] text-muted uppercase">Source balance</dt>
              <dd className="font-mono tabular">{formatUsdc(sourceUsdc)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] text-muted uppercase">Arc USDC</dt>
              <dd className="font-mono tabular">{formatUsdc(arcUsdc)}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-2xl border border-ink/8 bg-paper-2 px-4 py-3 text-xs leading-relaxed text-muted dark:border-paper/10 dark:bg-ink-2">
            In the trade ticket, buys with a non-Arc source mint via the Settler hook (
            <span className="font-mono">BUY_CURVE | BID_BOOK</span>). Preview mirrors Fast Transfer settle; production
            uses the audited settler path.
          </p>
          <Link to="/app/trade" className="mt-4 inline-block text-sm text-teal-2 underline underline-offset-4">
            Open trade ticket to buy with source USDC
          </Link>
        </GlassPanel>
      ) : (
        <GlassPanel className="mt-4 p-5">
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase">
            <ArcMark size={12} /> Arc → source
          </p>
          <p className="mt-2 text-sm text-muted">
            Sell on Arc first (curve or book + pool). Then burn Arc USDC to your source domain. No protocol fee on
            bridge-out — you pay CCTP only.
          </p>
          <label className="mt-4 block">
            <span className="mb-1.5 block font-mono text-[11px] text-muted uppercase">Destination</span>
            <select
              value={dest}
              onChange={(e) => setDest(Number(e.target.value))}
              className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none dark:border-paper/15 dark:bg-ink"
            >
              {CCTP_CHAINS.filter((c) => !isArc(c.domain)).map((c) => (
                <option key={c.domain} value={c.domain}>
                  {c.name} · domain {c.domain}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block">
            <span className="mb-1.5 block font-mono text-[11px] text-muted uppercase">Amount (USDC)</span>
            <input
              value={raw}
              onChange={(e) => setRaw(e.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="decimal"
              className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono text-lg tabular outline-none focus:border-teal dark:border-paper/15 dark:bg-ink"
            />
          </label>
          <p className="mt-2 font-mono text-xs text-muted">Available {formatUsdc(arcUsdc)}</p>
          {lastError ? <p className="mt-2 text-xs text-danger">{errorCopy(lastError)}</p> : null}
          <ClayButton
            className="mt-4 w-full"
            disabled={parsed <= 0n || parsed > arcUsdc || dest === ARC_CCTP_DOMAIN}
            onClick={() => {
              bridgeOut(dest, parsed);
              setRaw("");
            }}
          >
            Bridge out {parsed > 0n ? formatUsdc(parsed) : ""}
          </ClayButton>
          <p className="mt-3 text-xs text-muted">
            Preview uses the local engine. Production path: sell → wallet USDC on Arc →{" "}
            <span className="font-mono">depositForBurn</span> to source domain.
          </p>
        </GlassPanel>
      )}

      <GlassPanel className="mt-4 p-5">
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Domains in v1</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CCTP_CHAINS.map((c) => (
            <li key={c.domain} className="rounded-xl border border-ink/8 px-3 py-2 text-sm dark:border-paper/10">
              <span className="font-medium">{c.name}</span>
              <span className="mt-0.5 block font-mono text-[10px] text-muted">domain {c.domain}</span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
