import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { buildRouteHead } from "@/lib/seo/route-head";

const MedichecksTestsCatalogPage = lazy(() => import("@/pages/MedichecksTestsCatalogPage"));

export const Route = createFileRoute("/providers/medichecks")({
  head: () =>
    buildRouteHead({
      title: "Medichecks Tests — Full Range & Prices",
      description:
        "Browse the full Medichecks blood test range. Compare prices, biomarkers and typical turnaround times against other accredited UK providers.",
      path: "/providers/medichecks",
    }),
  component: MedichecksTestsCatalogPage,
});
