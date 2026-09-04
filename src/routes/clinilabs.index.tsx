import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ClinilabsPage = lazy(() => import("@/pages/ClinilabsPage"));

export const Route = createFileRoute("/clinilabs/")({
  head: () =>
    buildRouteHead({
      title: "Clinilabs Blood Tests & Prices | myhealth checkup",
      description: "Compare Clinilabs blood tests, biomarkers, turnaround times and prices in GBP from UKAS-accredited laboratories.",
      path: "/clinilabs",
    }),
  component: ClinilabsPage,
});
