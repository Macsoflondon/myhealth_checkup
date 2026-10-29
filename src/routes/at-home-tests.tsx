import { createFileRoute } from "@tanstack/react-router";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AtHomeTestsPage = lazy(() => import("@/pages/AtHomeTestsPage"));

export const Route = createFileRoute("/at-home-tests")({
  head: () =>
    buildCollectionHead({
      title: "Compare at-home blood test kits UK | myhealth checkup",
      description:
        "Compare at-home test kits from UK providers by price and biomarkers: finger-prick, QuickDraw, saliva, stool and urine samples, analysed by accredited laboratories.",
      path: "/at-home-tests",
    }),
  component: AtHomeTestsPage,
});
