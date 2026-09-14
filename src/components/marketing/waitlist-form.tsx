"use client";

import { useEffect, useState, useTransition } from "react";
import { ClayButton } from "@/components/ui/clay-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { joinWaitlist, waitlistStats } from "@/lib/waitlist";
import { cn } from "@/lib/utils";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export function WaitlistForm({ className }: { className?: string }) {
  const [interest, setInterest] = useState<"launch" | "trade">("trade");
  const [wallet, setWallet] = useState("");
  const [projectName, setProjectName] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState<{ launch: number; trade: number; total: number } | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    void waitlistStats().then(setStats).catch(() => setStats({ launch: 0, trade: 0, total: 0 }));
  }, [done]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!WALLET_RE.test(wallet.trim())) {
      setError("Enter a valid 0x wallet on Arc.");
      return;
    }
    if (interest === "launch" && projectName.trim().length < 2) {
      setError("Name the project you want to launch.");
      return;
    }
    start(async () => {
      try {
        await joinWaitlist({
          data: {
            wallet: wallet.trim(),
            interest,
            projectName: projectName.trim() || undefined,
            xHandle: xHandle.trim() || undefined,
            pitch: pitch.trim() || undefined,
          },
        });
        setDone(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not join waitlist");
      }
    });
  }

  return (
    <GlassPanel className={cn("p-6 sm:p-8", className)}>
      <p className="font-mono text-[11px] tracking-[0.22em] text-teal uppercase">Mainnet waitlist</p>
      <h2 className="mt-2 text-3xl tracking-tight sm:text-4xl">Early access, not a gate on trading.</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Selected projects get create access at mainnet open. Anyone can trade once markets are live.
        Join with your wallet — we select launchers from this list.
      </p>

      {done ? (
        <div className="mt-8 rounded-2xl border border-teal/30 bg-teal/10 px-4 py-5">
          <p className="font-medium text-ink">You&apos;re on the list.</p>
          <p className="mt-1 text-sm text-muted">
            {interest === "launch"
              ? "If selected, you’ll get create access for your project. Trading stays open to everyone."
              : "Trading is open to everyone at mainnet. We’ll ping your X if we need early trader feedback."}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="flex rounded-2xl bg-ink/5 p-1">
            {(
              [
                { id: "trade" as const, label: "I want to trade" },
                { id: "launch" as const, label: "I want to launch" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setInterest(opt.id)}
                className={cn(
                  "min-h-11 flex-1 rounded-xl text-sm font-medium transition-colors",
                  interest === opt.id ? "bg-paper text-ink shadow-border" : "text-muted",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] text-muted uppercase">Wallet</span>
            <input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0x…"
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 font-mono text-sm outline-none focus:border-teal"
            />
          </label>

          {interest === "launch" ? (
            <>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] text-muted uppercase">Project name</span>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  maxLength={64}
                  className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-teal"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[11px] text-muted uppercase">Pitch (optional)</span>
                <textarea
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  maxLength={280}
                  rows={3}
                  className="w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm outline-none focus:border-teal"
                />
              </label>
            </>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] text-muted uppercase">X handle (optional)</span>
            <input
              value={xHandle}
              onChange={(e) => setXHandle(e.target.value)}
              placeholder="@…"
              maxLength={32}
              className="h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-teal"
            />
          </label>

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <ClayButton type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Joining…" : "Join waitlist"}
          </ClayButton>
        </form>
      )}

      {stats && stats.total > 0 ? (
        <p className="mt-6 font-mono text-[11px] text-muted">
          {stats.total} on list · {stats.launch} launch · {stats.trade} trade
        </p>
      ) : null}
    </GlassPanel>
  );
}
