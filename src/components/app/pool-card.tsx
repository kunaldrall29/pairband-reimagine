"use client";

import { AMM_FEE_BPS, DEAD } from "@/lib/engine/constants.ts";
import { poolK, sqrtPriceX96 } from "@/lib/engine/amm.ts";
import type { Launch } from "@/lib/engine/types.ts";
import { formatToken, formatUsdc } from "@/lib/format.ts";
import { shortAddr } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";

export function PoolCard({ launch }: { launch: Launch }) {
  if (launch.status !== "graduated" || !launch.pair) return null;
  const k = poolK(launch.reserveUsdc, launch.reserveToken);
  const sqrtP = sqrtPriceX96(launch.reserveToken, launch.reserveUsdc);
  return (
    <GlassPanel className="p-5">
      <p className="font-mono text-[11px] tracking-[0.16em] text-teal-2 uppercase">Uniswap pair</p>
      <h3 className="mt-1 font-display text-2xl">{launch.symbol} / USDC</h3>
      <p className="mt-1 text-sm text-muted">
        Constant product. {(Number(AMM_FEE_BPS) / 100).toFixed(2)}% swap fee. LP burned to {shortAddr(DEAD, 4)} —
        there is no removeLiquidity on this locker.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="font-mono text-[11px] text-muted uppercase">USDC reserve</dt>
          <dd className="font-mono tabular">{formatUsdc(launch.reserveUsdc)}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] text-muted uppercase">{launch.symbol} reserve</dt>
          <dd className="font-mono tabular">{formatToken(launch.reserveToken, 0)}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] text-muted uppercase">k</dt>
          <dd className="font-mono text-xs tabular">{k.toString().slice(0, 12)}…</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] text-muted uppercase">sqrtPriceX96</dt>
          <dd className="font-mono text-xs tabular">{sqrtP.toString().slice(0, 12)}…</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] text-muted uppercase">Pair</dt>
          <dd className="font-mono text-xs">{shortAddr(launch.pair, 6)}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] text-muted uppercase">LP burned</dt>
          <dd className="font-mono text-xs tabular">{formatToken(launch.lpBurned, 0)}</dd>
        </div>
      </dl>
    </GlassPanel>
  );
}
