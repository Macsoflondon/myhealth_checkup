import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const HealthDashboardPage = lazy(() => import("@/pages/HealthDashboardPage"));

export const Route = createFileRoute("/health-dashboard")({
  component: () => (
    <ProtectedRoute>
      <HealthDashboardPage />
    </ProtectedRoute>
  ),
});
