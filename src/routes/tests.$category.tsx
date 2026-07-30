import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CategoryLandingPage = lazy(() => import("@/pages/CategoryLandingPage"));

export const Route = createFileRoute("/tests/$category")({
  component: CategoryLandingPage,
});
