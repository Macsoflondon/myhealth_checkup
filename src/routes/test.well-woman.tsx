import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WellWomanTestPage = lazy(() => import("@/pages/WellWomanTestPage"));

export const Route = createFileRoute("/test/well-woman")({
  head: () =>
    buildRouteHead({
      title: "Well Woman Blood Tests Compared | myhealth checkup",
      description: "Compare well woman health panels from UK providers: biomarkers covered, sample methods, turnaround and prices in GBP.",
      path: "/test/well-woman",
    }),
  component: WellWomanTestPage,
});
