import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { OnchainSync } from "@/components/app/onchain-sync";
import { WalletProvider } from "@/components/app/wallet-provider";

export const Route = createFileRoute("/app")({
  component: () => (
    <WalletProvider>
      <OnchainSync />
      <AppShell>
        <Outlet />
      </AppShell>
    </WalletProvider>
  ),
});
