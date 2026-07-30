import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ThyroidPage = lazy(() => import("@/pages/ThyroidPage"));

export const Route = createFileRoute("/thyroid")({
  component: ThyroidPage,
});
