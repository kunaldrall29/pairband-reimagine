import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SashShell, StatusPill } from "@/components/sash/shell";
import { adminOverview, releaseDeal, refundDeal } from "@/lib/sash/server";
import { SignedIn, SignedOut } from "@/lib/auth/gates";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminOverview>> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function reload() {
    adminOverview()
      .then(setData)
      .catch((e: Error) => setErr(e.message));
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <SashShell>
      <SignedOut>
        <p className="p-8">
          <Link to="/login" className="text-sash">
            Sign in
          </Link>{" "}
          for admin desk.
        </p>
      </SignedOut>
      <SignedIn>
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
          <h1 className="text-3xl">Admin</h1>
          <p className="text-sm text-muted">{data?.note}</p>
          {err ? <p className="text-danger">{err}</p> : null}
          {data ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(data.counts || {}).map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-paper-2 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{k}</p>
                    <p className="text-2xl font-display">{v}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs text-muted">
                Treasury {data.treasury} · USDC {data.usdcMint} · {data.escrowMode}
              </p>
              <h2 className="text-lg">Recent deals</h2>
              <ul className="space-y-2">
                {data.recent.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink/8 px-3 py-3 text-sm"
                  >
                    <Link to="/d/$id" params={{ id: d.id }} className="font-mono text-xs">
                      {d.id}
                    </Link>
                    <StatusPill status={d.status} />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-ink/10 px-2 py-1 text-xs"
                        onClick={async () => {
                          await releaseDeal({ data: { dealId: d.id, force: true } });
                          reload();
                        }}
                      >
                        Force release
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-ink/10 px-2 py-1 text-xs"
                        onClick={async () => {
                          await refundDeal({
                            data: { dealId: d.id, reason: "Admin refund" },
                          });
                          reload();
                        }}
                      >
                        Refund
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <h2 className="text-lg">Ledger</h2>
              <ul className="space-y-1 font-mono text-[11px]">
                {(data.ledger as { id: string; kind: string; amount_usdc: string | number; tx_sig: string | null }[]).map(
                  (e) => (
                    <li key={e.id} className="truncate rounded bg-paper-2 px-2 py-1">
                      {e.kind} {Number(e.amount_usdc)} {e.tx_sig}
                    </li>
                  ),
                )}
              </ul>
            </>
          ) : null}
        </div>
      </SignedIn>
    </SashShell>
  );
}
