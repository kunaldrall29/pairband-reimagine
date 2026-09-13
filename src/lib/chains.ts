import { defineChain } from "viem";
import { ARC_MAINNET_ID, ARC_TESTNET_ID, ARC_USDC } from "@/lib/engine/constants.ts";

export const arcTestnet = defineChain({
  id: ARC_TESTNET_ID,
  name: "Arc Testnet",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.io", "https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://testnet.arcscan.app" },
  },
  testnet: true,
});

export const arcMainnet = defineChain({
  id: ARC_MAINNET_ID,
  name: "Arc",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.arc.network"] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://arcscan.app" },
  },
  testnet: false,
});

export const ARC = {
  testnet: {
    chain: arcTestnet,
    usdc: ARC_USDC,
    faucet: "https://faucet.circle.com",
    explorer: "https://testnet.arcscan.app",
    graduateAt: "$80",
    note: "Public testnet. USDC is gas and quote.",
  },
  mainnet: {
    chain: arcMainnet,
    usdc: ARC_USDC,
    faucet: null,
    explorer: "https://arcscan.app",
    graduateAt: "config at deploy",
    note: "Public mainnet opens 16 September 2026. Same bytecode.",
  },
} as const;
