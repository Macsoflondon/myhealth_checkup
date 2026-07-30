import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminAuditConsolePage = lazy(() => import("@/pages/AdminAuditConsolePage"));

export const Route = createFileRoute("/admin/audit-console")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminAuditConsolePage />
      </AdminShell>
    </AdminRoute>
  ),
});
