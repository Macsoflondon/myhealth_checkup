import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HeartHealthPage = lazy(() => import("@/pages/HeartHealthPage"));

export const Route = createFileRoute("/tests/heart")({
  head: () =>
    buildRouteHead({
      title: "Heart Health Blood Tests UK | Compare",
      description: "Compare cardiovascular blood tests covering cholesterol, lipoprotein(a), ApoB and inflammation markers from UK providers.",
      path: "/tests/heart",
    }),
  component: HeartHealthPage,
});
