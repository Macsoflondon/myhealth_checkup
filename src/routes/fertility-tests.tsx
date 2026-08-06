import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FertilityTestsPage = lazy(() => import("@/pages/FertilityTestsPage"));

export const Route = createFileRoute("/fertility-tests")({
  head: () =>
    buildRouteHead({
      title: "Fertility Blood Tests UK | Compare",
      description: "Compare private fertility tests including AMH, FSH, LH and progesterone from accredited UK providers, with clear pricing.",
      path: "/fertility-tests",
    }),
  component: FertilityTestsPage,
});
