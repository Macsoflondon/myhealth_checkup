import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminTestDashboardPage = lazy(() => import("@/pages/AdminTestDashboardPage"));

export const Route = createFileRoute("/admin/test-dashboard")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminTestDashboardPage />
      </AdminShell>
    </AdminRoute>
  ),
});
