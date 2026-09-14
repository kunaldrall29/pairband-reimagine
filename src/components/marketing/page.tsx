"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/ui/wordmark";
import { ClayButton } from "@/components/ui/clay-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { StatusChip } from "@/components/ui/status-chip";
import { HeroPills } from "@/components/marketing/hero-pills";
import { StepArt } from "@/components/marketing/step-art";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { hydrateLaunchpad, useLaunchpad } from "@/lib/engine/store.ts";
import { isOnchainLaunchId, graduateProgress, marketCap, priceOf, protocolStats, raisedOf } from "@/lib/engine/launchpad.ts";
import { formatCompact, formatPriceWad, formatUsdc } from "@/lib/format.ts";
import { ArcMark } from "@/components/ui/arc-mark";
import { UsdcMark } from "@/components/ui/usdc-mark";

const STEPS = [
  {
    n: "01",
    kind: "create" as const,
    title: "Create on Arc.",
    body: "Name, ticker, image. $1 USDC launch fee. One billion supply, 18 decimals. Optional first buy in the same transaction.",
    still: "/stills/bound-tokens.jpg",
    alt: "Two clay tokens bound by a liquid-glass amber-teal ring",
  },
  {
    n: "02",
    kind: "curve" as const,
    title: "Sellable USDC curve.",
    body: "Constant-product quoted in native Arc USDC. 1.0% protocol + 0.5% creator. minAmountOut on every ticket — failed swaps take no fee. Exit anytime until Stage B.",
    still: "/stills/glass-card.jpg",
    alt: "Frosted glass card with amber and teal wave bands",
  },
  {
    n: "03",
    kind: "book" as const,
    title: "Book, then locked Uniswap.",
    body: "Stage A opens the on-chain book at a real USDC threshold. Stage B locks liquidity in Uniswap — LP to 0xdead. Market orders walk the book, then the pool. Tokens never leave Arc.",
    still: "/stills/dashboard.jpg",
    alt: "Pairband desk with markets and a hardware wallet",
  },
];

export function MarketingPage() {
  const root = useRef<HTMLDivElement>(null);
  const engine = useLaunchpad((s) => s.engine);
  const version = useLaunchpad((s) => s.version);
  void version;
  const stats = protocolStats(engine);
  const featured = engine.launches.filter((l) => isOnchainLaunchId(l.id)).slice(0, 6);

  useEffect(() => {
    hydrateLaunchpad();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !root.current) return;
    let reverted = false;
    let ctx: { revert: () => void } | undefined;
    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (reverted || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".hero-copy", { y: 28, opacity: 0, duration: 0.85, ease: "power2.out" });
        gsap.from(".hero-visual", { opacity: 0, scale: 0.97, duration: 1, ease: "power2.out", delay: 0.1 });
        gsap.utils.toArray<HTMLElement>(".step-card").forEach((el, i) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          });
        });
        gsap.from(".waitlist-block", {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: { trigger: ".waitlist-block", start: "top 88%" },
        });
      }, root);
    })();
    return () => {
      reverted = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={root} className="bg-paper text-ink">
      <nav className="fixed top-3 right-3 left-3 z-40 mx-auto max-w-6xl sm:top-4 sm:right-4 sm:left-4">
        <GlassPanel className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5">
          <Wordmark />
          <div className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#markets" className="transition-colors hover:text-ink">
              Markets
            </a>
            <a href="#waitlist" className="transition-colors hover:text-ink">
              Waitlist
            </a>
            <a href="https://docs.pairband.com" className="transition-colors hover:text-ink">
              Docs
            </a>
            <Link to="/security" className="transition-colors hover:text-ink">
              Security
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <a href="#waitlist" className="hidden sm:block">
              <ClayButton variant="secondary" className="min-h-10 px-3 text-sm">
                Waitlist
              </ClayButton>
            </a>
            <Link to="/app">
              <ClayButton className="min-h-10 px-4 text-sm">Open app</ClayButton>
            </Link>
          </div>
        </GlassPanel>
      </nav>

      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(42,46,50,0.18),transparent_42%),radial-gradient(ellipse_at_88%_70%,rgba(79,179,165,0.22),transparent_48%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 pt-24 pb-12 sm:gap-10 sm:pt-28 sm:pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-8 md:pt-32 md:pb-20">
          <div className="hero-copy max-w-xl">
            <p className="font-mono text-[11px] tracking-[0.22em] text-teal uppercase">
              Pairband · Arc testnet live
            </p>
            <h1 className="mt-4 font-display text-[2.35rem] leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.1rem]">
              Pairband
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Launch in USDC on Arc. Buyers pay from any CCTP chain. The token never leaves. At a real USDC
              threshold — not eighty dollars — we lock Uniswap liquidity and keep an on-chain book beside it.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/app">
                <ClayButton>Trade on testnet</ClayButton>
              </Link>
              <a href="#waitlist">
                <ClayButton variant="secondary">Mainnet waitlist</ClayButton>
              </a>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <UsdcMark size={16} />
                <span className="font-mono text-[11px] tracking-wide uppercase">USDC gas + quote</span>
              </span>
              <span aria-hidden className="text-paper-3">
                /
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ArcMark size={14} />
                <span>CCTP domain 26 · Settlement on Arc</span>
              </span>
            </p>
          </div>
          <div className="hero-visual mt-2 aspect-[5/4] max-h-[340px] w-full sm:max-h-none md:mt-0 md:aspect-auto md:h-[min(520px,70vh)]">
            <HeroPills className="h-full shadow-clay" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4">
        <dl className="grid grid-cols-3 gap-4 font-mono text-sm">
          <div>
            <dt className="text-[11px] text-muted uppercase">Markets</dt>
            <dd className="mt-1 tabular text-lg font-medium">{stats.count}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted uppercase">Stage B</dt>
            <dd className="mt-1 tabular text-lg font-medium">{stats.graduated}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted uppercase">Volume</dt>
            <dd className="mt-1 tabular text-lg font-medium">{formatCompact(stats.volume)}</dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <p className="font-mono text-[11px] tracking-[0.22em] text-teal uppercase">How it works</p>
        <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">Curve. Book. Lock.</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Most pads graduate into a ghost pool: LP can flee, the quote is noisy, and there is no book. Pairband issues
          on Arc in USDC. The curve is sellable. Stage A is discovery. Stage B is permanent liquidity.
        </p>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <article key={s.n} className="step-card">
              <GlassPanel className="overflow-hidden">
                <StepArt kind={s.kind} still={s.still} alt={s.alt} />
                <div className="p-4 sm:p-5">
                  <p className="font-mono text-[11px] text-teal">{s.n}</p>
                  <h3 className="mt-1.5 text-xl tracking-tight sm:mt-2 sm:text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </GlassPanel>
            </article>
          ))}
        </div>
      </section>

      <section id="markets" className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-teal uppercase">Live markets</p>
            <h2 className="mt-3 text-4xl tracking-tight">On Arc testnet</h2>
          </div>
          <Link to="/app" className="hidden text-sm text-teal-2 transition-colors hover:text-ink sm:block">
            Open discover
          </Link>
        </div>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Status chips: Curve · Stage A Book · Stage B Locked. Connect a wallet on Arc testnet to create and trade.
        </p>
        <div className="mt-6 overflow-x-auto rounded-[20px] border border-ink/8 bg-paper-2 sm:mt-8 sm:rounded-[24px]">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead className="font-mono text-[11px] text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="hidden px-4 py-3 sm:table-cell">FDV</th>
                <th className="px-4 py-3">Raised</th>
              </tr>
            </thead>
            <tbody>
              {featured.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No on-chain markets yet — open the app to sync Arc or create a token.
                  </td>
                </tr>
              ) : (
                featured.map((l) => (
                  <tr key={l.id} className="border-t border-ink/8 transition-colors hover:bg-paper/80">
                    <td className="px-4 py-3">
                      <Link to="/app/t/$id" params={{ id: l.id }} className="flex items-center gap-3">
                        <TokenGlyph symbol={l.symbol} hue={l.hue} size={28} />
                        <span>
                          <span className="block font-medium">{l.name}</span>
                          <span className="block font-mono text-[11px] text-muted">{l.symbol}/USDC</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {l.status === "curve" ? (
                        <span className="font-mono text-[11px] uppercase">
                          Curve {Math.round(graduateProgress(l) * 100)}%
                        </span>
                      ) : (
                        <StatusChip status={l.status} compact />
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono tabular">{formatPriceWad(priceOf(l))}</td>
                    <td className="hidden px-4 py-3 font-mono tabular sm:table-cell">{formatCompact(marketCap(l))}</td>
                    <td className="px-4 py-3 font-mono tabular">{formatUsdc(raisedOf(l))}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section id="waitlist" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="waitlist-block">
          <WaitlistForm />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="font-mono text-[11px] tracking-[0.22em] text-teal uppercase">Policy in bytecode</p>
        <h2 className="mt-3 text-4xl tracking-tight">Fees and invariants.</h2>
        <div className="mt-8 overflow-hidden rounded-[24px] border border-ink/6 bg-paper-2 p-6 shadow-clay-sm md:p-8">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Quote", "Native Arc USDC"],
              ["Settle", "Arc · CCTP 26"],
              ["Pay from", "ETH · Base · ARB · OP · UNI · SOL"],
              ["Testnet Stage B", "$80 (faucet demo)"],
              ["Mainnet Stage A", "$2,000 · 15 buyers"],
              ["Mainnet Stage B", "$12k / $20k hard"],
              ["Launch fee", "$1 USDC"],
              ["Curve fee", "1.0% + 0.5%"],
              ["Book taker", "0.10%"],
              ["Uniswap", "0.30% · LP dead"],
              ["Fee cap", "2.00% in bytecode"],
              ["Bytecode", "Same on mainnet 5042"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[11px] text-muted uppercase">{k}</dt>
                <dd className="mt-1 font-mono text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-20">
        <Wordmark size="lg" className="footer-mark" />
        <p className="mt-4 max-w-lg text-sm text-muted">
          Pairband v1. Live on testnet. Mainnet after the hashes hold and the settler is under audit. Built on Circle
          CCTP and Uniswap on Arc — not a partnership claim.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
          <a href="https://docs.pairband.com">Docs</a>
          <Link to="/security">Security</Link>
          <Link to="/app/trade">Trade</Link>
          <Link to="/app/bridge">Bridge USDC</Link>
          <a href="https://testnet.arcscan.app/address/0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4">Arcscan</a>
        </div>
      </footer>
    </div>
  );
}
