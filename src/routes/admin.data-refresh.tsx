import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminDataRefreshPage = lazy(() => import("@/pages/AdminDataRefreshPage"));

export const Route = createFileRoute("/admin/data-refresh")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminDataRefreshPage />
      </AdminShell>
    </AdminRoute>
  ),
});
