import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FairTradingPolicyPage = lazy(() => import("@/pages/FairTradingPolicyPage"));

export const Route = createFileRoute("/fair-trading")({
  head: () =>
    buildRouteHead({
      title: "Fair Trading Statement | myhealth checkup",
      description: "Our commitments on transparent pricing, honest comparison and CMA-compliant consumer information.",
      path: "/fair-trading",
    }),
  component: FairTradingPolicyPage,
});
