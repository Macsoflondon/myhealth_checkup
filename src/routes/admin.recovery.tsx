import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AdminRecovery = lazy(() => import("@/pages/AdminRecovery"));

export const Route = createFileRoute("/admin/recovery")({
  component: AdminRecovery,
});
