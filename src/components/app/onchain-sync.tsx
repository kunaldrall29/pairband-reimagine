"use client";

import { useCallback, useEffect } from "react";
import { syncErrorCopy } from "@/lib/arc-rpc";
import { launchFromWire, syncArcLaunches } from "@/lib/onchain-launches.ts";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { isLiveFactory } from "@/lib/wagmi.ts";
import { arcTestnet } from "@/lib/chains";

/**
 * Keep the in-browser launch catalog synced with Arc for every /app route.
 * Discover alone used to own this poll, so deep links like /app/t/0 404'd
 * until the user visited Discover first.
 *
 * Uses a same-origin server function so preview iframes that cannot reach
 * public Arc RPCs still get a live catalog.
 */
export function OnchainSync() {
  const upsertOnchainLaunches = useLaunchpad((s) => s.upsertOnchainLaunches);

  const syncChain = useCallback(async () => {
    if (!isLiveFactory(arcTestnet.id)) return;
    try {
      const { launches } = await syncArcLaunches();
      upsertOnchainLaunches(launches.map(launchFromWire));
    } catch (e) {
      // Discover still surfaces a short error via its own button; keep quiet here.
      void syncErrorCopy(e);
    }
  }, [upsertOnchainLaunches]);

  useEffect(() => {
    void syncChain();
    const id = window.setInterval(() => void syncChain(), 45_000);
    return () => window.clearInterval(id);
  }, [syncChain]);

  return null;
}
