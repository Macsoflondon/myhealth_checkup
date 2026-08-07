import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ProviderProfilePage = lazy(() => import("@/pages/ProviderProfilePage"));

export const Route = createFileRoute("/provider/$providerId/")({
  component: ProviderProfilePage,
});
