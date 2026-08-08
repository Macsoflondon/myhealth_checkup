import { createFileRoute } from "@tanstack/react-router";
import { buildArticleHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const PrivateBloodTestCostGuidePage = lazy(
  () => import("@/pages/PrivateBloodTestCostGuidePage"),
);

export const Route = createFileRoute("/blog/private-blood-test-cost-guide")({
  head: () =>
    buildArticleHead({
      title: "How Much Does a Private Blood Test Cost in the UK?",
      description:
        "Independent UK price guide to private blood tests, comparing entry-level, standard and comprehensive panel costs across major providers.",
      path: "/blog/private-blood-test-cost-guide",
      datePublished: "2026-07-19",
    }),
  component: PrivateBloodTestCostGuidePage,
});
