import { createFileRoute } from "@tanstack/react-router";
import { buildArticleHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TestosteroneLevelsByAgePage = lazy(() => import("@/pages/TestosteroneLevelsByAgePage"));

export const Route = createFileRoute("/blog/testosterone-levels-by-age")({
  head: () =>
    buildArticleHead({
      title: "Normal Testosterone Levels by Age (UK Guide)",
      description:
        "An independent UK guide to typical testosterone levels by age, what the numbers mean, and how to compare private testosterone tests.",
      path: "/blog/testosterone-levels-by-age",
      datePublished: "2026-06-19",
    }),
  component: TestosteroneLevelsByAgePage,
});
