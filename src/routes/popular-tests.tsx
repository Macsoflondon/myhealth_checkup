import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MostPopularTestsPage = lazy(() => import("@/pages/MostPopularTestsPage"));

export const Route = createFileRoute("/popular-tests")({
  component: MostPopularTestsPage,
});
