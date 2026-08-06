import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ConditionsPage = lazy(() => import("@/pages/ConditionsPage"));

export const Route = createFileRoute("/conditions")({
  head: () =>
    buildRouteHead({
      title: "Blood Tests by Condition | myhealth checkup",
      description: "Find private blood tests relevant to specific health conditions, with biomarker detail and side-by-side UK provider pricing.",
      path: "/conditions",
    }),
  component: ConditionsPage,
});
