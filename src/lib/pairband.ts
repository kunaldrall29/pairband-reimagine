import type { VaultSnapshot } from "./engine/types";
import { formatUnits } from "./utils";

export function pairLabel(s: Pick<VaultSnapshot, "token0" | "token1">): string {
  return `${s.token0.symbol} / ${s.token1.symbol}`;
}

export function tvlUsd(s: VaultSnapshot): bigint {
  return (
    BigInt(s.idle0.toString()) +
    BigInt(s.idle1.toString()) +
    0n
  );
}

export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(bps % 100 === 0 ? 0 : 2)}%`;
}

export function formatFee(fee: number): string {
  return `${(fee / 10_000).toFixed(2)}%`;
}

export function sharesPct(shares: bigint, total: bigint): string {
  if (total === 0n) return "0.00%";
  const bps = (shares * 10_000n) / total;
  return `${(Number(bps) / 100).toFixed(2)}%`;
}

export function decodeError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const e = err as { code: string; message?: string };
    return `${e.code}${e.message ? `: ${e.message}` : ""}`;
  }
  if (err instanceof Error) return err.message;
  return "Transaction reverted";
}

export { formatUnits };
