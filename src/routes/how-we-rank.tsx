import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HowWeRankPage = lazy(() => import("@/pages/HowWeRankPage"));

export const Route = createFileRoute("/how-we-rank")({
  component: HowWeRankPage,
});
