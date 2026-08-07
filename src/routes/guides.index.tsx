import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const BiomarkerGuidesIndexPage = lazy(() => import("@/pages/BiomarkerGuidesIndexPage"));

export const Route = createFileRoute("/guides/")({
  head: () =>
    buildRouteHead({
      title: "Biomarker Guides | myhealth checkup",
      description: "In-depth guides explaining what each biomarker measures, why it matters and how to interpret private test results.",
      path: "/guides",
    }),
  component: BiomarkerGuidesIndexPage,
});
