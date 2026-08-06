import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HowItWorksPage = lazy(() => import("@/pages/HowItWorksPage"));

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    buildRouteHead({
      title: "How myhealth checkup Works",
      description: "Search, compare and choose a private health test in three steps, with clear pricing, biomarker detail and accredited UK providers.",
      path: "/how-it-works",
    }),
  component: HowItWorksPage,
});
