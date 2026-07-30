import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const BiomarkerGuidePage = lazy(() => import("@/pages/BiomarkerGuidePage"));

export const Route = createFileRoute("/guides/$slug")({
  component: BiomarkerGuidePage,
});
