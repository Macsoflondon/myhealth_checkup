import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const SitemapPage = lazy(() => import("@/pages/SitemapPage"));

export const Route = createFileRoute("/sitemap")({
  head: () =>
    buildRouteHead({
      title: "Site Map | myhealth checkup",
      description: "Every page on myhealth checkup in one place: comparisons, categories, provider profiles, guides and legal information.",
      path: "/sitemap",
    }),
  component: SitemapPage,
});
