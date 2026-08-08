import { createFileRoute } from "@tanstack/react-router";
import { buildArticleHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TotalVsFreeTestosteroneGuidePage = lazy(
  () => import("@/pages/TotalVsFreeTestosteroneGuidePage"),
);

export const Route = createFileRoute("/blog/total-vs-free-testosterone")({
  head: () =>
    buildArticleHead({
      title: "Total vs Free Testosterone: UK Guide",
      description:
        "Independent UK guide explaining total vs free testosterone, why free testosterone matters, and how to compare private tests.",
      path: "/blog/total-vs-free-testosterone",
      datePublished: "2026-07-25",
    }),
  component: TotalVsFreeTestosteroneGuidePage,
});
