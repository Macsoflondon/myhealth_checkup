import { createFileRoute } from "@tanstack/react-router";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareTests = lazy(() => import("@/pages/CompareTests"));

export const Route = createFileRoute("/compare/")({
  head: () =>
    buildCollectionHead({
      title: "Blood test price comparison UK | myhealth checkup",
      description:
        "Compare private blood test prices across UK providers. Check biomarkers, home kits, clinic collection, additional fees and typical turnaround times.",
      path: "/compare",
    }),
  component: CompareTests,
});
