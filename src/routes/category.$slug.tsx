import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import CategoryRedirect from "@/components/routing/CategoryRedirect";

export const Route = createFileRoute("/category/$slug")({
  head: () => buildPrivateRouteHead("Redirecting | myhealth checkup"),
  component: CategoryRedirect,
});
