import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminScraperDashboardPage = lazy(() => import("@/pages/AdminScraperDashboardPage"));

export const Route = createFileRoute("/admin/scrapers")({
  head: () => buildPrivateRouteHead("Scrapers | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminScraperDashboardPage />
      </AdminShell>
    </AdminRoute>
  ),
});
