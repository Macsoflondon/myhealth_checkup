import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ReviewSystem = lazy(() => import("@/components/reviews/ReviewSystem"));

export const Route = createFileRoute("/reviews")({
  head: () =>
    buildRouteHead({
      title: "Provider Reviews | myhealth checkup",
      description: "Verified review ratings for the UK private test providers we compare, alongside accreditation and service detail.",
      path: "/reviews",
    }),
  component: ReviewSystem,
});
