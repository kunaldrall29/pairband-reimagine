"use client";

import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, usePublicClient } from "wagmi";
import { ClayButton } from "@/components/ui/clay-button";
import { isLiveFactory, ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";
import { shortAddr } from "@/lib/utils";
import { arcTestnet } from "@/lib/chains";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { DEMO_USER } from "@/lib/engine/constants.ts";
import { erc20Abi } from "@/lib/abis/launchpad";
import { fromOnChainUsdc } from "@/lib/live-trade";

export function ConnectWallet() {
  const { address, isConnected, status } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient();
  const live = isLiveFactory(chainId);
  const setAccount = useLaunchpad((s) => s.setAccount);
  const setUsdcBalance = useLaunchpad((s) => s.setUsdcBalance);

  useEffect(() => {
    if (isConnected && address) {
      setAccount(address);
    } else {
      setAccount(DEMO_USER);
    }
  }, [isConnected, address, setAccount]);

  useEffect(() => {
    if (!isConnected || !address || !publicClient || !ARC_TESTNET_DEPLOYMENT.usdc) return;
    let cancelled = false;
    void (async () => {
      try {
        const raw = (await publicClient.readContract({
          address: ARC_TESTNET_DEPLOYMENT.usdc as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        })) as bigint;
        if (!cancelled) setUsdcBalance(address, fromOnChainUsdc(raw));
      } catch {
        /* RPC optional during connect */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isConnected, address, publicClient, setUsdcBalance, chainId]);

  if (isConnected && address) {
    const wrong = chainId !== arcTestnet.id && chainId !== 5042;
    return (
      <div className="flex items-center gap-2">
        {wrong ? (
          <ClayButton
            variant="secondary"
            className="min-h-10 px-3 text-xs"
            onClick={() => switchChain?.({ chainId: arcTestnet.id })}
          >
            Switch to Arc
          </ClayButton>
        ) : (
          <span
            className={`hidden rounded-full px-2.5 py-1 font-mono text-[11px] sm:inline ${
              live ? "bg-teal/15 text-teal" : "bg-ink/8 text-muted"
            }`}
          >
            {live ? "Arc live" : "Wrong network"}
          </span>
        )}
        <ClayButton variant="ghost" className="min-h-10 px-3 font-mono text-xs" onClick={() => disconnect()}>
          {shortAddr(address, 4)}
        </ClayButton>
      </div>
    );
  }

  const injected = connectors.find((c) => c.id === "injected") ?? connectors[0];

  return (
    <ClayButton
      className="min-h-10 px-3 text-xs"
      disabled={!injected || isPending || status === "connecting"}
      onClick={() => injected && connect({ connector: injected, chainId: arcTestnet.id })}
    >
      {isPending ? "Connecting…" : "Connect"}
    </ClayButton>
  );
}
