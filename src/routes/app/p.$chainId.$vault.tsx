import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/p/$chainId/$vault")({
  component: () => <Navigate to="/app" />,
});
