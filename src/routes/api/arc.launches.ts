import { createFileRoute } from "@tanstack/react-router";
import { createArcTestnetClient } from "@/lib/arc-rpc";
import { fetchOnchainLaunches, launchToWire } from "@/lib/onchain-launches";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";

/**
 * Same-origin Arc catalog. The Grok preview iframe (and some wallets) cannot
 * reach public RPCs — browser viem then throws the long "Failed to fetch /
 * launchCount" error. Discover / OnchainSync call this instead.
 */
export const Route = createFileRoute("/api/arc/launches")({
  server: {
    handlers: {
      GET: async () => {
        try {
          if (!ARC_TESTNET_DEPLOYMENT.launchpad) {
            return Response.json({ launches: [], ok: true });
          }
          const client = createArcTestnetClient();
          const rows = await fetchOnchainLaunches(client);
          return Response.json(
            { launches: rows.map((r) => launchToWire(r.launch)), ok: true },
            {
              headers: {
                // Short private cache so rapid Discover polls don't stampede Arc.
                "Cache-Control": "private, max-age=15",
              },
            },
          );
        } catch (e) {
          const message = e instanceof Error ? e.message : "Arc sync failed";
          return Response.json(
            {
              ok: false,
              launches: [],
              error: /failed to fetch|http request failed|rpc\.testnet\.arc/i.test(message)
                ? "Could not reach Arc RPC from the app server. Retry in a moment."
                : message.length > 160
                  ? `${message.slice(0, 157)}…`
                  : message,
            },
            { status: 502 },
          );
        }
      },
    },
  },
});
