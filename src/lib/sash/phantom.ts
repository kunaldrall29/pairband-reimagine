/**
 * Phantom injected provider helpers (browser only).
 * @see https://docs.phantom.com/solana/detecting-the-provider
 */

export type PhantomSolanaProvider = {
  isPhantom?: boolean;
  publicKey?: { toString(): string } | null;
  isConnected?: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{
    publicKey: { toString(): string };
  }>;
  disconnect: () => Promise<void>;
  signMessage: (
    message: Uint8Array,
    display?: "utf8" | "hex",
  ) => Promise<{ signature: Uint8Array }>;
  signAndSendTransaction?: (tx: unknown) => Promise<{ signature: string }>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  request?: (args: {
    method: string;
    params?: unknown;
  }) => Promise<unknown>;
};

declare global {
  interface Window {
    phantom?: { solana?: PhantomSolanaProvider };
    solana?: PhantomSolanaProvider;
  }
}

export function getPhantomProvider(): PhantomSolanaProvider | null {
  if (typeof window === "undefined") return null;
  const provider = window.phantom?.solana;
  if (provider?.isPhantom) return provider;
  if (window.solana?.isPhantom) return window.solana;
  return null;
}

export async function connectPhantom(): Promise<string> {
  const provider = getPhantomProvider();
  if (!provider) {
    window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
    throw new Error("Phantom not installed — open phantom.app to install.");
  }
  const res = await provider.connect();
  return res.publicKey.toString();
}

export async function signPhantomMessage(message: string): Promise<string> {
  const provider = getPhantomProvider();
  if (!provider?.publicKey) throw new Error("Connect Phantom first");
  const encoded = new TextEncoder().encode(message);
  const { signature } = await provider.signMessage(encoded, "utf8");
  // base64 for transport
  let binary = "";
  signature.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}
