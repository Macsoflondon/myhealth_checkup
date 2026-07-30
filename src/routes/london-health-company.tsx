import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const LondonHealthCompanyPage = lazy(() => import("@/pages/LondonHealthCompanyPage"));

export const Route = createFileRoute("/london-health-company")({
  component: LondonHealthCompanyPage,
});
