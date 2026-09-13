/** Live Uniswap reads are wired after deployments.json has a factory. Preview uses the local engine. */
export async function readSlot0(_poolId: string): Promise<{ sqrtPriceX96: bigint; tick: number } | null> {
  return null;
}

export async function readLiquidity(_poolId: string): Promise<bigint | null> {
  return null;
}
