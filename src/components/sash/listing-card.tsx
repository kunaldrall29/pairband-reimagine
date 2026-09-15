import { Link } from "@tanstack/react-router";
import type { ListingWithSlots } from "@/lib/sash/types";
import { StatusPill } from "./shell";

export function ListingCard({ listing }: { listing: ListingWithSlots }) {
  const open = listing.slots.filter((s) => s.status === "open").length;
  const locked = listing.slots.filter((s) => s.status === "locked").length;
  return (
    <Link
      to="/l/$id"
      params={{ id: listing.id }}
      className="group rise block overflow-hidden rounded-2xl border border-ink/8 bg-paper-2/60 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-paper/10 dark:bg-ink-2"
    >
      <div className="aspect-[4/3] overflow-hidden bg-paper-3 dark:bg-ink">
        <img
          src={listing.cover_image || "/art/hoodie.jpg"}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base leading-snug">{listing.title}</h3>
          {listing.featured ? <StatusPill status="featured" /> : null}
        </div>
        <p className="text-sm text-muted dark:text-muted-dark">
          @{listing.seller_x_handle} · {listing.item_type}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {listing.slots.slice(0, 3).map((s) => (
            <span
              key={s.id}
              className="rounded-md bg-paper px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-ink dark:bg-ink dark:text-paper"
            >
              {s.zone} · {Number(s.price_usdc)} · {s.status}
            </span>
          ))}
        </div>
        <p className="pt-1 text-xs text-muted dark:text-muted-dark">
          {open} open · {locked} locked
        </p>
      </div>
    </Link>
  );
}
