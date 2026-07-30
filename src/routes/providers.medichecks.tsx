import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MedichecksTestsCatalogPage = lazy(() => import("@/pages/MedichecksTestsCatalogPage"));

export const Route = createFileRoute("/providers/medichecks")({
  component: MedichecksTestsCatalogPage,
});
