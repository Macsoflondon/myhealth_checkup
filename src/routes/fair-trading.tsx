import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FairTradingPolicyPage = lazy(() => import("@/pages/FairTradingPolicyPage"));

export const Route = createFileRoute("/fair-trading")({
  component: FairTradingPolicyPage,
});
