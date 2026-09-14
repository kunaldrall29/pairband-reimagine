import { createFileRoute, Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/ui/wordmark";
import { GlassPanel } from "@/components/ui/glass-panel";

export const Route = createFileRoute("/security")({
  component: Security,
  head: () => ({ meta: [{ title: "Security — Pairband" }] }),
});

const ADDRS = [
  ["Launchpad", "0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4"],
  ["Settler", "0x229BD1BcdE44c26E0c7741B46854Ccfb4e54CC40"],
  ["AMM factory", "0x0769121558BB51Fb71Edb933010D294D770e6e18"],
  ["USDC (Arc)", "0x3600000000000000000000000000000000000000"],
] as const;

export function Security() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link to="/">
          <Wordmark />
        </Link>
        <Link to="/app" className="text-sm underline underline-offset-4">
          Open app
        </Link>
      </header>
      <article className="mx-auto max-w-3xl px-5 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Threat model</p>
        <h1 className="mt-2 text-5xl tracking-tight">Honest risk copy.</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Before Stage B you can lose money on the curve. After Stage B the pool cannot be rugged of LP. A bad token
          still trades. This is not insured downside.
        </p>

        <div className="mt-10 space-y-5">
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Stage B LP is burned</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Graduation seeds Uniswap (or a PairbandPair fallback) and sends LP to 0xdead or a locker with no
              decreaseLiquidity path. There is no withdraw, no owner escape, no migrate.
            </p>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Curve can still hurt you</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Before Stage B, price is the bonding curve. You can be early, late, or last. Fees are taken in USDC.
              minAmountOut is required; failed swaps take no fee. This is not risk-free yield.
            </p>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Invariants</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
              <li>Settlement chain is Arc. Only USDC moves cross-chain via CCTP.</li>
              <li>No proxy / no delegatecall on the launch path.</li>
              <li>Per-market vault isolation — one market cannot pay another.</li>
              <li>Fee cap 2.00% in bytecode.</li>
              <li>1B supply; minting permanently disabled after Stage B.</li>
            </ul>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Audit boundary (v1)</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              In scope: Settler, Launchpad + MarketVault, Token, Book, graduation handoff. Out of scope for first audit
              — do not ship on mainnet: Uniswap v4 PairbandHook, agent vaults, Gateway-specific code until the hook
              path matches CCTP, any messenger for launch tokens. Audit: not started.
            </p>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Testnet addresses</h2>
            <dl className="mt-3 space-y-2 font-mono text-xs">
              {ADDRS.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                  <dt className="text-muted">{k}</dt>
                  <dd className="break-all">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted">
              Verified source on Arcscan the day of deploy. Immunefi (or equivalent) bounty live the same day as
              mainnet — even if small.
            </p>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Keys</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The app never holds user keys. The deployer key lives only in the local ops file, never in public env
              vars, never in the browser.
            </p>
          </GlassPanel>
        </div>
      </article>
    </div>
  );
}
