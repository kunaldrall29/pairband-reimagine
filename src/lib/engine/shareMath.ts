/** Share conversions. Floor on mint and withdraw — see ShareMath.sol. */

export function mulDivFloor(a: bigint, b: bigint, d: bigint): bigint {
  if (d === 0n) throw new Error("DivByZero");
  return (a * b) / d;
}

export function mulDivCeil(a: bigint, b: bigint, d: bigint): bigint {
  if (d === 0n) throw new Error("DivByZero");
  const prod = a * b;
  const r = prod / d;
  return prod % d === 0n ? r : r + 1n;
}

export function sharesForLiquidity(
  liquidity: bigint,
  totalSupply: bigint,
  totalLiquidityBefore: bigint,
): bigint {
  if (totalSupply === 0n) return liquidity;
  return mulDivFloor(liquidity, totalSupply, totalLiquidityBefore);
}

export function liquidityForShares(
  shares: bigint,
  totalSupply: bigint,
  totalLiquidity: bigint,
): bigint {
  if (totalSupply === 0n) throw new Error("DivByZero");
  return mulDivFloor(shares, totalLiquidity, totalSupply);
}
