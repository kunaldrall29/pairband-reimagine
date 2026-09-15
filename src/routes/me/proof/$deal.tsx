import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SashShell } from "@/components/sash/shell";
import { runAiProofReport, submitProof } from "@/lib/sash/server";
import { SignedIn, SignedOut } from "@/lib/auth/gates";

export const Route = createFileRoute("/me/proof/$deal")({
  component: ProofUploadPage,
});

function ProofUploadPage() {
  const { deal } = Route.useParams();
  const nav = useNavigate();
  const [wideUrl, setWideUrl] = useState("/art/proof.jpg");
  const [closeupUrl, setCloseupUrl] = useState("/art/sash-crop.jpg");
  const [recapUrl, setRecapUrl] = useState("/art/banner.jpg");
  const [recapPostUrl, setRecapPostUrl] = useState("https://x.com/buysashdot/status/proof");
  const [notes, setNotes] = useState("Wide venue + close-up mark + recap post");
  const [msg, setMsg] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await submitProof({
        data: { dealId: deal, wideUrl, closeupUrl, recapUrl, recapPostUrl, notes },
      });
      setHash(res.contentHash);
      await runAiProofReport({ data: { dealId: deal } });
      setMsg("Proof uploaded + AI attestation drafted. Challenge window opened.");
      nav({ to: "/p/$deal", params: { deal } });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SashShell>
      <SignedOut>
        <p className="p-8">
          <Link to="/login" className="text-sash">
            Sign in
          </Link>{" "}
          to upload proof.
        </p>
      </SignedOut>
      <SignedIn>
        <div className="mx-auto max-w-xl space-y-4 px-4 py-10 sm:px-6">
          <h1 className="text-3xl">Proof pack</h1>
          <p className="text-sm text-muted">
            Wide shot at the venue. Close-up of the mark. One public recap post. Hash must match
            the public proof page.
          </p>
          {(
            [
              ["Wide URL", wideUrl, setWideUrl],
              ["Close-up URL", closeupUrl, setCloseupUrl],
              ["Recap media URL", recapUrl, setRecapUrl],
              ["Recap post URL", recapPostUrl, setRecapPostUrl],
            ] as const
          ).map(([label, val, set]) => (
            <label key={label} className="block space-y-1 text-sm">
              {label}
              <input
                className="w-full min-h-11 rounded-xl border border-ink/10 px-3"
                value={val}
                onChange={(e) => set(e.target.value)}
              />
            </label>
          ))}
          <label className="block space-y-1 text-sm">
            Notes
            <textarea
              className="min-h-20 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={onSubmit}
            className="min-h-12 w-full rounded-2xl bg-sash font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Submitting…" : "Submit proof + attest"}
          </button>
          {hash ? (
            <p className="break-all font-mono text-xs text-muted">hash {hash}</p>
          ) : null}
          {msg ? <p className="text-sm text-sash-2">{msg}</p> : null}
        </div>
      </SignedIn>
    </SashShell>
  );
}
