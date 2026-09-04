import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const BiomarkerGuidePage = lazy(() => import("@/pages/BiomarkerGuidePage"));

const toLabel = (slug: string): string =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const Route = createFileRoute("/guides/$slug")({
  head: ({ params }) => {
    const label = toLabel(params.slug);
    return buildRouteHead({
      title: `${label} Guide | myhealth checkup`,
      description: `What ${label} measures, why it matters and its limitations, with UK tests that include it and their prices in GBP.`,
      path: `/guides/${params.slug}`,
      type: "article",
    });
  },
  component: BiomarkerGuidePage,
});
