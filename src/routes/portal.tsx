import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const ClientPortal = lazy(() => import("@/pages/ClientPortal"));

export const Route = createFileRoute("/portal")({
  head: () => buildPrivateRouteHead("Client Portal | myhealth checkup"),
  component: () => (
    <ProtectedRoute>
      <ClientPortal />
    </ProtectedRoute>
  ),
});
