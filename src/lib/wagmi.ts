import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { arcTestnet, arcMainnet } from "@/lib/chains";

export const wagmiConfig = createConfig({
  chains: [arcTestnet, arcMainnet],
  connectors: [injected({ shimDisconnect: true })],
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
  launchpad: string | null;
  ammFactory: string | null;
  settler?: string | null;
  graduateAt?: string;
};

/** Mirrors packages/config/deployments.json — keep in sync after broadcast. */
export const DEPLOYMENTS: Record<string, ArcDeployment> = {
  "5042002": {
    name: "Arc Testnet",
    explorer: "https://testnet.arcscan.app",
    rpc: "https://rpc.testnet.arc.io",
    usdc: "0x3600000000000000000000000000000000000000",
    deployer: "0x6c21B5BF17eB3284Ee3af77835f2366ebD5D2e23",
    launchpad: "0x0f2c604DB770E2E0a68Fc447E33C66BCB0E8E2e0",
    settler: "0x1D117354187FD5719201B77b04467EB5f3733A91",
    ammFactory: "0x11E21E0d87b6d8f697B34bF1fA1B923dc2e65670",
    graduateAt: "80000000",
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
