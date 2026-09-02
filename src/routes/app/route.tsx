import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { WalletProvider } from "@/components/app/wallet-provider";

export const Route = createFileRoute("/app")({
  component: () => (
    <WalletProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </WalletProvider>
  ),
});
