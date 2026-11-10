import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ReviewSystem = lazy(() => import("@/components/reviews/ReviewSystem"));

export const Route = createFileRoute("/reviews")({
  head: () =>
    buildRouteHead({
      title: "User reviews | myhealth checkup",
      description:
        "What people say about comparing private blood tests with myhealth checkup — the same reviews featured on our homepage.",
      path: "/reviews",
    }),
  component: ReviewSystem,
});
