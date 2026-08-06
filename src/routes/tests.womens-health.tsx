import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WomensHealthPage = lazy(() => import("@/pages/WomensHealthPage"));

export const Route = createFileRoute("/tests/womens-health")({
  head: () =>
    buildRouteHead({
      title: "Women's Health Blood Tests UK | Compare",
      description: "Compare private women's health panels covering hormones, thyroid, iron and fertility markers from UK providers.",
      path: "/tests/womens-health",
    }),
  component: WomensHealthPage,
});
