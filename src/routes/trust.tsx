import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TrustCentrePage = lazy(() => import("@/pages/TrustCentrePage"));

export const Route = createFileRoute("/trust")({
  head: () =>
    buildRouteHead({
      title: "Trust Centre | myhealth checkup",
      description: "How we vet providers, protect your data and keep our comparisons independent, with our security and compliance standards.",
      path: "/trust",
    }),
  component: TrustCentrePage,
});
