import { createFileRoute } from "@tanstack/react-router";
import CategoryRedirect from "@/components/routing/CategoryRedirect";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryRedirect,
});
