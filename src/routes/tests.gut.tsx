import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const GutHealthPage = lazy(() => import("@/pages/GutHealthPage"));

export const Route = createFileRoute("/tests/gut")({
  head: () =>
    buildRouteHead({
      title: "Gut Health Tests UK | Compare Prices",
      description: "Compare private gut health tests including coeliac, microbiome and digestive panels from UK providers.",
      path: "/tests/gut",
    }),
  component: GutHealthPage,
});
