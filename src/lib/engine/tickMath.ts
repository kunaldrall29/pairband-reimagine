/** Compact tick <-> sqrtPriceX96 around the stable 1:1 region. */

export const Q96 = 2n ** 96n;

export function getSqrtRatioAtTick(tick: number): bigint {
  const ratio = Math.exp((tick / 2) * Math.log(1.0001));
  const scaled = BigInt(Math.round(ratio * 1e12));
  return (scaled * Q96) / 10n ** 12n;
}

export function getTickAtSqrtRatio(sqrtPriceX96: bigint): number {
  const ratio = Number(sqrtPriceX96) / Number(Q96);
  if (!Number.isFinite(ratio) || ratio <= 0) return 0;
  return Math.floor(Math.log(ratio * ratio) / Math.log(1.0001));
}
