import { createFileRoute, Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/ui/wordmark";
import { GlassPanel } from "@/components/ui/glass-panel";

export const Route = createFileRoute("/security")({
  component: Security,
  head: () => ({ meta: [{ title: "Security — Pairband" }] }),
});

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
        <h1 className="mt-2 text-5xl tracking-tight">What graduation cannot undo.</h1>

        <div className="mt-10 space-y-5">
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">LP is burned</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The factory mints the Uniswap-style pair and sends LP to 0xdead. There is no withdraw, no owner escape,
              no migrate. A bad token still trades; the pool cannot be rugged of that liquidity.
            </p>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Curve can still hurt you</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Before graduation, price is the bonding curve. You can be early, late, or last. Fees are taken in USDC.
              minAmountOut is required. This is not risk-free yield.
            </p>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Creator cannot mint extra</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The token minter is the launchpad. Supply is capped at one billion. Buys mint; curve sells burn returned
              inventory so churn cannot inflate supply. Graduation mints the remainder into the pair. There is no admin
              mint.
            </p>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">Keys</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The app never holds user keys. The deployer key lives only in the local ops file, never in public env
              vars, never in the browser. Fund it from Circle's faucet. No upgradeable proxy. No delegatecall.
            </p>
          </GlassPanel>
          <GlassPanel className="p-6">
            <h2 className="font-display text-2xl">No audit</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Testnet. Contracts are CEI, reentrancy-guarded, fee-capped. Treat them as unaudited. The preview you
              click here is a local engine that mirrors the math — labeled as such.
            </p>
          </GlassPanel>
        </div>
      </article>
    </div>
  );
}
