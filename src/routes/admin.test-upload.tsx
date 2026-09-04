import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminTestUploadPage = lazy(() => import("@/pages/AdminTestUploadPage"));

export const Route = createFileRoute("/admin/test-upload")({
  head: () => buildPrivateRouteHead("Test Upload | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminTestUploadPage />
      </AdminShell>
    </AdminRoute>
  ),
});
