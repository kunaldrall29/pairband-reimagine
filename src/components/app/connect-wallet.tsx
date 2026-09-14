"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, usePublicClient } from "wagmi";
import { toast } from "sonner";
import { ClayButton } from "@/components/ui/clay-button";
import { isLiveFactory, ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";
import { shortAddr } from "@/lib/utils";
import { arcTestnet } from "@/lib/chains";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { DEMO_USER } from "@/lib/engine/constants.ts";
import { erc20Abi } from "@/lib/abis/launchpad";
import { fromOnChainUsdc } from "@/lib/live-trade";

function hasInjectedProvider(): boolean {
  return typeof window !== "undefined" && Boolean((window as Window & { ethereum?: unknown }).ethereum);
}

export function ConnectWallet() {
  const { address, isConnected, status } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient();
  const live = isLiveFactory(chainId);
  const setAccount = useLaunchpad((s) => s.setAccount);
  const setUsdcBalance = useLaunchpad((s) => s.setUsdcBalance);
  const [helpOpen, setHelpOpen] = useState(false);
  const [providerReady, setProviderReady] = useState(false);

  useEffect(() => {
    setProviderReady(hasInjectedProvider());
    const onChange = () => setProviderReady(hasInjectedProvider());
    window.addEventListener("ethereum#initialized", onChange);
    // Some wallets inject after load.
    const t = window.setInterval(onChange, 1500);
    return () => {
      window.removeEventListener("ethereum#initialized", onChange);
      window.clearInterval(t);
    };
  }, []);

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

  useEffect(() => {
    if (!error) return;
    toast.error(error.message || "Wallet connection failed");
  }, [error]);

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

  function onConnect() {
    if (!providerReady) {
      setHelpOpen(true);
      toast.message("No wallet detected — open Pairband in a wallet browser or install an extension.");
      return;
    }
    if (!injected) {
      setHelpOpen(true);
      toast.error("No wallet connector available in this browser.");
      return;
    }
    try {
      connect({ connector: injected, chainId: arcTestnet.id });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Connect failed");
      setHelpOpen(true);
    }
  }

  return (
    <>
      <ClayButton
        className="min-h-10 px-3 text-xs"
        disabled={isPending || status === "connecting"}
        onClick={onConnect}
      >
        {isPending || status === "connecting" ? "Connecting…" : "Connect"}
      </ClayButton>

      {helpOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
          <div
            role="dialog"
            aria-labelledby="connect-help-title"
            className="w-full max-w-md rounded-3xl border border-ink/10 bg-paper p-6 dark:border-paper/15 dark:bg-ink-2"
          >
            <h2 id="connect-help-title" className="font-display text-2xl">
              Connect a wallet
            </h2>
            <p className="mt-2 text-sm text-muted">
              Pairband uses an injected wallet (MetaMask, Rabby, Phantom EVM, Coinbase Wallet, etc.) on{" "}
              <span className="font-mono text-ink">Arc Testnet (5042002)</span>. Preview iframes and some in-app browsers
              block wallet injection — open the site in your wallet’s browser, or install a desktop extension.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-teal">▸</span>
                Desktop: install MetaMask / Rabby, then click Connect again
              </li>
              <li className="flex gap-2">
                <span className="text-teal">▸</span>
                Mobile: open pairband.com inside your wallet’s built-in browser
              </li>
              <li className="flex gap-2">
                <span className="text-teal">▸</span>
                Until then you can trade the local demo wallet on Discover
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <ClayButton
                className="flex-1"
                onClick={() => {
                  setHelpOpen(false);
                  if (providerReady) onConnect();
                }}
              >
                {providerReady ? "Try Connect again" : "Got it"}
              </ClayButton>
              <ClayButton variant="secondary" className="flex-1" onClick={() => setHelpOpen(false)}>
                Close
              </ClayButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
