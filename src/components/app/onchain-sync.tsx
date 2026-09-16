"use client";

import { useCallback, useEffect } from "react";
import { pullArcLaunches } from "@/lib/pull-arc-launches";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { isLiveFactory } from "@/lib/wagmi.ts";
import { arcTestnet } from "@/lib/chains";

/**
 * Keep the in-browser launch catalog synced with Arc for every /app route.
 * Uses same-origin /api/arc/launches so the preview iframe never talks to
 * public Arc RPCs (those calls fail with viem "Failed to fetch").
 */
export function OnchainSync() {
  const upsertOnchainLaunches = useLaunchpad((s) => s.upsertOnchainLaunches);

  const syncChain = useCallback(async () => {
    if (!isLiveFactory(arcTestnet.id)) return;
    try {
      const launches = await pullArcLaunches();
      upsertOnchainLaunches(launches);
    } catch {
      /* Discover surfaces a short error via its Sync button. */
    }
  }, [upsertOnchainLaunches]);

  useEffect(() => {
    void syncChain();
    const id = window.setInterval(() => void syncChain(), 45_000);
    return () => window.clearInterval(id);
  }, [syncChain]);

  return null;
}
