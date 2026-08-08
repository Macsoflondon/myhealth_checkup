import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Dashboard = lazy(() => import("@/pages/Dashboard"));

export const Route = createFileRoute("/dashboard")({
  head: () => buildPrivateRouteHead("Your dashboard | myhealth checkup"),
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});
