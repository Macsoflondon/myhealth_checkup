import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const LegalPage = lazy(() => import("@/pages/LegalPage"));

export const Route = createFileRoute("/legal")({
  head: () =>
    buildRouteHead({
      title: "Legal Information | myhealth checkup",
      description: "Legal notices for myhealth checkup, including company information, terms of use and regulatory disclosures.",
      path: "/legal",
    }),
  component: LegalPage,
});
