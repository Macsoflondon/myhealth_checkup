import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const HealthDashboardPage = lazy(() => import("@/pages/HealthDashboardPage"));

export const Route = createFileRoute("/health-dashboard")({
  head: () => buildPrivateRouteHead("Health dashboard | myhealth checkup"),
  component: () => (
    <ProtectedRoute>
      <HealthDashboardPage />
    </ProtectedRoute>
  ),
});
