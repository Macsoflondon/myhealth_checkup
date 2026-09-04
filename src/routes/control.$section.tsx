import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const ControlPage = lazy(() => import("@/pages/ControlPage"));

export const Route = createFileRoute("/control/$section")({
  head: () => buildPrivateRouteHead("Crux Control | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <ControlPage />
      </AdminShell>
    </AdminRoute>
  ),
});
