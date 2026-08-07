import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AboutUsPage = lazy(() => import("@/pages/AboutUsPage"));

export const Route = createFileRoute("/about/")({
  head: () =>
    buildRouteHead({
      title: "About myhealth checkup | Our Mission",
      description: "How myhealth checkup compares UK private diagnostics independently, with transparent pricing, full biomarker lists and accredited providers only.",
      path: "/about",
    }),
  component: AboutUsPage,
});
