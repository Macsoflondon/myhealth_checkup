import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminTestUploadPage = lazy(() => import("@/pages/AdminTestUploadPage"));

export const Route = createFileRoute("/admin/test-upload")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminTestUploadPage />
      </AdminShell>
    </AdminRoute>
  ),
});
