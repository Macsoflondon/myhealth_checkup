import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const IntelligentSearchPage = lazy(() => import("@/pages/IntelligentSearchPage"));

export const Route = createFileRoute("/search")({
  component: IntelligentSearchPage,
});
