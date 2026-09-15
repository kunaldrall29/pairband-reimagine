import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SashShell, StatusPill } from "@/components/sash/shell";
import { createDeal, getListing } from "@/lib/sash/server";
import type { ListingWithSlots } from "@/lib/sash/types";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/l/$id")({
  component: ListingPage,
});

function ListingPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [listing, setListing] = useState<(ListingWithSlots & { event_name?: string }) | null>(
    null,
  );
  const [logoUrl, setLogoUrl] = useState("/art/sticker.jpg");
  const [bidAmount, setBidAmount] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getListing({ data: id })
      .then(setListing)
      .catch((e: Error) => setMsg(e.message));
  }, [id]);

  async function buy(slotId: string, auction: boolean) {
    if (isPending) return;
    if (!user) {
      nav({ to: "/login" });
      return;
    }
    setBusy(slotId);
    setMsg(null);
    try {
      const res = await createDeal({
        data: {
          listingId: id,
          slotId,
          logoUrl,
          bidAmount: auction && bidAmount ? Number(bidAmount) : undefined,
        },
      });
      nav({ to: "/d/$id", params: { id: res.dealId } });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  if (!listing) {
    return (
      <SashShell>
        <p className="p-8 text-muted">{msg || "Loading listing…"}</p>
      </SashShell>
    );
  }

  return (
    <SashShell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2">
        <div>
          <img
            src={listing.cover_image || "/art/hoodie.jpg"}
            alt=""
            className="w-full rounded-3xl object-cover shadow-soft"
          />
        </div>
        <div className="space-y-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sash">
              {listing.event_name || "Event"} · @{listing.seller_x_handle}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl">{listing.title}</h1>
            <p className="mt-3 text-muted">{listing.description}</p>
            {listing.featured ? <div className="mt-3"><StatusPill status="featured" /></div> : null}
            {listing.referral_code ? (
              <p className="mt-2 font-mono text-xs text-muted">Ref {listing.referral_code}</p>
            ) : null}
          </div>

          <label className="block space-y-1 text-sm">
            <span className="text-muted">Logo URL (buyer mark)</span>
            <input
              className="w-full min-h-11 rounded-xl border border-ink/10 bg-paper px-3"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </label>

          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Pick a zone · print after lock
            </p>
            {listing.slots.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-2xl border border-ink/8 bg-paper-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{s.zone}</p>
                  <p className="font-mono text-sm text-muted">
                    {Number(s.price_usdc)} USDC · {s.pricing_mode}
                  </p>
                  <div className="mt-1">
                    <StatusPill status={s.status} />
                  </div>
                </div>
                {s.status === "open" ? (
                  <div className="flex flex-col gap-2 sm:items-end">
                    {s.pricing_mode === "auction" ? (
                      <input
                        type="number"
                        placeholder="Bid USDC"
                        className="min-h-11 w-full rounded-xl border border-ink/10 bg-paper px-3 sm:w-36"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                    ) : null}
                    <button
                      type="button"
                      disabled={busy === s.id}
                      onClick={() => buy(s.id, s.pricing_mode === "auction")}
                      className="min-h-11 rounded-xl bg-sash px-4 font-medium text-white hover:bg-sash-2 disabled:opacity-60"
                    >
                      {busy === s.id ? "…" : s.pricing_mode === "auction" ? "Fund bid" : "Buy & lock"}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/d/$id"
                    params={{ id: "deal_demo_locked" }}
                    className="text-sm text-sash hover:underline"
                  >
                    View locked deal
                  </Link>
                )}
              </div>
            ))}
          </div>
          {msg ? <p className="text-sm text-danger">{msg}</p> : null}
        </div>
      </div>
    </SashShell>
  );
}
