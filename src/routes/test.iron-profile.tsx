import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const IronProfileTestPage = lazy(() => import("@/pages/IronProfileTestPage"));

export const Route = createFileRoute("/test/iron-profile")({
  component: IronProfileTestPage,
});
