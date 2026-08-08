import { createFileRoute } from "@tanstack/react-router";
import { buildArticleHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FerritinVsIronComparisonGuidePage = lazy(
  () => import("@/pages/FerritinVsIronComparisonGuidePage"),
);

export const Route = createFileRoute("/blog/ferritin-vs-iron-comparison-guide")({
  head: () =>
    buildArticleHead({
      title: "Ferritin vs Iron: Which Blood Test Do You Need?",
      description:
        "Independent UK guide comparing ferritin and serum iron blood tests: what each measures, when to test and how to read your results.",
      path: "/blog/ferritin-vs-iron-comparison-guide",
      datePublished: "2026-07-19",
    }),
  component: FerritinVsIronComparisonGuidePage,
});
