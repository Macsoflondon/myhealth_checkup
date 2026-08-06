import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ProviderComparisonPage = lazy(() => import("@/pages/ProviderComparisonPage"));

export const Route = createFileRoute("/providers/compare")({
  head: () =>
    buildRouteHead({
      title: "Compare UK Test Providers",
      description: "Compare UK private test providers on accreditation, catalogue size, pricing and typical turnaround before you book.",
      path: "/providers/compare",
    }),
  component: ProviderComparisonPage,
});
