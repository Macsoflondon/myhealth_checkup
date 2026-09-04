import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const IronProfileTestPage = lazy(() => import("@/pages/IronProfileTestPage"));

export const Route = createFileRoute("/test/iron-profile")({
  head: () =>
    buildRouteHead({
      title: "Iron Profile Blood Tests Compared | myhealth checkup",
      description: "Compare iron profile blood tests in the UK: ferritin and related biomarkers, sample methods, turnaround and prices in GBP.",
      path: "/test/iron-profile",
    }),
  component: IronProfileTestPage,
});
