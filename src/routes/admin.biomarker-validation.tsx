import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminBiomarkerValidationPage = lazy(() => import("@/pages/AdminBiomarkerValidationPage"));

export const Route = createFileRoute("/admin/biomarker-validation")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminBiomarkerValidationPage />
      </AdminShell>
    </AdminRoute>
  ),
});
