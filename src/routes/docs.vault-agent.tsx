import { createFileRoute, Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/ui/wordmark";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AGENT_FEE_USDC_LABEL } from "@/lib/engine/vault-store.ts";
import { shortAddr } from "@/lib/utils";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";

export const Route = createFileRoute("/docs/vault-agent")({
  component: VaultAgentDocs,
  head: () => ({ meta: [{ title: "Vault agent — Pairband docs" }] }),
});

function VaultAgentDocs() {
  const desk = ARC_TESTNET_DEPLOYMENT?.agentDesk;
  const explorer = ARC_TESTNET_DEPLOYMENT?.explorer ?? "https://testnet.arcscan.app";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link to="/">
          <Wordmark />
        </Link>
        <div className="flex gap-4 text-sm">
          <Link to="/docs" className="underline underline-offset-4">
            Docs
          </Link>
          <Link to="/app/curator" className="underline underline-offset-4">
            Open agent
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Vault agent · v2</p>
        <h1 className="mt-2 font-display text-5xl">Propose. Delay. Execute.</h1>
        <p className="mt-4 text-muted">
          Parked for v2 — not required for Pairband v1 launches or trading. The practice desk still lets you post a
          concentrated-liquidity band and have a named curator execute after a delay. Agent fees are off in the
          preview engine ({AGENT_FEE_USDC_LABEL} documents the future on-chain desk).
        </p>

        <GlassPanel className="mt-10 p-6">
          <h2 className="font-display text-2xl">What you can do</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <span className="font-mono text-ink">Act as agent</span> — propose a suggested band centered on spot
              (pays {AGENT_FEE_USDC_LABEL} USDC).
            </li>
            <li>
              <span className="font-mono text-ink">Act as curator</span> — execute after the delay, or reject.
            </li>
            <li>
              <span className="font-mono text-ink">Act as LP</span> — deposit USDC + USD1, then watch the band move.
            </li>
          </ul>
          <Link
            to="/app/curator"
            className="mt-4 inline-block text-sm text-teal underline underline-offset-4"
          >
            Open the agent desk →
          </Link>
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">How to use</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>Open the Agent desk and choose <strong className="text-ink">Act as agent</strong>.</li>
            <li>
              Click <strong className="text-ink">Propose suggested band</strong>. Ticks are computed deterministically —
              never by the LLM.
            </li>
            <li>Switch to <strong className="text-ink">Act as curator</strong>. Wait for the proposal delay.</li>
            <li>
              Click <strong className="text-ink">Execute rebalance</strong> to move the live band, or Reject to discard.
            </li>
            <li>As LP, deposit both tokens, then open the vault detail page to inspect inventory.</li>
          </ol>
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">Create with AI draft</h2>
          <p className="mt-2 text-sm text-muted">
            On Launch, describe a token idea and generate a name, symbol, and description. Review the draft, then
            confirm — nothing launches until you submit. If Grok is configured it drafts with the model; otherwise a
            local fallback fills the form.
          </p>
          <Link to="/app/create" className="mt-4 inline-block text-sm text-teal underline underline-offset-4">
            Create with AI draft →
          </Link>
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">On-chain desk</h2>
          <p className="mt-2 text-sm text-muted">
            <span className="font-mono text-ink">VaultAgentDesk</span> on Arc testnet (
            {ARC_TESTNET_DEPLOYMENT?.agentDeskSeedVaultId ?? 0} seed vault). Fee{" "}
            {AGENT_FEE_USDC_LABEL} USDC per agent proposal.
          </p>
          {desk ? (
            <a
              href={`${explorer}/address/${desk}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-mono text-sm text-teal underline underline-offset-4"
            >
              {shortAddr(desk, 8)}
            </a>
          ) : null}
        </GlassPanel>
      </article>
    </div>
  );
}
