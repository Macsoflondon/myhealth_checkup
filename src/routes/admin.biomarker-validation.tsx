import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminBiomarkerValidationPage = lazy(() => import("@/pages/AdminBiomarkerValidationPage"));

export const Route = createFileRoute("/admin/biomarker-validation")({
  head: () => buildPrivateRouteHead("Biomarker Validation | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminBiomarkerValidationPage />
      </AdminShell>
    </AdminRoute>
  ),
});
