import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/curator")({
  component: () => <Navigate to="/app" />,
});
