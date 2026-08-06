import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WellnessPage = lazy(() => import("@/pages/WellnessPage"));

export const Route = createFileRoute("/wellness")({
  head: () =>
    buildRouteHead({
      title: "Wellness Blood Tests UK | Compare",
      description: "Compare general wellness and preventative health panels from UK providers, with full biomarker lists and transparent pricing.",
      path: "/wellness",
    }),
  component: WellnessPage,
});
