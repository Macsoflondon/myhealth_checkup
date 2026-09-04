import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const LipidProfileTestPage = lazy(() => import("@/pages/LipidProfileTestPage"));

export const Route = createFileRoute("/test/lipid-profile")({
  head: () =>
    buildRouteHead({
      title: "Lipid Profile Blood Tests Compared | myhealth checkup",
      description: "Compare cholesterol and lipid profile blood tests in the UK: biomarkers, sample methods, turnaround and prices in GBP.",
      path: "/test/lipid-profile",
    }),
  component: LipidProfileTestPage,
});
