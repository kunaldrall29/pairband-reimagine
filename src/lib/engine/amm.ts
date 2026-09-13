import { AMM_FEE_BPS, BPS_DENOM } from "./constants.ts";
import { LaunchError } from "./types.ts";

export function getAmountOut(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
  if (amountIn <= 0n) throw new LaunchError("ZeroAmount");
  if (reserveIn === 0n || reserveOut === 0n) throw new LaunchError("InsufficientLiquidity");
  const amountInWithFee = amountIn * (BPS_DENOM - AMM_FEE_BPS);
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * BPS_DENOM + amountInWithFee;
  const out = numerator / denominator;
  if (out <= 0n || out >= reserveOut) throw new LaunchError("InsufficientLiquidity");
  return out;
}

export function quote(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
  if (amountIn <= 0n || reserveIn === 0n) return 0n;
  return (amountIn * reserveOut) / reserveIn;
}

/** Mid vs execution, in basis points. Includes the 0.3% Uniswap fee. */
export function priceImpactBps(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): number {
  if (amountIn <= 0n || reserveIn === 0n || reserveOut === 0n) return 0;
  const mid = quote(amountIn, reserveIn, reserveOut);
  if (mid === 0n) return 0;
  try {
    const exec = getAmountOut(amountIn, reserveIn, reserveOut);
    if (exec >= mid) return 0;
    return Number(((mid - exec) * 10_000n) / mid);
  } catch {
    return 10_000;
  }
}

export function poolK(reserve0: bigint, reserve1: bigint): bigint {
  return reserve0 * reserve1;
}

/** Uniswap v3-style sqrtPriceX96 = sqrt(token1/token0) * 2^96. token1 = USDC, token0 = token. */
export function sqrtPriceX96(reserveToken: bigint, reserveUsdc: bigint): bigint {
  if (reserveToken <= 0n || reserveUsdc <= 0n) return 0n;
  const Q96 = 2n ** 96n;
  return (sqrt(reserveUsdc) * Q96) / sqrt(reserveToken);
}

export function sqrt(v: bigint): bigint {
  if (v <= 0n) return 0n;
  let z = v;
  let x = v / 2n + 1n;
  while (x < z) {
    z = x;
    x = (v / x + x) / 2n;
  }
  return z;
}
