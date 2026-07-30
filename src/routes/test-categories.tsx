import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TestCategoriesPage = lazy(() => import("@/pages/TestCategoriesPage"));

export const Route = createFileRoute("/test-categories")({
  component: TestCategoriesPage,
});
