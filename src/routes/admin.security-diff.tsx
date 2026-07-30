import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminSecurityDiffPage = lazy(() => import("@/pages/AdminSecurityDiffPage"));

export const Route = createFileRoute("/admin/security-diff")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminSecurityDiffPage />
      </AdminShell>
    </AdminRoute>
  ),
});
