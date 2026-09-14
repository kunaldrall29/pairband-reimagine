import { http, createConfig } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { arcTestnet, arcMainnet } from "@/lib/chains";

const wcProjectId =
  (typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_WC_PROJECT_ID) ||
  "";

const connectors = [
  injected({ shimDisconnect: true }),
  // Prefer injected over MetaMask SDK — the SDK often leaves wagmi stuck in
  // "connecting" inside preview iframes / in-app browsers with no ethereum.
  coinbaseWallet({
    appName: "Pairband",
    appLogoUrl: "https://pairband.com/favicon.svg",
    preference: "all",
  }),
  ...(wcProjectId
    ? [
        walletConnect({
          projectId: wcProjectId,
          metadata: {
            name: "Pairband",
            description: "USDC launchpad on Arc",
            url: "https://pairband.com",
            icons: ["https://pairband.com/favicon.svg"],
          },
          showQrModal: true,
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [arcTestnet, arcMainnet],
  connectors,
  transports: {
    [arcTestnet.id]: http("https://rpc.testnet.arc.io"),
    [arcMainnet.id]: http("https://rpc.arc.network"),
  },
  ssr: true,
});

export type ArcDeployment = {
  name: string;
  explorer?: string;
  rpc?: string;
  usdc: string;
  deployer?: string;
  treasury?: string;
  launchpad: string | null;
  ammFactory: string | null;
  settler?: string | null;
  graduateAt?: string;
  launchFeeUsdc?: string;
  agentFeeUsdc?: string;
  agentDesk?: string;
  agentDeskSeedVaultId?: number;
  agentDeskDeployedAt?: string;
};

/** Mirrors packages/config/deployments.json — keep in sync after broadcast. */
export const DEPLOYMENTS: Record<string, ArcDeployment> = {
  "5042002": {
    name: "Arc Testnet",
    explorer: "https://testnet.arcscan.app",
    rpc: "https://rpc.testnet.arc.io",
    usdc: "0x3600000000000000000000000000000000000000",
    deployer: "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23",
    launchpad: "0x22C23Efd9252177AfE02FE9dbd7D648369AF42f4",
    settler: "0x229BD1BcdE44c26E0c7741B46854Ccfb4e54CC40",
    ammFactory: "0x0769121558BB51Fb71Edb933010D294D770e6e18",
    graduateAt: "80000000",
    launchFeeUsdc: "1000000",
    treasury: "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23",
    agentFeeUsdc: "250000",
    agentDesk: "0x9BedBFc897d4f90E92389818edDC968f99Da5563",
    agentDeskSeedVaultId: 0,
    agentDeskDeployedAt: "2026-09-14T08:40:00Z",
  },
  "5042": {
    name: "Arc",
    explorer: "https://arcscan.app",
    rpc: "https://rpc.arc.network",
    usdc: "0x3600000000000000000000000000000000000000",
    deployer: "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23",
    launchpad: null,
    ammFactory: null,
    settler: null,
  },
};

export function deploymentFor(chainId: number): ArcDeployment | null {
  return DEPLOYMENTS[String(chainId)] ?? null;
}

export function isLiveFactory(chainId: number): boolean {
  const d = deploymentFor(chainId);
  return Boolean(d?.launchpad && d?.ammFactory);
}

export const ARC_TESTNET_DEPLOYMENT = DEPLOYMENTS["5042002"];
