import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AffiliateDisclosurePage = lazy(() => import("@/pages/AffiliateDisclosurePage"));

export const Route = createFileRoute("/affiliate-disclosure")({
  component: AffiliateDisclosurePage,
});
