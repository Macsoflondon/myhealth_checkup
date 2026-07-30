import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const VitaminDeficiencyPage = lazy(() => import("@/pages/VitaminDeficiencyPage"));

export const Route = createFileRoute("/tests/vitamins")({
  component: VitaminDeficiencyPage,
});
