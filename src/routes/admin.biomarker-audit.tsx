import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminBiomarkerAuditPage = lazy(() => import("@/pages/AdminBiomarkerAuditPage"));

export const Route = createFileRoute("/admin/biomarker-audit")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminBiomarkerAuditPage />
      </AdminShell>
    </AdminRoute>
  ),
});
