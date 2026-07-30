import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const Auth = lazy(() => import("@/pages/Auth"));

export const Route = createFileRoute("/auth")({
  component: Auth,
});
