import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const SitemapPage = lazy(() => import("@/pages/SitemapPage"));

export const Route = createFileRoute("/sitemap")({
  component: SitemapPage,
});
