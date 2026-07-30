import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const VitaminDTestPage = lazy(() => import("@/pages/VitaminDTestPage"));

export const Route = createFileRoute("/test/vitamin-d")({
  component: VitaminDTestPage,
});
