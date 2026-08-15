import { createFileRoute } from "@tanstack/react-router";
// Index stays eager — it's the LCP route. Everything else is code-split.
import Index from "@/pages/Index";
import {
  FIRST_SLIDE_SRC,
  FIRST_SLIDE_AVIF_SRCSET,
} from "@/components/sections/hero-slides";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/")({
  head: () => {
    const base = buildRouteHead({
      title: "Compare private blood tests UK | myhealth checkup",
      description:
        "Compare private blood tests and health checks from UKAS-accredited labs and CQC-regulated UK clinics. Clear prices, biomarkers and turnaround times.",
      path: "/",
    });

    return {
      ...base,
      links: [
        ...base.links,
        // The hero <picture> lists AVIF first, so preload AVIF and tag it with
        // type — AVIF-capable browsers match the rendered candidate, others
        // skip this hint entirely rather than downloading an unused copy.
        {
          rel: "preload",
          as: "image",
          type: "image/avif",
          href: FIRST_SLIDE_SRC,
          imageSrcSet: FIRST_SLIDE_AVIF_SRCSET,
          imageSizes: "100vw",
          fetchPriority: "high",
        },
      ],
    };
  },
  component: Index,
});

