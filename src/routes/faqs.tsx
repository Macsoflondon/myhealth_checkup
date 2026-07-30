import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FAQsPage = lazy(() => import("@/pages/FAQsPage"));

export const Route = createFileRoute("/faqs")({
  component: FAQsPage,
});
