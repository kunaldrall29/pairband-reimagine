import { createPublicClient, fallback, http, type PublicClient, type Transport } from "viem";
import { arcTestnet } from "@/lib/chains";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";

/** Prefer published Arc endpoints; fallback covers transient Cloudflare / CORS blips. */
export const ARC_TESTNET_RPCS = [
  ARC_TESTNET_DEPLOYMENT.rpc,
  "https://rpc.testnet.arc.io",
  "https://rpc.testnet.arc.network",
].filter((u, i, a): u is string => Boolean(u) && a.indexOf(u) === i);

export function arcTestnetTransport(): Transport {
  return fallback(
    ARC_TESTNET_RPCS.map((url) =>
      http(url, {
        timeout: 12_000,
        retryCount: 1,
        retryDelay: 400,
      }),
    ),
  );
}

export function createArcTestnetClient(): PublicClient {
  return createPublicClient({
    chain: arcTestnet,
    transport: arcTestnetTransport(),
  });
}

/** Short, user-facing copy — never dump raw viem HTTP blobs into Discover. */
export function syncErrorCopy(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "Sync failed");
  if (/failed to fetch|fetch failed|network|timeout|aborted|econnrefused|enotfound/i.test(raw)) {
    return "Could not reach Arc RPC. Retry sync — preview markets stay available offline.";
  }
  if (/http request failed/i.test(raw)) {
    return "Arc RPC request failed. Retry sync in a moment.";
  }
  return raw.length > 140 ? `${raw.slice(0, 137)}…` : raw;
}
