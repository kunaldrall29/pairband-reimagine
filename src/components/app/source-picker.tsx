"use client";

import { ArcMark } from "@/components/ui/arc-mark";
import { UsdcMark } from "@/components/ui/usdc-mark";
import { CCTP_CHAINS, chainByDomain, isArc } from "@/lib/engine/cctp.ts";
import { sourceBalance } from "@/lib/engine/launchpad.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { formatUsdc } from "@/lib/format.ts";
import { cn } from "@/lib/utils";

export function SourcePicker({ className }: { className?: string }) {
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  const account = useLaunchpad((s) => s.account);
  const sourceDomain = useLaunchpad((s) => s.sourceDomain);
  const setSource = useLaunchpad((s) => s.setSourceDomain);
  void version;
  const src = chainByDomain(sourceDomain);

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {CCTP_CHAINS.map((c) => {
        const bal = sourceBalance(engine, account, c.domain);
        const on = sourceDomain === c.domain;
        return (
          <button
            key={c.domain}
            type="button"
            onClick={() => setSource(c.domain)}
            className={cn(
              "inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 font-mono text-[10px] tracking-wide uppercase",
              on ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "bg-ink/5 text-muted dark:bg-paper/10",
            )}
          >
            {isArc(c.domain) ? <ArcMark size={10} /> : <UsdcMark size={10} />}
            {c.short}
            <span className="tabular">{formatUsdc(bal, 0)}</span>
          </button>
        );
      })}
      <p className="flex w-full items-center gap-1 pt-1 font-mono text-[10px] text-muted">
        {isArc(sourceDomain) ? (
          <>
            <ArcMark size={10} /> Paying on Arc. Settlement is local.
          </>
        ) : (
          <>
            <UsdcMark size={10} />
            {src?.name} → <ArcMark size={10} /> Arc domain 26. Book stays on Arc.
          </>
        )}
      </p>
    </div>
  );
}
