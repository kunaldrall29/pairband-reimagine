"use client";

import { useCallback, useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
  useSwitchChain,
} from "wagmi";
import { decodeEventLog, maxUint256 } from "viem";
import { erc20Abi, launchpadAbi } from "@/lib/abis/launchpad";
import { LAUNCH_FEE_ONCHAIN_USDC } from "@/lib/engine/constants.ts";
import { deploymentFor, isLiveFactory } from "@/lib/wagmi";
import { arcTestnet } from "@/lib/chains";
import { toast } from "sonner";

/** Arc USDC on-chain is 6 decimals; the local preview engine stores 18. */
export function toOnChainUsdc(amount18: bigint): bigint {
  return amount18 / 10n ** 12n;
}

/** Scale 6-decimal USDC up to the engine's 18-decimal representation. */
export function fromOnChainUsdc(amount6: bigint): bigint {
  return amount6 * 10n ** 12n;
}

async function ensureUsdcAllowance(args: {
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>;
  writeContractAsync: ReturnType<typeof useWriteContract>["writeContractAsync"];
  owner: `0x${string}`;
  usdc: `0x${string}`;
  spender: `0x${string}`;
  needed: bigint;
  chainId: number;
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
    chainId: args.chainId,
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
  const writeChainId = deployment ? chainId : arcTestnet.id;

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
          chainId: writeChainId,
        });

        const hash = await writeContractAsync({
          address: deployment.launchpad as `0x${string}`,
          abi: launchpadAbi,
          functionName: "buy",
          args: [BigInt(launchId), usdcIn, minTokensOut],
          chainId: writeChainId,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        toast.success(`Buy confirmed · ${hash.slice(0, 10)}…`);
        return { hash, receipt };
      } finally {
        setBusy(false);
      }
    },
    [address, deployment, publicClient, writeContractAsync, ensureArc, writeChainId],
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
          chainId: writeChainId,
        });

        const hash = await writeContractAsync({
          address: deployment.launchpad as `0x${string}`,
          abi: launchpadAbi,
          functionName: "create",
          args: [name, symbol],
          chainId: writeChainId,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        let launchId: number | null = null;
        for (const log of receipt.logs) {
          if (log.address.toLowerCase() !== deployment.launchpad.toLowerCase()) continue;
          try {
            const decoded = decodeEventLog({
              abi: launchpadAbi,
              data: log.data,
              topics: log.topics,
            });
            if (decoded.eventName === "Created") {
              const args = decoded.args as { id?: bigint };
              if (args.id != null) {
                launchId = Number(args.id);
                break;
              }
            }
          } catch {
            /* not a Created log */
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
    [address, deployment, publicClient, writeContractAsync, ensureArc, writeChainId],
  );

  const approveAndSell = useCallback(
    async (launchId: number, tokensIn: bigint, minUsdcOut18: bigint) => {
      if (!address || !deployment?.launchpad || !publicClient) {
        throw new Error("Wallet or factory not ready");
      }
      setBusy(true);
      try {
        await ensureArc();
        // Preview quotes are 18-dec; the contract's minUsdcOut is 6-dec Arc USDC.
        const minUsdcOut = toOnChainUsdc(minUsdcOut18);

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
            chainId: writeChainId,
          });
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
        }

        const hash = await writeContractAsync({
          address: deployment.launchpad as `0x${string}`,
          abi: launchpadAbi,
          functionName: "sell",
          args: [BigInt(launchId), tokensIn, minUsdcOut],
          chainId: writeChainId,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        toast.success(`Sell confirmed · ${hash.slice(0, 10)}…`);
        return { hash, receipt };
      } finally {
        setBusy(false);
      }
    },
    [address, deployment, publicClient, writeContractAsync, ensureArc, writeChainId],
  );

  return { live, busy, approveAndBuy, approveAndSell, createToken, deployment, address };
}
