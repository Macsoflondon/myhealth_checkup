import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminTestDashboardPage = lazy(() => import("@/pages/AdminTestDashboardPage"));

export const Route = createFileRoute("/admin/test-dashboard")({
  head: () => buildPrivateRouteHead("Test Dashboard | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminTestDashboardPage />
      </AdminShell>
    </AdminRoute>
  ),
});
