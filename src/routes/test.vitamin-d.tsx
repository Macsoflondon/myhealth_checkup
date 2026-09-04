import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const VitaminDTestPage = lazy(() => import("@/pages/VitaminDTestPage"));

export const Route = createFileRoute("/test/vitamin-d")({
  head: () =>
    buildRouteHead({
      title: "Vitamin D Blood Tests Compared | myhealth checkup",
      description: "Compare vitamin D blood tests from UK providers: sample methods, turnaround times and transparent prices in GBP.",
      path: "/test/vitamin-d",
    }),
  component: VitaminDTestPage,
});
