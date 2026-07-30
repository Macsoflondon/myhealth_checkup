import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HormonesPage = lazy(() => import("@/pages/HormonesPage"));

export const Route = createFileRoute("/hormones")({
  component: HormonesPage,
});
