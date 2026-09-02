"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { ClayButton } from "@/components/ui/clay-button";
import { isLiveFactory } from "@/lib/wagmi";
import { shortAddr } from "@/lib/utils";
import { arcTestnet } from "@/lib/chains";

export function ConnectWallet() {
  const { address, isConnected, status } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const live = isLiveFactory(chainId);

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
              live ? "bg-teal/20 text-teal-2" : "bg-amber/20 text-amber-2"
            }`}
          >
            {live ? "Live factory" : "Simulation"}
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
