import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CancerScreeningPage = lazy(() => import("@/pages/CancerScreeningPage"));

export const Route = createFileRoute("/tests/cancer")({
  head: () =>
    buildRouteHead({
      title: "Cancer Screening Tests UK | Compare",
      description: "Compare private cancer screening tests from accredited UK providers by biomarkers, price and turnaround time.",
      path: "/tests/cancer",
    }),
  component: CancerScreeningPage,
});
