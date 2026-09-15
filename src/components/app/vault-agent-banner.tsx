"use client";

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, Sparkles, X } from "lucide-react";
import { ClayButton } from "@/components/ui/clay-button";
import { AGENT_FEE_USDC_LABEL } from "@/lib/engine/vault-store.ts";

const STORAGE_KEY = "pairband.vaultAgentLive.v1";

export function VaultAgentLaunchBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
      setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-labelledby="vault-agent-live-title"
        className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-paper p-6 shadow-[0_24px_64px_rgba(11,15,20,0.28)] dark:border-paper/15 dark:bg-ink-2"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-ink/5 dark:hover:bg-paper/10"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>

        <div className="flex size-12 items-center justify-center rounded-2xl bg-teal/15 text-teal">
          <Bot size={22} />
        </div>
        <h2 id="vault-agent-live-title" className="mt-4 font-display text-2xl">
          Vault agent — v2 preview
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Optional v2 practice desk — not required for v1 launch or trade. Agent fees are disabled in preview.
          Use Create for launches; open the desk only if you want to try propose → delay → execute.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="text-teal">▸</span>
            Propose / reject / execute rebalances from the Agent desk
          </li>
          <li className="flex gap-2">
            <span className="text-teal">▸</span>
            Deposit as an LP and watch the band move
          </li>
          <li className="flex gap-2">
            <span className="text-teal">▸</span>
            Fees stay off until v2 ships the on-chain desk
          </li>
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link to="/app/curator" className="flex-1" onClick={dismiss}>
            <ClayButton className="w-full">
              <Bot size={16} /> Open practice desk
            </ClayButton>
          </Link>
          <Link to="/docs/vault-agent" className="flex-1" onClick={dismiss}>
            <ClayButton variant="secondary" className="w-full">
              How to use
            </ClayButton>
          </Link>
        </div>
        <Link
          to="/app/create"
          onClick={dismiss}
          className="mt-3 inline-flex items-center gap-2 text-sm text-teal underline underline-offset-4"
        >
          <Sparkles size={14} /> Create with AI draft →
        </Link>
      </div>
    </div>
  );
}
