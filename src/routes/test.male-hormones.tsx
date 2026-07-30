import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MaleHormoneTestPage = lazy(() => import("@/pages/MaleHormoneTestPage"));

export const Route = createFileRoute("/test/male-hormones")({
  component: MaleHormoneTestPage,
});
