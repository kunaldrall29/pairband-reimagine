"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
  usePublicClient,
  type Connector,
} from "wagmi";
import { toast } from "sonner";
import { ExternalLink, Smartphone, Wallet, X } from "lucide-react";
import { ClayButton } from "@/components/ui/clay-button";
import { isLiveFactory, ARC_TESTNET_DEPLOYMENT } from "@/lib/wagmi";
import { shortAddr } from "@/lib/utils";
import { arcTestnet } from "@/lib/chains";
import { useLaunchpad } from "@/lib/engine/store.ts";
import { DEMO_USER } from "@/lib/engine/constants.ts";
import { erc20Abi } from "@/lib/abis/launchpad";
import { fromOnChainUsdc } from "@/lib/live-trade";

const DEMO_SESSION_KEY = "pairband.demoWallet.v1";

function hasInjectedProvider(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as Window & { ethereum?: unknown; phantom?: { ethereum?: unknown } };
  return Boolean(w.ethereum || w.phantom?.ethereum);
}

function metaMaskDappLink(): string {
  const href = typeof window !== "undefined" ? window.location.href : "https://pairband.com/app";
  const target = href.replace(/^https?:\/\//, "");
  return `https://metamask.app.link/dapp/${target}`;
}

function connectorLabel(c: Connector): string {
  if (c.id === "metaMaskSDK" || c.type === "metaMask") return "MetaMask";
  if (c.id === "coinbaseWalletSDK" || c.type === "coinbaseWallet") return "Coinbase Wallet";
  if (c.id === "walletConnect" || c.type === "walletConnect") return "WalletConnect";
  if (c.id === "injected") return hasInjectedProvider() ? "Browser wallet" : "Browser wallet";
  return c.name || "Wallet";
}

function readDemoSession(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(DEMO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function ConnectWallet() {
  const { address, isConnected, status } = useAccount();
  const { connectors, connectAsync, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient();
  const live = isLiveFactory(chainId);
  const setAccount = useLaunchpad((s) => s.setAccount);
  const setUsdcBalance = useLaunchpad((s) => s.setUsdcBalance);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [providerReady, setProviderReady] = useState(false);
  const [demoSession, setDemoSession] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setDemoSession(readDemoSession());
    setProviderReady(hasInjectedProvider());
    const onChange = () => setProviderReady(hasInjectedProvider());
    window.addEventListener("ethereum#initialized", onChange);
    const t = window.setInterval(onChange, 1500);
    return () => {
      window.removeEventListener("ethereum#initialized", onChange);
      window.clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setAccount(address);
      if (demoSession) {
        setDemoSession(false);
        try {
          window.localStorage.removeItem(DEMO_SESSION_KEY);
        } catch {
          /* ignore */
        }
      }
    } else if (demoSession) {
      setAccount(DEMO_USER);
    } else {
      setAccount(DEMO_USER);
    }
  }, [isConnected, address, setAccount, demoSession]);

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
    const detail =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String((error as { message: unknown }).message)
          : "Wallet connection failed";
    toast.error(detail || "Wallet connection failed");
  }, [error]);

  function enableDemo() {
    try {
      window.localStorage.setItem(DEMO_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setDemoSession(true);
    setAccount(DEMO_USER);
    setSheetOpen(false);
    toast.success("Demo wallet ready — trade locally on Discover");
  }

  function clearDemo() {
    try {
      window.localStorage.removeItem(DEMO_SESSION_KEY);
    } catch {
      /* ignore */
    }
    setDemoSession(false);
    setAccount(DEMO_USER);
  }

  async function connectWith(connector: Connector) {
    setBusyId(connector.id);
    try {
      await connectAsync({ connector, chainId: arcTestnet.id });
      setSheetOpen(false);
      toast.success("Wallet connected");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Connect failed";
      // User rejection is normal — keep the sheet open with a quiet toast.
      if (/reject|denied|cancel/i.test(msg)) {
        toast.message("Connection cancelled");
      } else {
        toast.error(msg);
      }
    } finally {
      setBusyId(null);
    }
  }

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
        <ClayButton
          variant="ghost"
          className="min-h-10 px-3 font-mono text-xs"
          onClick={() => {
            disconnect();
            clearDemo();
          }}
        >
          {shortAddr(address, 4)}
        </ClayButton>
      </div>
    );
  }

  if (demoSession) {
    return (
      <ClayButton
        variant="ghost"
        className="min-h-10 px-3 font-mono text-xs"
        onClick={() => {
          clearDemo();
          toast.message("Demo wallet cleared — connect a real wallet anytime");
        }}
        title="Demo wallet (tap to clear)"
      >
        <span className="rounded-full bg-teal/15 px-1.5 py-0.5 text-[10px] font-sans text-teal">Demo</span>
        {shortAddr(DEMO_USER, 4)}
      </ClayButton>
    );
  }

  const uniqueConnectors = connectors.filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
  const connecting = isPending || status === "connecting" || busyId !== null;

  return (
    <>
      <ClayButton
        className="min-h-10 px-3 text-xs"
        disabled={connecting && !sheetOpen}
        onClick={() => setSheetOpen(true)}
      >
        {connecting && !sheetOpen ? "Connecting…" : "Connect"}
      </ClayButton>

      {sheetOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSheetOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-labelledby="connect-sheet-title"
            className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-paper p-6 shadow-[0_24px_64px_rgba(11,15,20,0.28)] dark:border-paper/15 dark:bg-ink-2"
          >
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-ink/5 dark:hover:bg-paper/10"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex size-12 items-center justify-center rounded-2xl bg-teal/15 text-teal">
              <Wallet size={22} />
            </div>
            <h2 id="connect-sheet-title" className="mt-4 font-display text-2xl">
              Connect wallet
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Arc Testnet <span className="font-mono text-ink dark:text-paper">5042002</span>. Pick a wallet, or keep
              trading with the local demo.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              {uniqueConnectors.map((connector) => {
                const isInjectedEmpty = connector.id === "injected" && !providerReady;
                const label = connectorLabel(connector);
                return (
                  <ClayButton
                    key={connector.id}
                    variant="secondary"
                    className="w-full justify-between"
                    disabled={connecting || isInjectedEmpty}
                    onClick={() => void connectWith(connector)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Wallet size={16} />
                      {busyId === connector.id ? `Opening ${label}…` : label}
                    </span>
                    {isInjectedEmpty ? (
                      <span className="text-xs text-muted">Not detected</span>
                    ) : connector.type === "metaMask" ? (
                      <span className="text-xs text-muted">Extension / app</span>
                    ) : connector.type === "coinbaseWallet" ? (
                      <span className="text-xs text-muted">App / smart wallet</span>
                    ) : connector.type === "walletConnect" ? (
                      <span className="text-xs text-muted">QR / mobile</span>
                    ) : (
                      <span className="text-xs text-muted">Detected</span>
                    )}
                  </ClayButton>
                );
              })}

              <a
                href={metaMaskDappLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-2xl border border-ink/10 bg-transparent px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink/5 dark:border-paper/15 dark:text-paper dark:hover:bg-paper/5"
                onClick={() => setSheetOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <Smartphone size={16} />
                  Open in MetaMask mobile
                </span>
                <ExternalLink size={14} className="text-muted" />
              </a>

              <ClayButton className="w-full" onClick={enableDemo} disabled={connecting}>
                Continue with demo wallet
              </ClayButton>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              Preview and some in-app browsers block extensions. On phone, use MetaMask / Coinbase / Phantom’s built-in
              browser, or the MetaMask link above.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
