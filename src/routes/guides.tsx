import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const BiomarkerGuidesIndexPage = lazy(() => import("@/pages/BiomarkerGuidesIndexPage"));

export const Route = createFileRoute("/guides")({
  component: BiomarkerGuidesIndexPage,
});
