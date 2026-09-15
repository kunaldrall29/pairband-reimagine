import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SashShell, StatusPill } from "@/components/sash/shell";
import { getMyDeals, getMyProfile, upsertMyProfile } from "@/lib/sash/server";
import { connectPhantom } from "@/lib/sash/phantom";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { truncateAddr } from "@/lib/sash/ids";
import type { MyDealRow } from "@/lib/sash/types";

export const Route = createFileRoute("/me")({
  component: MePage,
});

function MePage() {
  return (
    <SashShell>
      <SignedOut>
        <div className="mx-auto max-w-md px-4 py-16">
          <h1 className="text-3xl">Your Sash desk</h1>
          <p className="mt-2 text-muted">Sign in with X to manage listings and proof.</p>
          <Link to="/login" className="mt-6 inline-flex min-h-11 rounded-xl bg-sash px-4 py-3 text-white">
            Sign in
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <MeInner />
      </SignedIn>
    </SashShell>
  );
}

function MeInner() {
  const user = useCurrentUser();
  const [wallet, setWallet] = useState<string | null>(null);
  const [deals, setDeals] = useState<MyDealRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        if (p?.wallet_pubkey) setWallet(p.wallet_pubkey);
      })
      .catch(() => undefined);
    getMyDeals()
      .then(setDeals)
      .catch((e: Error) => setMsg(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-3xl">Me</h1>
        <p className="mt-1 text-muted">{user?.displayName || user?.primaryEmail || user?.id}</p>
      </div>

      <div className="rounded-2xl border border-ink/8 bg-paper-2 p-5 space-y-3">
        <h2 className="text-lg">Solana wallet</h2>
        <button
          type="button"
          className="min-h-11 rounded-xl bg-sash px-4 text-white"
          onClick={async () => {
            try {
              const pk = await connectPhantom();
              setWallet(pk);
              await upsertMyProfile({ data: { walletPubkey: pk } });
              setMsg("Wallet saved");
            } catch (e) {
              setMsg(e instanceof Error ? e.message : "Wallet error");
            }
          }}
        >
          {wallet ? truncateAddr(wallet) : "Connect Phantom"}
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Deals</h2>
          <Link to="/import" className="text-sm text-sash">
            Import tweet
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {deals.length === 0 ? (
            <li className="text-sm text-muted">No deals yet — browse Token2049 slots.</li>
          ) : (
            deals.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink/8 px-3 py-3"
              >
                <div>
                  <Link to="/d/$id" params={{ id: d.id }} className="font-medium hover:text-sash">
                    {d.listing_title} · {d.zone}
                  </Link>
                  <p className="text-xs text-muted">{Number(d.amount_usdc)} USDC</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={d.status} />
                  {["locked", "proof_submitted"].includes(d.status) ? (
                    <Link
                      to="/me/proof/$deal"
                      params={{ deal: d.id }}
                      className="text-sm text-sash"
                    >
                      Proof
                    </Link>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      {msg ? <p className="text-sm text-muted">{msg}</p> : null}
    </div>
  );
}
