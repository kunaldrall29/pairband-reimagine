import { BPS_DENOM, CREATOR_FEE_BPS, PROTOCOL_FEE_BPS, WAD } from "./constants.ts";
import { LaunchError } from "./types.ts";

export function splitFees(usdcIn: bigint): { protocol: bigint; creator: bigint; net: bigint } {
  if (usdcIn <= 0n) throw new LaunchError("ZeroAmount");
  const protocol = (usdcIn * PROTOCOL_FEE_BPS) / BPS_DENOM;
  const creator = (usdcIn * CREATOR_FEE_BPS) / BPS_DENOM;
  return { protocol, creator, net: usdcIn - protocol - creator };
}

export function getTokensOut(virtualUsdc: bigint, virtualTokens: bigint, netUsdcIn: bigint): bigint {
  if (netUsdcIn <= 0n) throw new LaunchError("ZeroAmount");
  if (virtualUsdc === 0n || virtualTokens === 0n) throw new LaunchError("InsufficientLiquidity");
  const newUsdc = virtualUsdc + netUsdcIn;
  const newTokens = (virtualUsdc * virtualTokens) / newUsdc;
  if (newTokens >= virtualTokens) throw new LaunchError("InsufficientLiquidity");
  return virtualTokens - newTokens;
}

export function getUsdcOut(virtualUsdc: bigint, virtualTokens: bigint, tokensIn: bigint): bigint {
  if (tokensIn <= 0n) throw new LaunchError("ZeroAmount");
  if (virtualUsdc === 0n || virtualTokens === 0n) throw new LaunchError("InsufficientLiquidity");
  const newTokens = virtualTokens + tokensIn;
  const newUsdc = (virtualUsdc * virtualTokens) / newTokens;
  if (newUsdc >= virtualUsdc) throw new LaunchError("InsufficientLiquidity");
  return virtualUsdc - newUsdc;
}

export function spotPrice(virtualUsdc: bigint, virtualTokens: bigint): bigint {
  if (virtualTokens === 0n) return 0n;
  return (virtualUsdc * WAD) / virtualTokens;
}

export function fdv(virtualUsdc: bigint, virtualTokens: bigint, supply: bigint): bigint {
  if (virtualTokens === 0n) return 0n;
  return (virtualUsdc * supply) / virtualTokens;
}
