import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ContactPage = lazy(() => import("@/pages/ContactPage"));

export const Route = createFileRoute("/contact")({
  head: () =>
    buildRouteHead({
      title: "Contact myhealth checkup",
      description: "Get in touch with the myhealth checkup team about listings, data corrections, partnerships or general enquiries.",
      path: "/contact",
    }),
  component: ContactPage,
});
