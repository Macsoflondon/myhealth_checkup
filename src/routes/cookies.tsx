import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CookiePolicyPage = lazy(() => import("@/pages/CookiePolicyPage"));

export const Route = createFileRoute("/cookies")({
  component: CookiePolicyPage,
});
