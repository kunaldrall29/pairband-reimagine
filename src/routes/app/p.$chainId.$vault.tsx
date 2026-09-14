import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ClayButton } from "@/components/ui/clay-button";
import { AGENT_FEE_USDC_LABEL, useVault } from "@/lib/engine/vault-store.ts";
import { formatUsd, shortAddr } from "@/lib/utils";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";

export const Route = createFileRoute("/app/p/$chainId/$vault")({
  component: VaultDetailPage,
  head: () => ({ meta: [{ title: "Vault — Pairband" }] }),
});

function VaultDetailPage() {
  const { chainId, vault } = Route.useParams();
  const engine = useVault((s) => s.engine);
  const version = useVault((s) => s.version);
  void version;
  const desk = ARC_TESTNET_DEPLOYMENT?.agentDesk;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-28 md:pb-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">Vault · {chainId}</p>
      <h1 className="mt-1 font-display text-3xl">{engine.name}</h1>
      <p className="mt-1 font-mono text-sm text-muted">{shortAddr(vault, 8)}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <GlassPanel className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Band</p>
          <p className="mt-2 font-mono text-xl">
            [{engine.band.tickLower}, {engine.band.tickUpper})
          </p>
          <p className="mt-2 text-xs text-muted">tick {engine.tick}</p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Inventory</p>
          <p className="mt-2 text-sm">
            Idle {formatUsd(engine.idle0)} USDC · {formatUsd(engine.idle1)} USD1
          </p>
          <p className="mt-1 text-xs text-muted">liq {engine.totalLiquidity.toString()}</p>
        </GlassPanel>
      </div>

      <GlassPanel className="mt-4 p-5 text-sm">
        <p>
          Agent {shortAddr(engine.policy.agent, 6)} · Curator {shortAddr(engine.policy.curator, 6)} · fee{" "}
          {AGENT_FEE_USDC_LABEL} / propose
        </p>
        {desk && (
          <p className="mt-2 font-mono text-xs text-muted">Desk {shortAddr(desk, 8)} on Arc testnet</p>
        )}
      </GlassPanel>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/app/curator">
          <ClayButton>Open agent desk</ClayButton>
        </Link>
        <Link to="/docs/vault-agent">
          <ClayButton variant="secondary">Vault agent docs</ClayButton>
        </Link>
      </div>
    </div>
  );
}
