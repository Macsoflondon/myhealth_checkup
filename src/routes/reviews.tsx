import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ReviewSystem = lazy(() => import("@/components/reviews/ReviewSystem"));

export const Route = createFileRoute("/reviews")({
  component: ReviewSystem,
});
