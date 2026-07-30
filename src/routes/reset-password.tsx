import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});
