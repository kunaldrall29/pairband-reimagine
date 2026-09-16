import type { Launch } from "@/lib/engine/types.ts";
import { launchFromWire, type LaunchWire } from "@/lib/onchain-launches";
import { syncErrorCopy } from "@/lib/arc-rpc";

export type ArcLaunchesResponse = {
  ok: boolean;
  launches: LaunchWire[];
  error?: string;
};

/**
 * Client-safe Arc catalog fetch — same-origin only. Never imports viem / RPC URLs.
 */
export async function pullArcLaunches(signal?: AbortSignal): Promise<Launch[]> {
  const res = await fetch("/api/arc/launches", {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
    credentials: "same-origin",
  });
  let body: ArcLaunchesResponse | null = null;
  try {
    body = (await res.json()) as ArcLaunchesResponse;
  } catch {
    throw new Error("Arc sync returned a non-JSON response");
  }
  if (!res.ok || body.ok === false) {
    throw new Error(body.error || syncErrorCopy(new Error(`HTTP ${res.status}`)));
  }
  return (body.launches ?? []).map(launchFromWire);
}
