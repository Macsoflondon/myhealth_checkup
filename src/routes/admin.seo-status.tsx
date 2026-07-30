import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminSeoStatusPage = lazy(() => import("@/pages/AdminSeoStatusPage"));

export const Route = createFileRoute("/admin/seo-status")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminSeoStatusPage />
      </AdminShell>
    </AdminRoute>
  ),
});
