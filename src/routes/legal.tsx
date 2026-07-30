import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const LegalPage = lazy(() => import("@/pages/LegalPage"));

export const Route = createFileRoute("/legal")({
  component: LegalPage,
});
