import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HealthBlogPage = lazy(() => import("@/pages/HealthBlogPage"));

export const Route = createFileRoute("/blog")({
  component: HealthBlogPage,
});
