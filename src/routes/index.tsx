import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/page";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "Pairband — Launch in USDC. Graduate to Uniswap." }],
  }),
});

function Home() {
  return <MarketingPage />;
}

export { Link };
