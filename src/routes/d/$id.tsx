import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { SashShell, StatusPill } from "@/components/sash/shell";
import {
  challengeDeal,
  getDeal,
  lockDeal,
  refundDeal,
  releaseDeal,
  runAiProofReport,
} from "@/lib/sash/server";
import { connectPhantom, getPhantomProvider } from "@/lib/sash/phantom";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { truncateAddr } from "@/lib/sash/ids";

export const Route = createFileRoute("/d/$id")({
  component: DealPage,
});

function DealPage() {
  const { id } = Route.useParams();
  const { user } = useCurrentUserState();
  const [data, setData] = useState<Awaited<ReturnType<typeof getDeal>>>(null);
  const [lockTx, setLockTx] = useState("");
  const [wallet, setWallet] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => {
    getDeal({ data: id })
      .then(setData)
      .catch((e: Error) => setMsg(e.message));
  }, [id]);

  useEffect(() => {
    reload();
    const p = getPhantomProvider();
    if (p?.publicKey) setWallet(p.publicKey.toString());
  }, [reload]);

  async function onConnect() {
    try {
      const pk = await connectPhantom();
      setWallet(pk);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Wallet error");
    }
  }

  async function onLock() {
    if (!user) {
      setMsg("Sign in first");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await lockDeal({
        data: {
          dealId: id,
          lockTx: lockTx || `SIM_LOCK_${id}_${Date.now()}`,
          fromPubkey: wallet ?? undefined,
        },
      });
      setMsg(
        lockTx
          ? "Locked with provided tx signature."
          : "Locked with simulated treasury ledger entry (set real USDC tx when treasury is live).",
      );
      reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lock failed");
    } finally {
      setBusy(false);
    }
  }

  if (!data?.deal) {
    return (
      <SashShell>
        <p className="p-8 text-muted">{msg || "Loading deal…"}</p>
      </SashShell>
    );
  }

  const { deal, listing, slot, ledger, treasury, usdcMint } = data;

  return (
    <SashShell>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sash">Deal</p>
          <h1 className="mt-1 text-3xl">{listing?.title || deal.id}</h1>
          <p className="mt-2 text-muted">
            {slot?.zone} · {Number(deal.amount_usdc)} USDC
          </p>
          <div className="mt-3">
            <StatusPill status={deal.status} />
          </div>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-paper-2 p-5 space-y-2 text-sm">
          <p>
            Escrow: <span className="font-mono">{deal.escrow_mode}</span>
          </p>
          <p>
            Treasury: <span className="font-mono">{truncateAddr(treasury, 6)}</span>
          </p>
          <p>
            USDC mint: <span className="font-mono">{truncateAddr(usdcMint, 6)}</span>
          </p>
          {deal.lock_tx ? (
            <p>
              Lock tx: <span className="font-mono break-all">{deal.lock_tx}</span>
            </p>
          ) : null}
          {deal.logo_url ? (
            <img src={deal.logo_url} alt="Logo" className="mt-2 h-16 w-16 rounded-lg object-cover" />
          ) : null}
        </div>

        {deal.status === "pending_payment" ? (
          <div className="space-y-3 rounded-2xl border border-sash/30 bg-sash/5 p-5">
            <h2 className="text-xl">Lock USDC before print</h2>
            <p className="text-sm text-muted">
              Transfer USDC to the treasury, then paste the signature. Without a configured
              treasury key, you can simulate the ledger lock for demo.
            </p>
            <button
              type="button"
              onClick={onConnect}
              className="min-h-11 rounded-xl border border-ink/10 bg-paper px-4"
            >
              {wallet ? `Phantom ${truncateAddr(wallet)}` : "Connect Phantom"}
            </button>
            <input
              className="w-full min-h-11 rounded-xl border border-ink/10 bg-paper px-3 font-mono text-sm"
              placeholder="Solana tx signature"
              value={lockTx}
              onChange={(e) => setLockTx(e.target.value)}
            />
            <button
              type="button"
              disabled={busy}
              onClick={onLock}
              className="min-h-11 w-full rounded-xl bg-sash font-medium text-white hover:bg-sash-2 disabled:opacity-60"
            >
              Confirm lock
            </button>
          </div>
        ) : null}

        {["locked", "proof_submitted", "attested", "challenged"].includes(deal.status) ? (
          <div className="flex flex-wrap gap-3">
            <Link
              to="/me/proof/$deal"
              params={{ deal: deal.id }}
              className="min-h-11 rounded-xl bg-ink px-4 py-3 text-paper"
            >
              Upload proof
            </Link>
            <Link
              to="/p/$deal"
              params={{ deal: deal.id }}
              className="min-h-11 rounded-xl border border-ink/10 px-4 py-3"
            >
              Public proof page
            </Link>
            {deal.status === "proof_submitted" || deal.status === "locked" ? (
              <button
                type="button"
                className="min-h-11 rounded-xl border border-ink/10 px-4"
                onClick={async () => {
                  try {
                    await runAiProofReport({ data: { dealId: deal.id } });
                    reload();
                  } catch (e) {
                    setMsg(e instanceof Error ? e.message : "Report failed");
                  }
                }}
              >
                Run AI attestation
              </button>
            ) : null}
            {deal.status === "attested" ? (
              <>
                <button
                  type="button"
                  className="min-h-11 rounded-xl border border-danger/40 px-4 text-danger"
                  onClick={async () => {
                    try {
                      await challengeDeal({
                        data: { dealId: deal.id, reason: "Proof does not match slot" },
                      });
                      reload();
                    } catch (e) {
                      setMsg(e instanceof Error ? e.message : "Challenge failed");
                    }
                  }}
                >
                  Challenge
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-xl bg-ok px-4 text-white"
                  onClick={async () => {
                    try {
                      await releaseDeal({ data: { dealId: deal.id, force: true } });
                      reload();
                    } catch (e) {
                      setMsg(e instanceof Error ? e.message : "Release failed");
                    }
                  }}
                >
                  Release (skip wait)
                </button>
              </>
            ) : null}
            <button
              type="button"
              className="min-h-11 rounded-xl border border-ink/10 px-4"
              onClick={async () => {
                try {
                  await refundDeal({ data: { dealId: deal.id, reason: "Buyer/seller refund" } });
                  reload();
                } catch (e) {
                  setMsg(e instanceof Error ? e.message : "Refund failed");
                }
              }}
            >
              Refund path
            </button>
          </div>
        ) : null}

        <div>
          <h2 className="text-lg">Ledger</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {ledger.map((e) => (
              <li key={e.id} className="rounded-xl bg-paper-2 px-3 py-2 font-mono text-xs">
                {e.kind} · {Number(e.amount_usdc)} · {e.tx_sig || "—"}
              </li>
            ))}
          </ul>
        </div>
        {msg ? <p className="text-sm text-sash-2">{msg}</p> : null}
      </div>
    </SashShell>
  );
}
