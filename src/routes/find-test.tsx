import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AssistedTestFinderPage = lazy(() => import("@/pages/AssistedTestFinderPage"));

export const Route = createFileRoute("/find-test")({
  component: AssistedTestFinderPage,
});
