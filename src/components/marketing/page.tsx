"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/ui/wordmark";
import { ClayButton } from "@/components/ui/clay-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { BandField } from "@/components/marketing/band-field";
import { hydrateLaunchpad, useLaunchpad } from "@/lib/engine/store.ts";
import { graduateProgress, marketCap, priceOf, protocolStats, raisedOf } from "@/lib/engine/launchpad.ts";
import { GRADUATE_AT } from "@/lib/engine/constants.ts";
import { formatCompact, formatPriceWad, formatUsdc } from "@/lib/format.ts";
import { ArcMark } from "@/components/ui/arc-mark";
import { UsdcMark } from "@/components/ui/usdc-mark";

const STEPS = [
  {
    n: "01",
    title: "Create on Arc.",
    body: "Name, ticker, optional first buy. Supply is one billion. The quote asset is native USDC — the same token that pays gas on Arc.",
    still: "/stills/bound-tokens.jpg",
    alt: "Two clay tokens bound by a liquid-glass amber-teal ring",
  },
  {
    n: "02",
    title: "Fill the USDC curve.",
    body: "Buys and sells hit a constant-product bonding curve. 1.0% protocol + 0.5% creator, taken in USDC. You can exit on the curve before it fills.",
    still: "/stills/glass-card.jpg",
    alt: "Frosted glass card with amber and teal wave bands, embossed Pairband",
  },
  {
    n: "03",
    title: "Book, then Uniswap.",
    body: "At $80 the remaining inventory and USDC mint a locked Uniswap pair. An on-chain order book opens on the same ticket. Market walks the book (price-time); leftover hits the pair at 0.30%. Limits rest. LP burns to 0xdead.",
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
  const featured = engine.launches.slice(0, 6);

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
        gsap.from(".hero-copy", { y: 24, opacity: 0, duration: 0.8, ease: "power2.out" });
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
      }, root);
    })();
    return () => {
      reverted = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={root} className="bg-paper text-ink">
      <nav className="fixed top-4 right-4 left-4 z-40 mx-auto max-w-6xl">
        <GlassPanel className="flex items-center justify-between px-4 py-2.5 md:px-5">
          <Wordmark />
          <div className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#markets" className="hover:text-ink">
              Markets
            </a>
            <Link to="/docs" className="hover:text-ink">
              Docs
            </Link>
            <Link to="/security" className="hover:text-ink">
              Security
            </Link>
          </div>
          <Link to="/app">
            <ClayButton className="min-h-10 px-4 text-sm">Open app</ClayButton>
          </Link>
        </GlassPanel>
      </nav>

      <section className="relative mx-auto flex max-w-6xl flex-col gap-8 px-5 pt-28 pb-12 md:min-h-[88vh] md:flex-row md:items-center md:gap-12 md:pt-28 md:pb-16">
        <div className="hero-copy max-w-xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
            Any chain. Settlement on Arc.
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.08] text-ink md:text-6xl">
            Pay USDC. Fill the Arc book.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Launch on a USDC curve. Graduate into a locked Uniswap pair. CCTP brings cash from any chain; the token
            stays on Arc.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/app">
              <ClayButton>Trade</ClayButton>
            </Link>
            <Link to="/app/create">
              <ClayButton variant="secondary">Create token</ClayButton>
            </Link>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 font-mono text-sm">
            <div>
              <dt className="text-[11px] text-muted uppercase">Markets</dt>
              <dd className="tabular">{stats.count}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted uppercase">Books</dt>
              <dd className="tabular">{stats.graduated}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted uppercase">Volume</dt>
              <dd className="tabular">{formatCompact(stats.volume)}</dd>
            </div>
          </dl>
        </div>
        <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px] shadow-clay md:aspect-auto md:h-[480px] md:flex-1">
          <BandField className="h-full w-full" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4">
        <figure className="overflow-hidden rounded-[24px] bg-ink shadow-clay">
          <img
            src="/brand/arc-hero.jpg"
            alt="Arc"
            className="mx-auto h-auto max-h-52 w-full object-contain sm:max-h-64"
          />
        </figure>
        <p className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <UsdcMark size={12} /> Quoted in USDC
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <ArcMark size={12} /> Settled on Arc · CCTP 26
          </span>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">How it works</p>
        <h2 className="mt-3 font-display text-4xl">Curve. Pair. Lock.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <article key={s.n} className="step-card">
              <GlassPanel className="overflow-hidden">
                <img
                  src={s.still}
                  alt={s.alt}
                  className="aspect-[4/3] w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
                />
                <div className="p-5">
                  <p className="font-mono text-[11px] text-amber-2">{s.n}</p>
                  <h3 className="mt-2 font-display text-2xl">{s.title}</h3>
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
            <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Live in this preview</p>
            <h2 className="mt-3 font-display text-4xl">Markets on Arc</h2>
          </div>
          <Link to="/app" className="hidden text-sm text-teal-2 sm:block">
            Open discover
          </Link>
        </div>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Numbers are this demo book, not a published TVL. Teal Machine is one buy from Uniswap.
        </p>
        <div className="mt-8 overflow-hidden rounded-[24px] border border-ink/8 bg-paper-2">
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-[11px] text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Price</th>
                <th className="hidden px-4 py-3 sm:table-cell">FDV</th>
                <th className="px-4 py-3">Raised</th>
              </tr>
            </thead>
            <tbody>
              {featured.map((l) => (
                <tr key={l.id} className="border-t border-ink/8">
                  <td className="px-4 py-3">
                    <Link to="/app/t/$id" params={{ id: l.id }} className="flex items-center gap-3">
                      <TokenGlyph symbol={l.symbol} hue={l.hue} size={28} />
                      <span>
                        <span className="block font-medium">{l.name}</span>
                        <span className="block font-mono text-[11px] text-muted">{l.symbol}/USDC</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] uppercase">
                    {l.status === "graduated" ? (
                      <span className="text-teal-2">Uniswap</span>
                    ) : (
                      <span>Curve {Math.round(graduateProgress(l) * 100)}%</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono tabular">{formatPriceWad(priceOf(l))}</td>
                  <td className="hidden px-4 py-3 font-mono tabular sm:table-cell">{formatCompact(marketCap(l))}</td>
                  <td className="px-4 py-3 font-mono tabular">{formatUsdc(raisedOf(l))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Policy, not vibes</p>
        <h2 className="mt-3 font-display text-4xl">The pair is the lock.</h2>
        <div className="mt-8 overflow-hidden rounded-[24px] bg-paper-2 p-6 shadow-[20px_20px_40px_rgba(11,15,20,0.18)] md:p-8">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Quote", "USDC (Arc native)"],
              ["Settle", "Arc CCTP domain 26"],
              ["In", "ETH · Base · UNI · ARB · OP · SOL"],
              ["Graduate", formatUsdc(GRADUATE_AT)],
              ["Curve fee", "1.0% + 0.5%"],
              ["Uniswap fee", "0.30%"],
              ["LP", "Burned to 0xdead"],
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
        <p className="mt-4 max-w-md text-sm text-muted">
          Pairband. Any chain in. Settlement on Arc. Testnet only until the factory is funded. No audit.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
          <Link to="/docs">Docs</Link>
          <Link to="/security">Security</Link>
          <Link to="/app/trade">Trade</Link>
        </div>
      </footer>
    </div>
  );
}
