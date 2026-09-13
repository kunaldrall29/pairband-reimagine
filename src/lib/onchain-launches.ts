import type { PublicClient } from "viem";
import { launchpadAbi } from "@/lib/abis/launchpad";
import { emptyBook } from "@/lib/engine/book.ts";
import type { Launch } from "@/lib/engine/types.ts";
import { ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";

/** Arc USDC is 6 decimals on-chain; the preview engine stores 18. */
const USDC_SCALE = 10n ** 12n;

const metaAbi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
] as const;

function hueOf(symbol: string): number {
  return [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}

export type OnchainLaunchRow = {
  id: string;
  launch: Launch;
};

export async function fetchOnchainLaunches(client: PublicClient): Promise<OnchainLaunchRow[]> {
  const pad = ARC_TESTNET_DEPLOYMENT.launchpad;
  if (!pad) return [];

  const count = (await client.readContract({
    address: pad as `0x${string}`,
    abi: launchpadAbi,
    functionName: "launchCount",
  })) as bigint;

  const rows: OnchainLaunchRow[] = [];
  for (let i = 0n; i < count; i++) {
    const g = (await client.readContract({
      address: pad as `0x${string}`,
      abi: launchpadAbi,
      functionName: "getLaunch",
      args: [i],
    })) as {
      token: `0x${string}`;
      pair: `0x${string}`;
      book: `0x${string}`;
      creator: `0x${string}`;
      graduated: boolean;
      virtualUsdc: bigint;
      virtualTokens: bigint;
      realUsdc: bigint;
      tokensSold: bigint;
      protocolFees: bigint;
      creatorFees: bigint;
    };

    let name = `Launch ${i}`;
    let symbol = `L${i}`;
    try {
      const [n, s] = await Promise.all([
        client.readContract({ address: g.token, abi: metaAbi, functionName: "name" }) as Promise<string>,
        client.readContract({ address: g.token, abi: metaAbi, functionName: "symbol" }) as Promise<string>,
      ]);
      name = n;
      symbol = s;
    } catch {
      /* keep fallbacks */
    }

    const id = String(i);
    const zero = "0x0000000000000000000000000000000000000000";
    const launch: Launch = {
      id,
      token: g.token,
      curve: pad,
      pair: g.pair.toLowerCase() === zero ? null : g.pair,
      book: g.book.toLowerCase() === zero ? null : g.book,
      name,
      symbol,
      description: "Live on Arc testnet · Pairband launchpad",
      hue: hueOf(symbol),
      creator: g.creator,
      createdAt: Date.now(),
      status: g.graduated ? "graduated" : "curve",
      virtualUsdc: g.virtualUsdc * USDC_SCALE,
      virtualTokens: g.virtualTokens,
      realUsdc: g.realUsdc * USDC_SCALE,
      tokensSold: g.tokensSold,
      reserveUsdc: 0n,
      reserveToken: 0n,
      lpSupply: 0n,
      lpBurned: 0n,
      graduatedAt: g.graduated ? Date.now() : null,
      protocolFees: g.protocolFees * USDC_SCALE,
      creatorFees: g.creatorFees * USDC_SCALE,
      holders: g.tokensSold > 0n ? 1 : 0,
      volumeUsdc: g.realUsdc * USDC_SCALE,
      txCount: g.tokensSold > 0n ? 1 : 0,
      lastTradeAt: Date.now(),
    };
    rows.push({ id, launch });
  }
  return rows;
}

export { emptyBook };
