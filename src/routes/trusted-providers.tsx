import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TrustedProvidersPage = lazy(() => import("@/pages/TrustedProvidersPage"));

export const Route = createFileRoute("/trusted-providers")({
  head: () =>
    buildRouteHead({
      title: "Trusted UK Test Providers",
      description: "Profiles of the UKAS-accredited and CQC-regulated providers we compare, including how each collects samples and reports results.",
      path: "/trusted-providers",
    }),
  component: TrustedProvidersPage,
});
