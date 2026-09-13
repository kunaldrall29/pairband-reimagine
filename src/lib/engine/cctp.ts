/** Circle CCTP v2 domain IDs. Arc testnet = 26. https://developers.circle.com/cctp/concepts/supported-chains-and-domains */

export const ARC_CCTP_DOMAIN = 26;

export const CCTP_ARC = {
  domain: ARC_CCTP_DOMAIN,
  tokenMessenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
  messageTransmitter: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
} as const;

export type SourceId = "arc" | "eth" | "base" | "uni" | "arb" | "op" | "sol";

export interface CctpChain {
  id: SourceId;
  domain: number;
  name: string;
  short: string;
  chainId: number;
  fast: boolean;
}

export const CCTP_CHAINS: readonly CctpChain[] = [
  { id: "arc", domain: 26, name: "Arc", short: "ARC", chainId: 5042002, fast: false },
  { id: "eth", domain: 0, name: "Ethereum", short: "ETH", chainId: 1, fast: true },
  { id: "base", domain: 6, name: "Base", short: "BASE", chainId: 8453, fast: true },
  { id: "uni", domain: 10, name: "Unichain", short: "UNI", chainId: 130, fast: true },
  { id: "arb", domain: 3, name: "Arbitrum", short: "ARB", chainId: 42161, fast: true },
  { id: "op", domain: 2, name: "OP Mainnet", short: "OP", chainId: 10, fast: true },
  { id: "sol", domain: 5, name: "Solana", short: "SOL", chainId: 0, fast: true },
] as const;

export const ALLOWED_DOMAINS: ReadonlySet<number> = new Set(CCTP_CHAINS.map((c) => c.domain));

export function chainByDomain(domain: number): CctpChain | undefined {
  return CCTP_CHAINS.find((c) => c.domain === domain);
}

export function chainById(id: string): CctpChain | undefined {
  return CCTP_CHAINS.find((c) => c.id === id);
}

export function isArc(domain: number): boolean {
  return domain === ARC_CCTP_DOMAIN;
}
