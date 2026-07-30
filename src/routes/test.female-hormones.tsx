import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FemaleHormonesTestPage = lazy(() => import("@/pages/FemaleHormonesTestPage"));

export const Route = createFileRoute("/test/female-hormones")({
  component: FemaleHormonesTestPage,
});
