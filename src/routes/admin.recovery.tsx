import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AdminRecovery = lazy(() => import("@/pages/AdminRecovery"));

export const Route = createFileRoute("/admin/recovery")({
  head: () => buildPrivateRouteHead("Recovery | Admin | myhealth checkup"),
  component: AdminRecovery,
});
