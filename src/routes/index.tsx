import { createFileRoute } from "@tanstack/react-router";
// Index stays eager — it's the LCP route. Everything else is code-split.
import Index from "@/pages/Index";
import {
  FIRST_SLIDE_PRELOAD_HREF,
  FIRST_SLIDE_AVIF_SRCSET,
} from "@/components/sections/hero-slides";
import { buildRouteHead } from "@/lib/seo/route-head";
import { serializeJsonLd } from "@/lib/seo/json-ld";

export const Route = createFileRoute("/")({
  head: () => {
    const base = buildRouteHead({
      title: "Private blood test comparison UK | myhealth checkup",
      description:
        "Compare private blood tests from UK providers. Check prices, biomarkers, collection fees and typical result times, then book with your chosen provider.",
      path: "/",
    });

    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://myhealthcheckup.co.uk/#page",
            url: "https://myhealthcheckup.co.uk",
            name: "Private blood test comparison UK",
            description:
              "Compare private blood tests from UK providers by listed price, biomarkers, collection options, additional collection fees and typical result times. Book directly with your chosen provider.",
            inLanguage: "en-GB",
            isPartOf: { "@id": "https://myhealthcheckup.co.uk/#website" },
            publisher: { "@id": "https://myhealthcheckup.co.uk/#organization" },
            about: { "@type": "Thing", name: "Private blood test comparison" },
          }),
        },
      ],
      meta: [
        ...base.meta,
        { name: "twitter:site", content: "@myhealthcheckup" },
        {
          name: "robots",
          content:
            "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
        },
      ],
      links: [
        ...base.links,
        // The hero <picture> lists AVIF first, so preload AVIF and tag it with
        // type — AVIF-capable browsers match the rendered candidate, others
        // skip this hint entirely rather than downloading an unused copy.
        {
          rel: "preload",
          as: "image",
          type: "image/avif",
          href: FIRST_SLIDE_PRELOAD_HREF,
          imageSrcSet: FIRST_SLIDE_AVIF_SRCSET,
          imageSizes: "100vw",
          fetchPriority: "high",
        },
      ],
    };
  },
  component: Index,
});
