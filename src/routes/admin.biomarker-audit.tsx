import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminBiomarkerAuditPage = lazy(() => import("@/pages/AdminBiomarkerAuditPage"));

export const Route = createFileRoute("/admin/biomarker-audit")({
  head: () => buildPrivateRouteHead("Biomarker Audit | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminBiomarkerAuditPage />
      </AdminShell>
    </AdminRoute>
  ),
});
