import { createFileRoute } from "@tanstack/react-router";
// Index stays eager — it's the LCP route. Everything else is code-split.
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  component: Index,
});
