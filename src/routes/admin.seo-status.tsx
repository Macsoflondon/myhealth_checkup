import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminSeoStatusPage = lazy(() => import("@/pages/AdminSeoStatusPage"));

export const Route = createFileRoute("/admin/seo-status")({
  head: () => buildPrivateRouteHead("SEO Status | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminSeoStatusPage />
      </AdminShell>
    </AdminRoute>
  ),
});
