import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AffiliateDisclosurePage = lazy(() => import("@/pages/AffiliateDisclosurePage"));

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () =>
    buildRouteHead({
      title: "Affiliate Disclosure | myhealth checkup",
      description: "How myhealth checkup earns revenue, and why affiliate relationships never influence rankings or comparisons.",
      path: "/affiliate-disclosure",
    }),
  component: AffiliateDisclosurePage,
});
