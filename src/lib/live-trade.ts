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
import { LAUNCH_FEE_ONCHAIN_USDC } from "@/lib/engine/constants.ts";
import { deploymentFor, isLiveFactory } from "@/lib/wagmi";
import { arcTestnet } from "@/lib/chains";
import { toast } from "sonner";

/** On-chain Arc USDC uses 6 decimals; preview engine uses 18. */
export function toOnChainUsdc(amount18: bigint): bigint {
  return amount18 / 10n ** 12n;
}

async function ensureUsdcAllowance(args: {
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>;
  writeContractAsync: ReturnType<typeof useWriteContract>["writeContractAsync"];
  owner: `0x${string}`;
  usdc: `0x${string}`;
  spender: `0x${string}`;
  needed: bigint;
}) {
  const allowance = (await args.publicClient.readContract({
    address: args.usdc,
    abi: erc20Abi,
    functionName: "allowance",
    args: [args.owner, args.spender],
  })) as bigint;

  if (allowance >= args.needed) return;

  const approveHash = await args.writeContractAsync({
    address: args.usdc,
    abi: erc20Abi,
    functionName: "approve",
    args: [args.spender, maxUint256],
    chainId: arcTestnet.id,
  });
  await args.publicClient.waitForTransactionReceipt({ hash: approveHash });
  toast.message("USDC approved");
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

        await ensureUsdcAllowance({
          publicClient,
          writeContractAsync,
          owner: address,
          usdc: deployment.usdc as `0x${string}`,
          spender: deployment.launchpad as `0x${string}`,
          needed: usdcIn,
        });

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
      if (!address || !deployment?.launchpad || !deployment.usdc || !publicClient) {
        throw new Error("Wallet or factory not ready");
      }
      setBusy(true);
      try {
        await ensureArc();

        const fee = LAUNCH_FEE_ONCHAIN_USDC;
        const balance = (await publicClient.readContract({
          address: deployment.usdc as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        })) as bigint;
        if (balance < fee) {
          throw new Error(`Need ${Number(fee) / 1e6} USDC on Arc for the launch fee`);
        }

        await ensureUsdcAllowance({
          publicClient,
          writeContractAsync,
          owner: address,
          usdc: deployment.usdc as `0x${string}`,
          spender: deployment.launchpad as `0x${string}`,
          needed: fee,
        });

        const hash = await writeContractAsync({
          address: deployment.launchpad as `0x${string}`,
          abi: launchpadAbi,
          functionName: "create",
          args: [name, symbol],
          chainId: arcTestnet.id,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        let launchId: number | null = null;
        for (const log of receipt.logs) {
          try {
            const topics = log.topics;
            // Created(uint256 indexed id, address indexed token, address indexed creator, ...)
            if (
              log.address.toLowerCase() === deployment.launchpad.toLowerCase() &&
              topics[0] ===
                "0xf9fbf11d9944d5b7bd8a5950a0d11a22b99b2c04c22fa4e500d4b34c75cc9a42" &&
              topics[1]
            ) {
              launchId = Number(BigInt(topics[1]));
              break;
            }
          } catch {
            /* skip undecodable logs */
          }
        }
        toast.success(
          launchId != null
            ? `Created #${launchId} · $1 USDC fee · ${hash.slice(0, 10)}…`
            : `Created · $1 USDC fee paid · ${hash.slice(0, 10)}…`,
        );
        return { hash, receipt, launchId };
      } finally {
        setBusy(false);
      }
    },
    [address, deployment, publicClient, writeContractAsync, ensureArc],
  );

  const approveAndSell = useCallback(
    async (launchId: number, tokensIn: bigint, minUsdcOut: bigint) => {
      if (!address || !deployment?.launchpad || !publicClient) {
        throw new Error("Wallet or factory not ready");
      }
      setBusy(true);
      try {
        await ensureArc();
        const launch = (await publicClient.readContract({
          address: deployment.launchpad as `0x${string}`,
          abi: launchpadAbi,
          functionName: "getLaunch",
          args: [BigInt(launchId)],
        })) as { token: `0x${string}` };

        const allowance = (await publicClient.readContract({
          address: launch.token,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address, deployment.launchpad as `0x${string}`],
        })) as bigint;
        if (allowance < tokensIn) {
          const approveHash = await writeContractAsync({
            address: launch.token,
            abi: erc20Abi,
            functionName: "approve",
            args: [deployment.launchpad as `0x${string}`, maxUint256],
            chainId: arcTestnet.id,
          });
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
        }

        const hash = await writeContractAsync({
          address: deployment.launchpad as `0x${string}`,
          abi: launchpadAbi,
          functionName: "sell",
          args: [BigInt(launchId), tokensIn, minUsdcOut],
          chainId: arcTestnet.id,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        toast.success(`Sell confirmed · ${hash.slice(0, 10)}…`);
        return { hash, receipt };
      } finally {
        setBusy(false);
      }
    },
    [address, deployment, publicClient, writeContractAsync, ensureArc],
  );

  return { live, busy, approveAndBuy, approveAndSell, createToken, deployment, address };
}
