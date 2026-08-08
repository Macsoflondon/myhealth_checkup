import { createFileRoute } from "@tanstack/react-router";
// Index stays eager — it's the LCP route. Everything else is code-split.
import Index from "@/pages/Index";
import { FIRST_SLIDE_SRC } from "@/components/sections/hero-slides";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/")({
  head: () => {
    const base = buildRouteHead({
      title: "Compare Private Blood Tests & Health Checks UK | myhealth checkup",
      description:
        "Compare private blood tests and health checks from UKAS-accredited laboratories and CQC-regulated UK clinics. Clear prices, biomarkers and typical turnaround times.",
      path: "/",
    });

    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "preload",
          as: "image",
          href: FIRST_SLIDE_SRC,
          fetchPriority: "high",
        },
      ],
    };
  },
  component: Index,
});
