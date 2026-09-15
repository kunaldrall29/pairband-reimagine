import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SashShell } from "@/components/sash/shell";
import { importTweetDraft } from "@/lib/sash/server";
import { SASH } from "@/lib/sash/constants";

export const Route = createFileRoute("/import")({
  component: ImportPage,
});

function ImportPage() {
  const nav = useNavigate();
  const [tweetUrl, setTweetUrl] = useState("https://x.com/sgfloorwalker/status/1234567890");
  const [tweetText, setTweetText] = useState(
    "Token2049 Singapore — black hoodie on the floor + two side events. Chest and sleeve open for logos. host this @buysashdot",
  );
  const [eventSlug, setEventSlug] = useState("token2049");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof importTweetDraft>> | null>(
    null,
  );
  const [err, setErr] = useState<string | null>(null);

  async function onImport() {
    setBusy(true);
    setErr(null);
    try {
      const res = await importTweetDraft({
        data: { tweetUrl, tweetText, eventSlug },
      });
      setResult(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SashShell>
      <div className="mx-auto max-w-xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sash">
            Tweet → funded listing
          </p>
          <h1 className="mt-2 text-3xl">Import an X post</h1>
          <p className="mt-2 text-sm text-muted">
            Paste a status URL. AI drafts the listing. Bot reply skips when X write is not
            configured — you still get a draft link.
          </p>
        </div>

        <label className="block space-y-1 text-sm">
          <span>Tweet URL</span>
          <input
            className="w-full min-h-11 rounded-xl border border-ink/10 bg-paper px-3"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Tweet text (paste if API fetch unavailable)</span>
          <textarea
            className="min-h-28 w-full rounded-xl border border-ink/10 bg-paper px-3 py-2"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Event</span>
          <select
            className="w-full min-h-11 rounded-xl border border-ink/10 bg-paper px-3"
            value={eventSlug}
            onChange={(e) => setEventSlug(e.target.value)}
          >
            <option value="token2049">Token2049 Singapore</option>
            <option value="breakpoint">Breakpoint</option>
          </select>
        </label>

        <button
          type="button"
          disabled={busy}
          onClick={onImport}
          className="min-h-12 w-full rounded-2xl bg-sash font-semibold text-white hover:bg-sash-2 disabled:opacity-60"
        >
          {busy ? "Drafting…" : "Draft with AI"}
        </button>

        {err ? <p className="text-sm text-danger">{err}</p> : null}

        {result ? (
          <div className="space-y-3 rounded-2xl border border-ink/8 bg-paper-2 p-5">
            <p className="font-medium">Draft ready</p>
            <p className="text-sm text-muted">{result.botNote}</p>
            <pre className="overflow-auto rounded-xl bg-ink p-3 text-xs text-paper">
              {JSON.stringify(result.ai, null, 2)}
            </pre>
            <p className="text-sm">
              Reply template we would send on {SASH.handle}:
              <br />
              <span className="text-muted">
                Drafted this on Sash. Review + publish: buysash.fun{result.link}
              </span>
            </p>
            <button
              type="button"
              className="min-h-11 w-full rounded-xl bg-ink text-paper"
              onClick={() =>
                nav({ to: "/list", search: { draft: result.token } })
              }
            >
              Review & publish
            </button>
            <Link to="/list" search={{ draft: result.token }} className="block text-center text-sash">
              Open draft link
            </Link>
          </div>
        ) : null}
      </div>
    </SashShell>
  );
}
