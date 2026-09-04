import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const GeneralHealthTestPage = lazy(() => import("@/pages/GeneralHealthTestPage"));

export const Route = createFileRoute("/test/general-health")({
  head: () =>
    buildRouteHead({
      title: "General Health Blood Tests Compared | myhealth checkup",
      description: "Compare general health blood test panels from UK providers: biomarkers included, turnaround times and prices in GBP.",
      path: "/test/general-health",
    }),
  component: GeneralHealthTestPage,
});
