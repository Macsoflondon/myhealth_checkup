import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ProviderTestDetailPage = lazy(() => import("@/pages/ProviderTestDetailPage"));

export const Route = createFileRoute("/london-medical-laboratory/$testId")({
  component: () => <ProviderTestDetailPage providerId="london-medical-laboratory" />,
});
