"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/ui/wordmark";
import { ClayButton } from "@/components/ui/clay-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TokenGlyph } from "@/components/ui/token-glyph";
import { HeroPills } from "@/components/marketing/hero-pills";
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
            <a href="#markets" className="transition-colors hover:text-ink">
              Markets
            </a>
            <a href="https://docs.pairband.com" className="transition-colors hover:text-ink">
              Docs
            </a>
            <Link to="/security" className="transition-colors hover:text-ink">
              Security
            </Link>
          </div>
          <Link to="/app">
            <ClayButton className="min-h-10 px-4 text-sm">Open app</ClayButton>
          </Link>
        </GlassPanel>
      </nav>

      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(42,46,50,0.18),transparent_42%),radial-gradient(ellipse_at_88%_70%,rgba(79,179,165,0.22),transparent_48%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pt-28 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-8 md:pt-32 md:pb-20">
          <div className="hero-copy max-w-xl">
            <p className="font-mono text-[11px] tracking-[0.22em] text-teal uppercase">
              Stablecoin launchpad on Arc
            </p>
            <h1 className="mt-4 text-[2.35rem] leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Cover the downside.
              <br />
              Keep the upside.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Pay USDC from any CCTP chain. Fill the Arc book. Tokens never leave.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/app">
                <ClayButton>Trade</ClayButton>
              </Link>
              <Link to="/app/create">
                <ClayButton variant="secondary">Create token</ClayButton>
              </Link>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <UsdcMark size={16} />
                <span className="font-mono text-[11px] tracking-wide uppercase">USDC</span>
              </span>
              <span aria-hidden className="text-paper-3">
                /
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ArcMark size={14} />
                <span>Quoted in USDC · Settled on Arc</span>
              </span>
            </p>
          </div>
          <div className="hero-visual aspect-[5/4] w-full md:aspect-auto md:h-[min(520px,70vh)]">
            <HeroPills className="h-full shadow-clay" />
          </div>
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
        <dl className="mt-8 grid grid-cols-3 gap-4 font-mono text-sm">
          <div>
            <dt className="text-[11px] text-muted uppercase">Markets</dt>
            <dd className="mt-1 tabular text-lg font-medium">{stats.count}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted uppercase">Books</dt>
            <dd className="mt-1 tabular text-lg font-medium">{stats.graduated}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted uppercase">Volume</dt>
            <dd className="mt-1 tabular text-lg font-medium">{formatCompact(stats.volume)}</dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <p className="font-mono text-[11px] tracking-[0.22em] text-teal uppercase">How it works</p>
        <h2 className="mt-3 text-4xl tracking-tight">Curve. Pair. Lock.</h2>
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
                  <p className="font-mono text-[11px] text-teal">{s.n}</p>
                  <h3 className="mt-2 text-2xl tracking-tight">{s.title}</h3>
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
            <h2 className="mt-3 text-4xl tracking-tight">Markets on Arc</h2>
          </div>
          <Link to="/app" className="hidden text-sm text-teal-2 transition-colors hover:text-ink sm:block">
            Open discover
          </Link>
        </div>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Preview book mirrors the contracts. Connect a wallet on Arc testnet to broadcast when the factory is live.
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
        <p className="font-mono text-[11px] tracking-[0.22em] text-teal uppercase">Policy, not vibes</p>
        <h2 className="mt-3 text-4xl tracking-tight">The pair is the lock.</h2>
        <div className="mt-8 overflow-hidden rounded-[24px] border border-ink/6 bg-paper-2 p-6 shadow-clay-sm md:p-8">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Quote", "USDC (Arc native)"],
              ["Settle", "Arc CCTP domain 26"],
              ["In", "ETH · Base · UNI · ARB · OP · SOL"],
              ["Graduate", formatUsdc(GRADUATE_AT)],
              ["Launch fee", "$1 USDC"],
              ["Agent fee", "$0.25 / propose"],
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
          Pairband. Any chain in. Settlement on Arc. Testnet live. No audit. Mainnet when testnet hashes hold.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
          <a href="https://docs.pairband.com">Docs</a>
          <a href="https://docs.pairband.com/docs/business-model">Business model</a>
          <Link to="/security">Security</Link>
          <Link to="/app/trade">Trade</Link>
          <a href="https://testnet.arcscan.app/address/0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4">Arcscan</a>
        </div>
      </footer>
    </div>
  );
}
