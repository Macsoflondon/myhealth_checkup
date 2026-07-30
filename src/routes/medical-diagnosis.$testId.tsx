import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ProviderTestDetailPage = lazy(() => import("@/pages/ProviderTestDetailPage"));

export const Route = createFileRoute("/medical-diagnosis/$testId")({
  component: () => <ProviderTestDetailPage providerId="medical-diagnosis" />,
});
