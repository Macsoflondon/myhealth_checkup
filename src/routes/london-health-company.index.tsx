import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const LondonHealthCompanyPage = lazy(() => import("@/pages/LondonHealthCompanyPage"));

export const Route = createFileRoute("/london-health-company/")({
  head: () =>
    buildRouteHead({
      title: "London Health Company Tests & Prices | myhealth checkup",
      description: "Compare London Health Company blood tests, biomarkers, turnaround times and transparent prices in GBP.",
      path: "/london-health-company",
    }),
  component: LondonHealthCompanyPage,
});
