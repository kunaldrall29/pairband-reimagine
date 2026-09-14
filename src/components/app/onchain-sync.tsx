"use client";

import { useCallback, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { arcTestnet } from "@/lib/chains";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { fetchOnchainLaunches } from "@/lib/onchain-launches.ts";
import { ARC_TESTNET_DEPLOYMENT, isLiveFactory } from "@/lib/wagmi.ts";

/**
 * Keep the in-browser launch catalog synced with Arc for every /app route.
 * Discover alone used to own this poll, so deep links like /app/t/0 404'd
 * until the user visited Discover first.
 */
export function OnchainSync() {
  const upsertOnchainLaunches = useLaunchpad((s) => s.upsertOnchainLaunches);

  const syncChain = useCallback(async () => {
    if (!isLiveFactory(arcTestnet.id)) return;
    try {
      const client = createPublicClient({
        chain: arcTestnet,
        transport: http(ARC_TESTNET_DEPLOYMENT.rpc ?? "https://rpc.testnet.arc.io"),
      });
      const rows = await fetchOnchainLaunches(client);
      upsertOnchainLaunches(rows.map((r) => r.launch));
    } catch {
      /* Discover still surfaces sync errors via its own button. */
    }
  }, [upsertOnchainLaunches]);

  useEffect(() => {
    void syncChain();
    const id = window.setInterval(() => void syncChain(), 45_000);
    return () => window.clearInterval(id);
  }, [syncChain]);

  return null;
}
