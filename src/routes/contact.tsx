import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ContactPage = lazy(() => import("@/pages/ContactPage"));

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
