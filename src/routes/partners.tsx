import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const PartnersPage = lazy(() => import("@/pages/PartnersPage"));

export const Route = createFileRoute("/partners")({
  component: PartnersPage,
});
