import { createFileRoute } from "@tanstack/react-router";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareTests = lazy(() => import("@/pages/CompareTests"));

export const Route = createFileRoute("/compare/")({
  head: () => {
    const base = buildCollectionHead({
      title: "Blood test price comparison UK | myhealth checkup",
      description:
        "Compare private blood test prices across UK providers. Check biomarkers, home kits, clinic collection, additional fees and typical turnaround times.",
      path: "/compare",
    });
    // The page has no visible questions and answers, so FAQPage would describe
    // hidden content. Only describe the comparison collection and breadcrumbs.
    return base;
  },
  component: CompareTests,
});
