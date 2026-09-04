import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminSecurityDiffPage = lazy(() => import("@/pages/AdminSecurityDiffPage"));

export const Route = createFileRoute("/admin/security-diff")({
  head: () => buildPrivateRouteHead("Security Diff | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminSecurityDiffPage />
      </AdminShell>
    </AdminRoute>
  ),
});
