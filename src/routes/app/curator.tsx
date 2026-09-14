import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bot, BookOpen, Sparkles, Shield } from "lucide-react";
import { toast } from "sonner";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ClayButton } from "@/components/ui/clay-button";
import {
  AGENT_FEE_USDC_LABEL,
  DEMO_AGENT,
  DEMO_CURATOR,
  suggestedBandLabel,
  useVault,
  VAULT_DEMO_ID,
  type VaultRole,
} from "@/lib/engine/vault-store.ts";
import { formatUsd, shortAddr } from "@/lib/utils";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";

export const Route = createFileRoute("/app/curator")({
  component: VaultAgentPage,
  head: () => ({ meta: [{ title: "Vault agent — Pairband" }] }),
});

function VaultAgentPage() {
  const engine = useVault((s) => s.engine);
  const version = useVault((s) => s.version);
  const role = useVault((s) => s.role);
  const account = useVault((s) => s.account);
  const lastError = useVault((s) => s.lastError);
  const lastHash = useVault((s) => s.lastHash);
  const setRole = useVault((s) => s.setRole);
  const doDeposit = useVault((s) => s.deposit);
  const doWithdraw = useVault((s) => s.withdraw);
  const proposeSuggested = useVault((s) => s.proposeSuggested);
  const doReject = useVault((s) => s.reject);
  const doExecute = useVault((s) => s.execute);
  const reset = useVault((s) => s.reset);
  void version;

  const [amount0, setAmount0] = useState("50");
  const [amount1, setAmount1] = useState("50");
  const shares = engine.shares.get(account) ?? 0n;
  const wallet = engine.wallets.get(account) ?? { t0: 0n, t1: 0n };
  const suggestion = useMemo(() => suggestedBandLabel(engine), [engine, version]);
  const desk = ARC_TESTNET_DEPLOYMENT?.agentDesk;
  const explorer = ARC_TESTNET_DEPLOYMENT?.explorer ?? "https://testnet.arcscan.app";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">Vault agent · live</p>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">Propose. Delay. Execute.</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            The vault agent posts a new liquidity band. Curators execute after the delay. Agent proposals cost{" "}
            {AGENT_FEE_USDC_LABEL} USDC on Arc — same fee as the on-chain desk.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/docs/vault-agent"
            className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-ink/10 px-3 text-sm hover:bg-ink/5 dark:border-paper/15"
          >
            <BookOpen size={16} /> How to use
          </Link>
          <Link
            to="/app/create"
            className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-ink/10 px-3 text-sm hover:bg-ink/5 dark:border-paper/15"
          >
            <Sparkles size={16} /> AI draft
          </Link>
        </div>
      </div>

      <GlassPanel className="mt-6 flex flex-wrap items-center gap-3 p-4 text-sm">
        <Bot size={18} className="text-teal" />
        <span>
          On-chain desk{" "}
          {desk ? (
            <a
              className="font-mono text-teal underline underline-offset-2"
              href={`${explorer}/address/${desk}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortAddr(desk, 6)}
            </a>
          ) : (
            "pending"
          )}
          {" · "}fee {AGENT_FEE_USDC_LABEL} USDC · seed vault #
          {ARC_TESTNET_DEPLOYMENT?.agentDeskSeedVaultId ?? 0}
        </span>
      </GlassPanel>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["agent", "Act as agent"],
            ["curator", "Act as curator"],
            ["user", "Act as LP"],
          ] as const
        ).map(([id, label]) => (
          <ClayButton
            key={id}
            variant={role === id ? "primary" : "secondary"}
            onClick={() => setRole(id as VaultRole)}
          >
            {label}
          </ClayButton>
        ))}
        <ClayButton variant="ghost" onClick={() => reset()}>
          Reset demo
        </ClayButton>
      </div>
      <p className="mt-2 font-mono text-xs text-muted">
        Acting as {role} · {shortAddr(account, 6)}
        {role === "agent" ? ` (${shortAddr(DEMO_AGENT, 4)})` : ""}
        {role === "curator" ? ` (${shortAddr(DEMO_CURATOR, 4)})` : ""}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <GlassPanel className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Live band</p>
          <p className="mt-2 font-mono text-2xl">
            [{engine.band.tickLower}, {engine.band.tickUpper})
          </p>
          <p className="mt-2 text-xs text-muted">
            spot tick {engine.tick} · fee {engine.fee / 10_000}%
          </p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Your wallet</p>
          <p className="mt-2 font-mono text-lg">{formatUsd(wallet.t0)} USDC</p>
          <p className="font-mono text-lg">{formatUsd(wallet.t1)} USD1</p>
          <p className="mt-2 text-xs text-muted">shares {shares.toString()}</p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Policy</p>
          <p className="mt-2 text-sm">
            Agent {shortAddr(engine.policy.agent, 4)} · Curator {shortAddr(engine.policy.curator, 4)}
          </p>
          <p className="mt-1 text-xs text-muted">
            delay {engine.policy.proposalDelay}s · maxWidth {engine.policy.maxWidth} · maxShift{" "}
            {engine.policy.maxShift}
          </p>
        </GlassPanel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassPanel className="p-5">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-teal" />
            <h2 className="font-display text-xl">Agent propose</h2>
          </div>
          <p className="mt-2 text-sm text-muted">{suggestion}</p>
          <ClayButton
            className="mt-4 w-full"
            onClick={() => {
              proposeSuggested();
              const err = useVault.getState().lastError;
              if (err) toast.error(err);
              else toast.success(`Proposal posted · agent fee ${AGENT_FEE_USDC_LABEL} USDC`);
            }}
            disabled={role !== "agent" && role !== "curator"}
          >
            Propose suggested band · {AGENT_FEE_USDC_LABEL}
          </ClayButton>
          {engine.proposal?.active ? (
            <div className="mt-4 rounded-2xl bg-teal/10 p-3 text-sm">
              Active proposal [{engine.proposal.tickLower}, {engine.proposal.tickUpper}) by{" "}
              {shortAddr(engine.proposal.proposer ?? engine.proposal.postedBy ?? account, 4)}
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted">No active proposal.</p>
          )}
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-teal" />
            <h2 className="font-display text-xl">Curator execute</h2>
          </div>
          <p className="mt-2 text-sm text-muted">
            After the delay, only the curator can execute or reject. Execution moves the live band.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ClayButton
              onClick={() => {
                doExecute();
                const err = useVault.getState().lastError;
                if (err) toast.error(err);
                else toast.success("Band executed — vault rebalanced");
              }}
              disabled={role !== "curator" || !engine.proposal?.active}
            >
              Execute rebalance
            </ClayButton>
            <ClayButton
              variant="secondary"
              onClick={() => {
                doReject();
                const err = useVault.getState().lastError;
                if (err) toast.error(err);
                else toast.message("Proposal rejected");
              }}
              disabled={role !== "curator" || !engine.proposal?.active}
            >
              Reject
            </ClayButton>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="mt-6 p-5">
        <h2 className="font-display text-xl">LP deposit / withdraw</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            USDC
            <input
              value={amount0}
              onChange={(e) => setAmount0(e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-3 font-mono dark:border-paper/15 dark:bg-ink-2"
            />
          </label>
          <label className="block text-sm">
            USD1
            <input
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-3 font-mono dark:border-paper/15 dark:bg-ink-2"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <ClayButton
            onClick={() => {
              doDeposit(amount0, amount1);
              const err = useVault.getState().lastError;
              if (err) toast.error(err);
              else toast.success("Deposited");
            }}
          >
            Deposit
          </ClayButton>
          <ClayButton
            variant="secondary"
            onClick={() => {
              doWithdraw(shares.toString());
              const err = useVault.getState().lastError;
              if (err) toast.error(err);
              else toast.success("Withdrew");
            }}
            disabled={shares === 0n}
          >
            Withdraw all shares
          </ClayButton>
          <Link
            to="/app/p/$chainId/$vault"
            params={{ chainId: String(engine.chainId), vault: VAULT_DEMO_ID }}
            className="inline-flex min-h-11 items-center text-sm text-teal underline underline-offset-4"
          >
            Open vault detail →
          </Link>
        </div>
      </GlassPanel>

      {(lastError || lastHash) && (
        <p className="mt-4 font-mono text-xs text-muted">
          {lastError ? `Error: ${lastError}` : `Last tx ${lastHash?.slice(0, 18)}…`}
        </p>
      )}

      <GlassPanel className="mt-6 p-5">
        <h2 className="font-display text-xl">Activity</h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
          {engine.activity.slice(0, 12).map((a) => (
            <li
              key={a.id}
              className="flex justify-between gap-3 border-b border-ink/5 pb-2 dark:border-paper/10"
            >
              <span>
                <span className="font-mono text-teal">{a.kind}</span> · {a.detail}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">{shortAddr(a.hash, 4)}</span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
