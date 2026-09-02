"use client";

import { useCallback, useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
  useSwitchChain,
} from "wagmi";
import { maxUint256 } from "viem";
import { erc20Abi, launchpadAbi } from "@/lib/abis/launchpad";
import { deploymentFor, isLiveFactory } from "@/lib/wagmi";
import { arcTestnet } from "@/lib/chains";
import { toast } from "sonner";

/** On-chain USDC uses 6 decimals on Arc; preview engine uses 18. */
export function toOnChainUsdc(amount18: bigint): bigint {
  return amount18 / 10n ** 12n;
}

export function useLiveTrade() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const [busy, setBusy] = useState(false);

  const live = isConnected && isLiveFactory(chainId);
  const deployment = deploymentFor(chainId);

  const ensureArc = useCallback(async () => {
    if (chainId !== arcTestnet.id && chainId !== 5042) {
      await switchChainAsync?.({ chainId: arcTestnet.id });
    }
  }, [chainId, switchChainAsync]);

  const approveAndBuy = useCallback(
    async (launchId: number, usdcIn18: bigint, minTokensOut: bigint) => {
      if (!address || !deployment?.launchpad || !deployment.usdc || !publicClient) {
        throw new Error("Wallet or factory not ready");
      }
      setBusy(true);
      try {
        await ensureArc();
        const usdcIn = toOnChainUsdc(usdcIn18);
        if (usdcIn <= 0n) throw new Error("Amount too small for on-chain USDC (6 decimals)");

        const allowance = (await publicClient.readContract({
          address: deployment.usdc as `0x${string}`,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address, deployment.launchpad as `0x${string}`],
        })) as bigint;

        if (allowance < usdcIn) {
          const approveHash = await writeContractAsync({
            address: deployment.usdc as `0x${string}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [deployment.launchpad as `0x${string}`, maxUint256],
            chainId: arcTestnet.id,
          });
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
          toast.message("USDC approved");
        }

        const hash = await writeContractAsync({
          address: deployment.launchpad as `0x${string}`,
          abi: launchpadAbi,
          functionName: "buy",
          args: [BigInt(launchId), usdcIn, minTokensOut],
          chainId: arcTestnet.id,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        toast.success(`Buy confirmed · ${hash.slice(0, 10)}…`);
        return { hash, receipt };
      } finally {
        setBusy(false);
      }
    },
    [address, deployment, publicClient, writeContractAsync, ensureArc],
  );

  const createToken = useCallback(
    async (name: string, symbol: string) => {
      if (!address || !deployment?.launchpad || !publicClient) {
        throw new Error("Wallet or factory not ready");
      }
      setBusy(true);
      try {
        await ensureArc();
        const hash = await writeContractAsync({
          address: deployment.launchpad as `0x${string}`,
          abi: launchpadAbi,
          functionName: "create",
          args: [name, symbol],
          chainId: arcTestnet.id,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        toast.success(`Created · ${hash.slice(0, 10)}…`);
        return { hash, receipt };
      } finally {
        setBusy(false);
      }
    },
    [address, deployment, publicClient, writeContractAsync, ensureArc],
  );

  return { live, busy, approveAndBuy, createToken, deployment, address };
}
