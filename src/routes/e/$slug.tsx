import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SashShell, StatusPill } from "@/components/sash/shell";
import { ListingCard } from "@/components/sash/listing-card";
import { getEventBySlug, listLiveListings } from "@/lib/sash/server";
import type { EventRow, ListingWithSlots } from "@/lib/sash/types";

export const Route = createFileRoute("/e/$slug")({
  component: EventHub,
});

function EventHub() {
  const { slug } = Route.useParams();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [listings, setListings] = useState<ListingWithSlots[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getEventBySlug({ data: slug }), listLiveListings({ data: { eventSlug: slug } })])
      .then(([ev, list]) => {
        if (!alive) return;
        setEvent(ev);
        setListings(list);
      })
      .catch((e: Error) => alive && setErr(e.message));
    return () => {
      alive = false;
    };
  }, [slug]);

  const dark = event?.theme === "dark" || slug === "breakpoint";

  return (
    <SashShell dark={dark}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {err ? <p className="text-danger">{err}</p> : null}
        <div className="rise grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sash">
              {event?.city || "Event"} · {event?.starts_on || "TBA"}
              {event?.ends_on ? ` – ${event.ends_on}` : ""}
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl">{event?.name || slug}</h1>
            <p className="mt-3 max-w-lg text-muted dark:text-muted-dark">
              {event?.blurb || "Marketplace hub for logo slots on event clothes."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/import"
                className="inline-flex min-h-11 items-center rounded-xl bg-sash px-4 font-medium text-white hover:bg-sash-2"
              >
                List from X
              </Link>
              <StatusPill status={`${listings.length} live`} />
            </div>
          </div>
          <img
            src={event?.hero_image || (dark ? "/art/hallway.jpg" : "/art/hero.jpg")}
            alt=""
            className="max-h-72 w-full rounded-3xl object-cover shadow-soft"
          />
        </div>

        {slug === "breakpoint" && listings.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-paper/15 bg-ink-2 p-6 text-muted-dark">
            Breakpoint hub is ready (dark theme). Listings open closer to the event — Token2049 is
            live now.
          </p>
        ) : null}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </div>
    </SashShell>
  );
}
