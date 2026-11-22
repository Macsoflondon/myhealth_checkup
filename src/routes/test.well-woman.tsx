import { educationalCatalogueQuery } from "@/services/educational-test-catalogue";
import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WellWomanTestPage = lazy(() => import("@/pages/WellWomanTestPage"));

export const Route = createFileRoute("/test/well-woman")({
  loader: ({ context }) => context.queryClient.ensureQueryData(educationalCatalogueQuery),
  head: () =>
    buildRouteHead({
      title: "Well woman blood tests compared | myhealth checkup",
      description:
        "Compare well woman health panels from UK providers: biomarkers covered, sample methods, turnaround and prices in GBP.",
      path: "/test/well-woman",
    }),
  component: WellWomanTestPage,
});
