import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminOpsPage = lazy(() => import("@/pages/AdminOpsPage"));

export const Route = createFileRoute("/admin/ops")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminOpsPage />
      </AdminShell>
    </AdminRoute>
  ),
});
