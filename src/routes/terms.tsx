import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TermsConditionsPage = lazy(() => import("@/pages/TermsConditionsPage"));

export const Route = createFileRoute("/terms")({
  head: () =>
    buildRouteHead({
      title: "Terms of Use | myhealth checkup",
      description: "The terms governing use of the myhealth checkup comparison platform.",
      path: "/terms",
    }),
  component: TermsConditionsPage,
});
