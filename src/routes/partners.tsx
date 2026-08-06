import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const PartnersPage = lazy(() => import("@/pages/PartnersPage"));

export const Route = createFileRoute("/partners")({
  head: () =>
    buildRouteHead({
      title: "Partner With myhealth checkup",
      description: "Information for UK diagnostics providers who want their accredited tests listed on our comparison platform.",
      path: "/partners",
    }),
  component: PartnersPage,
});
