import { createFileRoute, Link } from "@tanstack/react-router";
import { SashShell } from "@/components/sash/shell";
import { SASH } from "@/lib/sash/constants";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SashShell>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 sheen opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 60% at 85% 40%, rgba(109,40,217,0.22), transparent 55%), linear-gradient(180deg, #f7f6f4 0%, #eeedeb 100%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pb-20 lg:pt-14">
          <div className="rise space-y-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sash">
              {SASH.domain} · {SASH.handle}
            </p>
            <img
              src="/art/logo-3d.jpg"
              alt="Sash"
              className="h-16 w-16 rounded-2xl object-cover shadow-soft sm:h-20 sm:w-20"
            />
            <h1 className="max-w-[12ch] text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              Your logo on event clothes.
            </h1>
            <p className="max-w-md text-base text-muted sm:text-lg">
              Sellers already tweet the dress. Buyers already bid in DMs. Sash locks the USDC until
              the photo exists.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/e/$slug"
                params={{ slug: "token2049" }}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-sash px-5 text-base font-semibold text-white shadow-soft hover:bg-sash-2"
              >
                Browse Token2049 slots
              </Link>
              <Link
                to="/import"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-ink/12 bg-paper px-5 text-base font-medium hover:bg-paper-2"
              >
                List from an X post
              </Link>
            </div>
            <p className="text-sm text-muted">
              Reply <span className="font-medium text-ink">host this @buysashdot</span> on the tweet
              you already posted. Or paste the link. Draft in one reply.
            </p>
          </div>
          <div className="rise relative">
            <img
              src="/art/hero-marketing.jpg"
              alt="Sash — logo on event attire"
              className="w-full rounded-[28px] object-cover shadow-soft"
            />
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-sash/20 blur-3xl" style={{ animation: "sash-pulse 4s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["USDC on Solana", "Funds lock before print"],
            ["Same X to publish", "Proof or refund"],
            ["Slots, not garments", "Chest · back · sleeve priced apart"],
            ["Public proof page", "Hash matches attestation"],
          ].map(([a, b]) => (
            <div key={a} className="space-y-1 border-t border-ink/10 pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sash">{a}</p>
              <p className="text-lg font-display">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">How it works</p>
        <h2 className="mt-2 max-w-xl text-3xl">A slot on someone already going.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "The person",
              d: "An attendee, creator, or small team who will be on the Token2049 floor, in side events, and in the recap.",
            },
            {
              n: "02",
              t: "The slot",
              d: "Chest, back, sleeve, tote, suitcase, laptop lid. Priced separately. Public bids. No hidden list.",
            },
            {
              n: "03",
              t: "The proof",
              d: "Wide shot at the venue. Close-up of the mark. One public recap post. If that pack fails, the buyer is refunded.",
            },
          ].map((step) => (
            <article key={step.n} className="rounded-2xl bg-paper-2 p-5 dark:bg-ink-2">
              <p className="font-mono text-xs text-sash">{step.n}</p>
              <h3 className="mt-2 text-xl">{step.t}</h3>
              <p className="mt-2 text-sm text-muted dark:text-muted-dark">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-ink/8 bg-paper-2/80 p-6 sm:p-8">
          <h3 className="text-2xl">For sellers</h3>
          <ol className="mt-4 space-y-3 text-sm text-muted">
            <li>1. Tweet the inventory, or use the one you already posted.</li>
            <li>2. Mention @buysashdot or paste the URL on buysash.fun.</li>
            <li>3. We draft the listing. You connect that same X + a Solana wallet.</li>
            <li>4. Publish. When a slot funds, you print. After the event, upload proof. Get paid.</li>
          </ol>
        </div>
        <div className="rounded-3xl border border-ink/8 bg-ink p-6 text-paper sm:p-8">
          <h3 className="text-2xl">For buyers</h3>
          <ol className="mt-4 space-y-3 text-sm text-muted-dark">
            <li>1. Open a Token2049 listing.</li>
            <li>2. Pick a slot. Upload your logo file.</li>
            <li>3. Bid or buy in USDC. Losing bids return immediately.</li>
            <li>4. The win stays locked until proof passes, time runs out, or a dispute ends.</li>
          </ol>
        </div>
      </section>
    </SashShell>
  );
}
