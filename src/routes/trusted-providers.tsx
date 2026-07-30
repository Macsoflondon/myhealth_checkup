import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TrustedProvidersPage = lazy(() => import("@/pages/TrustedProvidersPage"));

export const Route = createFileRoute("/trusted-providers")({
  component: TrustedProvidersPage,
});
