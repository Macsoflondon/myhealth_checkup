import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AdminAuth = lazy(() => import("@/pages/AdminAuth"));

export const Route = createFileRoute("/admin/login")({
  component: AdminAuth,
});
