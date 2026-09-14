"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Plus, ArrowLeftRight, Wallet, Moon, Sun, RotateCcw, Activity, Cable } from "lucide-react";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { Wordmark, PairMark } from "@/components/ui/wordmark";
import { ClayButton } from "@/components/ui/clay-button";
import { ArcMark } from "@/components/ui/arc-mark";
import { UsdcMark } from "@/components/ui/usdc-mark";
import { ConnectWallet } from "@/components/app/connect-wallet";
import { hydrateLaunchpad, useLaunchpad } from "@/lib/engine/store.ts";
import { totalUsdc, usdcBalance } from "@/lib/engine/launchpad.ts";
import { formatUsdc } from "@/lib/format.ts";
import { cn } from "@/lib/utils";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";

const NAV = [
  { to: "/app", label: "Discover", icon: Compass },
  { to: "/app/create", label: "Launch", icon: Plus },
  { to: "/app/trade", label: "Trade", icon: ArrowLeftRight },
  { to: "/app/bridge", label: "Bridge", icon: Cable },
  { to: "/app/activity", label: "Tape", icon: Activity },
  { to: "/app/me", label: "Wallet", icon: Wallet },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const account = useLaunchpad((s) => s.account);
  const dark = useLaunchpad((s) => s.dark);
  const setDark = useLaunchpad((s) => s.setDark);
  const reset = useLaunchpad((s) => s.clearLocalCache);
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  const lastEvent = useLaunchpad((s) => s.lastEvent);
  const clearEvent = useLaunchpad((s) => s.clearEvent);
  void version;
  const usdc = usdcBalance(engine, account);
  const allUsdc = totalUsdc(engine, account);

  useEffect(() => {
    hydrateLaunchpad();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!lastEvent) return;
    if (lastEvent.kind === "graduate" || lastEvent.kind === "stage_b") {
      toast.success(`${lastEvent.symbol} Stage B locked. LP burned. Book + Uniswap live.`);
    } else if (lastEvent.kind === "stage_a") {
      toast.success(`${lastEvent.symbol} Stage A — book is open. Curve still live.`);
    } else if (lastEvent.kind === "create") {
      toast(`${lastEvent.symbol} is live on the curve.`);
    } else if (lastEvent.kind === "trade") {
      toast.success(`${lastEvent.symbol} filled. Settled on Arc.`);
    }
    clearEvent();
  }, [lastEvent, clearEvent]);

  return (
    <div className={cn("min-h-screen overflow-x-hidden bg-paper text-ink dark:bg-ink dark:text-paper", dark && "dark")}>
      <Toaster position="top-center" richColors={false} />
      <aside className="fixed top-0 bottom-0 left-0 z-30 hidden w-[72px] flex-col items-center border-r border-ink/8 bg-paper-2 py-4 dark:border-paper/10 dark:bg-ink-2 md:flex">
        <Link to="/" className="mb-6" aria-label="Pairband home">
          <PairMark size={28} />
        </Link>
        <nav className="flex flex-1 flex-col items-center gap-1">
          {NAV.map((n) => {
            const active = n.to === "/app" ? path === "/app" : path.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                title={n.label}
                className={cn(
                  "flex size-12 items-center justify-center rounded-2xl transition-colors",
                  active ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-muted hover:bg-ink/5 dark:hover:bg-paper/10",
                )}
              >
                <Icon size={20} strokeWidth={1.75} />
              </Link>
            );
          })}
        </nav>
        <ArcMark size={18} className="mt-auto text-ink/50 dark:text-paper/50" />
      </aside>

      <header className="sticky top-0 z-20 border-b border-ink/8 bg-paper/80 backdrop-blur-xl dark:border-paper/10 dark:bg-ink/80 md:ml-[72px]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 md:hidden">
            <Wordmark size="sm" />
            <ArcMark size={14} className="text-ink/60 dark:text-paper/60" />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] text-paper dark:bg-paper dark:text-ink">
              <ArcMark size={12} />
              Arc · 26
            </span>
            <span
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${
                ARC_TESTNET_DEPLOYMENT?.launchpad
                  ? "bg-teal/20 text-teal-2"
                  : "bg-amber/20 text-amber-2"
              }`}
            >
              {ARC_TESTNET_DEPLOYMENT?.launchpad ? "Testnet live" : "Simulation"}
            </span>
          </div>
          <div className="flex max-w-[min(100%,calc(100vw-8rem))] items-center justify-end gap-1.5 sm:gap-2">
            <Link
              to="/app/me"
              className="hidden min-h-10 items-center gap-2 rounded-2xl border border-ink/10 bg-paper-2 px-3 py-2 font-mono text-xs tabular dark:border-paper/15 dark:bg-ink-2 sm:inline-flex"
              title={`Arc ${formatUsdc(usdc)} · all chains ${formatUsdc(allUsdc)}`}
            >
              <UsdcMark size={16} />
              <span>{formatUsdc(usdc)}</span>
            </Link>
            <ConnectWallet />
            <ClayButton variant="ghost" className="min-h-10 min-w-10 px-2.5 sm:px-3" onClick={() => setDark(!dark)} aria-label="Toggle theme">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </ClayButton>
            <ClayButton variant="ghost" className="hidden min-h-10 min-w-10 px-2.5 sm:inline-flex sm:px-3" onClick={reset} aria-label="Clear local cache">
              <RotateCcw size={16} />
            </ClayButton>
          </div>
        </div>
      </header>

      <main className="pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:ml-[72px] md:pb-8">{children}</main>

      <nav className="fixed right-0 bottom-0 left-0 z-30 flex justify-around border-t border-ink/8 bg-paper/95 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden dark:border-paper/10 dark:bg-ink/95">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = n.to === "/app" ? path === "/app" : path.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px]",
                active ? "text-ink dark:text-paper" : "text-muted",
              )}
            >
              <Icon size={18} />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
