import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const LipidProfileTestPage = lazy(() => import("@/pages/LipidProfileTestPage"));

export const Route = createFileRoute("/test/lipid-profile")({
  component: LipidProfileTestPage,
});
