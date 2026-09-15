import { createFileRoute, Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/ui/wordmark";
import { GlassPanel } from "@/components/ui/glass-panel";
import { DEPLOYER, GRADUATE_AT } from "@/lib/engine/constants.ts";
import { formatUsdc } from "@/lib/format.ts";
import { shortAddr } from "@/lib/utils";

export const Route = createFileRoute("/docs/")({
  component: Docs,
  head: () => ({ meta: [{ title: "Docs — Pairband" }] }),
});

export function Docs() {
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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Launchpad</p>
        <h1 className="mt-2 font-display text-5xl">Curve, then Uniswap.</h1>
        <p className="mt-4 text-muted">
          Pairband is the Arc launchpad. Tokens are quoted in USDC. At {formatUsdc(GRADUATE_AT)} raised, remaining
          inventory and cash mint a constant-product pair. LP is burned to 0xdead.
        </p>

        <GlassPanel className="mt-10 p-6">
          <h2 className="font-display text-2xl">Venues</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            One ticket. If <span className="font-mono text-ink">status == curve</span>, buy/sell hit x·y=k virtual
            reserves (80 USDC × 1B tokens). If graduated, the same function routes through the pair: Uniswap v2
            getAmountOut, 0.30% fee, k conserved after fee.
          </p>
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">Graduation</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The filling buy transfers remaining tokens and real USDC into a new pair, mints LP, and sends it to
            0xdead. There is no removeLiquidity on the locker. After that, price impact is the Uniswap curve, not the
            bonding curve.
          </p>
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">Fees</h2>
          <ul className="mt-3 space-y-1 font-mono text-sm">
            <li>Launch $1.00 USDC on Arc · one-time at create</li>
            <li>Vault agent (v2 preview) — fees off until the on-chain desk ships</li>
            <li>Curve protocol 1.00% · creator 0.50% · paid in USDC</li>
            <li>Uniswap swap 0.30% · stays in the pool</li>
            <li>Cap 2.00% in code · no fee on a failed swap</li>
          </ul>
          <a
            href="https://docs.pairband.com/business-model"
            className="mt-4 inline-block text-sm text-teal underline underline-offset-4"
          >
            Business model →
          </a>
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">Arc</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Chain ID 5042002 (testnet), 5042 (mainnet). USDC is gas and quote. ERC-20 interface
            0x3600000000000000000000000000000000000000. Deployer {shortAddr(DEPLOYER, 6)}. Same bytecode on both
            networks. Private keys never enter the app.
          </p>
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">Any chain, settle on Arc</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Circle CCTP v2. Arc is domain 26. TokenMessenger{" "}
            <span className="font-mono text-ink">0x8FE6…2DAA</span>. A buy from Ethereum, Base, Unichain, Arbitrum, OP,
            or Solana burns source USDC and mints on Arc into{" "}
            <span className="font-mono text-ink">PairbandSettler</span>, which routes into the launchpad or book.
            Tokens never leave Arc. Bridge out burns Arc USDC back to the dest domain. Preview settles instantly;
            live Fast Transfer applies on ETH/Base/Unichain.
          </p>
        </GlassPanel>
        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">On-chain book</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            After graduation, <span className="font-mono text-ink">PairbandBook</span> is a fully on-chain CLOB:
            escrowed bids and asks, price-time via a linked list, cancel returns the remainder. Market orders walk
            the book then the locked Uniswap pair (0.30%). Arc's USDC gas and ~0.5s finality make resting on-chain
            viable. There is no off-chain matcher.
          </p>
        </GlassPanel>
        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">Vault agent</h2>
          <p className="mt-2 text-sm text-muted">
            Optional v2 practice desk: agent proposes a band, curator executes after a delay. Not required for v1 launch or trade.
          </p>
          <Link to="/docs/vault-agent" className="mt-4 inline-block text-sm text-teal underline underline-offset-4">
            Vault agent guide →
          </Link>
        </GlassPanel>

        <GlassPanel className="mt-6 p-6">
          <h2 className="font-display text-2xl">Contracts</h2>
          <p className="mt-2 text-sm text-muted">
            <span className="font-mono text-ink">PairbandLaunchpad</span> creates tokens and routes buys.
            <span className="font-mono text-ink"> PairbandBook</span> is the CLOB.
            <span className="font-mono text-ink">PairbandSettler</span> is the CCTP inbox.
            Addresses live in
            packages/config/deployments.json per chain.
          </p>
        </GlassPanel>
      </article>
    </div>
  );
}
