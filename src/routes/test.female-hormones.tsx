import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FemaleHormonesTestPage = lazy(() => import("@/pages/FemaleHormonesTestPage"));

export const Route = createFileRoute("/test/female-hormones")({
  head: () =>
    buildRouteHead({
      title: "Female Hormone Blood Tests Compared | myhealth checkup",
      description: "Compare female hormone blood tests across UK providers: biomarkers, sample methods, turnaround times and prices in GBP.",
      path: "/test/female-hormones",
    }),
  component: FemaleHormonesTestPage,
});
