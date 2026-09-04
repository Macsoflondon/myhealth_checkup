import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminClinicalSafetyPage = lazy(() => import("@/pages/AdminClinicalSafetyPage"));

export const Route = createFileRoute("/admin/clinical-safety")({
  head: () => buildPrivateRouteHead("Clinical Safety | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminClinicalSafetyPage />
      </AdminShell>
    </AdminRoute>
  ),
});
