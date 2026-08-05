import { createFileRoute } from "@tanstack/react-router";
// Index stays eager — it's the LCP route. Everything else is code-split.
import Index from "@/pages/Index";
import { FIRST_SLIDE_SRC } from "@/components/sections/hero-slides";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      {
        rel: "preload",
        as: "image",
        href: FIRST_SLIDE_SRC,
        fetchpriority: "high",
      },
    ],
  }),
  component: Index,
});
