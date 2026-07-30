import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminPerformancePage = lazy(() => import("@/pages/AdminPerformancePage"));

export const Route = createFileRoute("/admin/performance")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminPerformancePage />
      </AdminShell>
    </AdminRoute>
  ),
});
