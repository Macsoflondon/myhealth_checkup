import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminClinicalSafetyPage = lazy(() => import("@/pages/AdminClinicalSafetyPage"));

export const Route = createFileRoute("/admin/clinical-safety")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminClinicalSafetyPage />
      </AdminShell>
    </AdminRoute>
  ),
});
