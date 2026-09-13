import { Q96, getSqrtRatioAtTick } from "./tickMath.ts";

function mulDiv(a: bigint, b: bigint, d: bigint): bigint {
  return (a * b) / d;
}

export function getLiquidityForAmount0(sqrtA: bigint, sqrtB: bigint, amount0: bigint): bigint {
  if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
  if (sqrtB === sqrtA) return 0n;
  const intermediate = mulDiv(sqrtA, sqrtB, Q96);
  return mulDiv(amount0, intermediate, sqrtB - sqrtA);
}

export function getLiquidityForAmount1(sqrtA: bigint, sqrtB: bigint, amount1: bigint): bigint {
  if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
  if (sqrtB === sqrtA) return 0n;
  return mulDiv(amount1, Q96, sqrtB - sqrtA);
}

export function getLiquidityForAmounts(
  sqrtP: bigint,
  sqrtA: bigint,
  sqrtB: bigint,
  amount0: bigint,
  amount1: bigint,
): bigint {
  if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
  if (sqrtP <= sqrtA) return getLiquidityForAmount0(sqrtA, sqrtB, amount0);
  if (sqrtP < sqrtB) {
    const l0 = getLiquidityForAmount0(sqrtP, sqrtB, amount0);
    const l1 = getLiquidityForAmount1(sqrtA, sqrtP, amount1);
    return l0 < l1 ? l0 : l1;
  }
  return getLiquidityForAmount1(sqrtA, sqrtB, amount1);
}

export function getAmount0ForLiquidity(sqrtA: bigint, sqrtB: bigint, liquidity: bigint): bigint {
  if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
  if (sqrtA === 0n) return 0n;
  return mulDiv(liquidity * Q96, sqrtB - sqrtA, sqrtB) / sqrtA;
}

export function getAmount1ForLiquidity(sqrtA: bigint, sqrtB: bigint, liquidity: bigint): bigint {
  if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
  return mulDiv(liquidity, sqrtB - sqrtA, Q96);
}

export function getAmountsForLiquidity(
  sqrtP: bigint,
  sqrtA: bigint,
  sqrtB: bigint,
  liquidity: bigint,
): { amount0: bigint; amount1: bigint } {
  if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA];
  if (sqrtP <= sqrtA) {
    return { amount0: getAmount0ForLiquidity(sqrtA, sqrtB, liquidity), amount1: 0n };
  }
  if (sqrtP < sqrtB) {
    return {
      amount0: getAmount0ForLiquidity(sqrtP, sqrtB, liquidity),
      amount1: getAmount1ForLiquidity(sqrtA, sqrtP, liquidity),
    };
  }
  return { amount0: 0n, amount1: getAmount1ForLiquidity(sqrtA, sqrtB, liquidity) };
}

export function liquidityAtBand(
  tick: number,
  tickLower: number,
  tickUpper: number,
  amount0: bigint,
  amount1: bigint,
): bigint {
  return getLiquidityForAmounts(
    getSqrtRatioAtTick(tick),
    getSqrtRatioAtTick(tickLower),
    getSqrtRatioAtTick(tickUpper),
    amount0,
    amount1,
  );
}

export function amountsAtBand(
  tick: number,
  tickLower: number,
  tickUpper: number,
  liquidity: bigint,
): { amount0: bigint; amount1: bigint } {
  return getAmountsForLiquidity(
    getSqrtRatioAtTick(tick),
    getSqrtRatioAtTick(tickLower),
    getSqrtRatioAtTick(tickUpper),
    liquidity,
  );
}

/** Next sqrt from an exact input, Uniswap v3 SqrtPriceMath (in-range). */
export function nextSqrtFromInput(
  sqrtP: bigint,
  liquidity: bigint,
  amountIn: bigint,
  zeroForOne: boolean,
): bigint {
  if (liquidity === 0n || amountIn === 0n) return sqrtP;
  if (zeroForOne) {
    const product = amountIn * sqrtP;
    const denom = (liquidity * Q96) / 1n + product; // (L<<96) + amountIn * sqrtP
    const num = liquidity * Q96 * sqrtP;
    const next = num / ((liquidity << 96n) + product);
    return next < 1n ? 1n : next;
  }
  return sqrtP + (amountIn << 96n) / liquidity;
}
