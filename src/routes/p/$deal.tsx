import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SashShell, StatusPill } from "@/components/sash/shell";
import { getDeal } from "@/lib/sash/server";

export const Route = createFileRoute("/p/$deal")({
  component: PublicProofPage,
});

function PublicProofPage() {
  const { deal: dealId } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getDeal>>>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getDeal({ data: dealId })
      .then(setData)
      .catch((e: Error) => setErr(e.message));
  }, [dealId]);

  const proof = data?.proofs[0];
  const report = data?.reports[0];
  const attestation = data?.deal.attestation as
    | { proof_hash?: string; report?: { pass?: boolean }; signed_at?: string }
    | null
    | undefined;
  const hashMatch =
    proof?.content_hash &&
    (data?.deal.proof_hash === proof.content_hash ||
      attestation?.proof_hash === proof.content_hash);

  return (
    <SashShell>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sash">
            Public proof
          </p>
          <h1 className="mt-2 text-3xl">{data?.listing?.title || "Deal proof"}</h1>
          {data?.deal ? <StatusPill status={data.deal.status} /> : null}
        </div>
        {err ? <p className="text-danger">{err}</p> : null}
        {!data ? <p className="text-muted">Loading…</p> : null}

        {proof ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[proof.wide_url, proof.closeup_url, proof.recap_url].filter(Boolean).map((src) => (
              <img
                key={src!}
                src={src!}
                alt=""
                className="aspect-square rounded-2xl object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No proof uploaded yet.</p>
        )}

        <div className="rounded-2xl border border-ink/8 bg-paper-2 p-5 space-y-2 text-sm">
          <p>
            Content hash:{" "}
            <span className="break-all font-mono text-xs">{proof?.content_hash || "—"}</span>
          </p>
          <p>
            Deal proof_hash:{" "}
            <span className="break-all font-mono text-xs">{data?.deal.proof_hash || "—"}</span>
          </p>
          <p className={hashMatch ? "text-ok" : "text-muted"}>
            {hashMatch ? "Public page agrees with hash ✓" : "Hash pending or mismatched"}
          </p>
          {proof?.recap_post_url ? (
            <a href={proof.recap_post_url} className="text-sash hover:underline" target="_blank" rel="noreferrer">
              Recap post
            </a>
          ) : null}
          {report ? (
            <pre className="overflow-auto rounded-xl bg-ink p-3 text-xs text-paper">
              {JSON.stringify(report.report, null, 2)}
            </pre>
          ) : null}
          {attestation ? (
            <p className="text-xs text-muted">
              Attested {attestation.signed_at} · pass={String(attestation.report?.pass)}
            </p>
          ) : null}
          {data?.deal.challenge_deadline ? (
            <p className="text-xs text-muted">
              Challenge deadline {data.deal.challenge_deadline}
            </p>
          ) : null}
        </div>

        <Link to="/d/$id" params={{ id: dealId }} className="text-sash hover:underline">
          Open deal
        </Link>
      </div>
    </SashShell>
  );
}
