import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SashShell } from "@/components/sash/shell";
import { getDraftByToken, publishDraft } from "@/lib/sash/server";
import { connectPhantom } from "@/lib/sash/phantom";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { truncateAddr } from "@/lib/sash/ids";

type Search = { draft?: string };

export const Route = createFileRoute("/list")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    draft: typeof s.draft === "string" ? s.draft : undefined,
  }),
  component: ListPublishPage,
});

function ListPublishPage() {
  const { draft: token } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState("hoodie");
  const [xUserId, setXUserId] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [wallet, setWallet] = useState<string | null>(null);
  const [authorGate, setAuthorGate] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    getDraftByToken({ data: token }).then((d) => {
      if (!d) {
        setMsg("Draft not found");
        return;
      }
      const ai = (d.ai_payload || {}) as {
        title?: string;
        description?: string;
        item_type?: string;
      };
      setTitle(ai.title || "");
      setDescription(ai.description || d.tweet_text || "");
      setItemType(ai.item_type || "hoodie");
      setXHandle(d.tweet_author_handle || "");
      setAuthorGate(d.tweet_author_id);
    });
  }, [token]);

  async function onPublish() {
    if (!token) {
      setMsg("Missing draft token — import a tweet first");
      return;
    }
    if (!user) {
      nav({ to: "/login" });
      return;
    }
    if (!wallet) {
      setMsg("Connect a Solana wallet before publish");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await publishDraft({
        data: {
          token,
          title,
          description,
          itemType,
          xUserId: xUserId || authorGate || undefined,
          xHandle: xHandle || undefined,
          walletPubkey: wallet,
        },
      });
      nav({ to: "/l/$id", params: { id: res.listingId } });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SashShell>
      <div className="mx-auto max-w-xl space-y-5 px-4 py-10 sm:px-6">
        <h1 className="text-3xl">Publish listing</h1>
        <p className="text-sm text-muted">
          Same X author as the source tweet must connect. Gate:{" "}
          <code className="font-mono text-xs">draft.tweet.author_id === connected_x_user_id</code>
        </p>

        {!token ? (
          <p className="rounded-xl bg-paper-2 p-4 text-sm">
            No draft token. <a className="text-sash" href="/import">Import a tweet</a> first.
          </p>
        ) : null}

        <label className="block space-y-1 text-sm">
          Title
          <input
            className="w-full min-h-11 rounded-xl border border-ink/10 px-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          Description
          <textarea
            className="min-h-24 w-full rounded-xl border border-ink/10 px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          Item type
          <input
            className="w-full min-h-11 rounded-xl border border-ink/10 px-3"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          X handle
          <input
            className="w-full min-h-11 rounded-xl border border-ink/10 px-3"
            value={xHandle}
            onChange={(e) => setXHandle(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          Connected X user id (must match tweet author when set)
          <input
            className="w-full min-h-11 rounded-xl border border-ink/10 px-3 font-mono text-sm"
            value={xUserId}
            placeholder={authorGate || "optional if draft has no author id"}
            onChange={(e) => setXUserId(e.target.value)}
          />
        </label>

        <button
          type="button"
          className="min-h-11 w-full rounded-xl border border-ink/10"
          onClick={async () => {
            try {
              setWallet(await connectPhantom());
            } catch (e) {
              setMsg(e instanceof Error ? e.message : "Phantom error");
            }
          }}
        >
          {wallet ? `Wallet ${truncateAddr(wallet)}` : "Connect Phantom (Solana)"}
        </button>

        <button
          type="button"
          disabled={busy || isPending}
          onClick={onPublish}
          className="min-h-12 w-full rounded-2xl bg-sash font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Publishing…" : "Publish to event hub"}
        </button>
        {msg ? <p className="text-sm text-danger">{msg}</p> : null}
      </div>
    </SashShell>
  );
}
