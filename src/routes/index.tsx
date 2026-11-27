import { createFileRoute } from "@tanstack/react-router";
// Index stays eager — it's the LCP route. Everything else is code-split.
import Index from "@/pages/Index";
import {
  FIRST_SLIDE_PRELOAD_HREF,
  FIRST_SLIDE_AVIF_SRCSET,
} from "@/components/sections/hero-slides";
import { buildRouteHead } from "@/lib/seo/route-head";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { homepageComparisonQuery } from "@/lib/homepage-comparison-query";
import {
  homepageShowcaseQueryOptions,
  type HomepageShowcaseTest,
} from "@/services/homepage-test-showcase";
import { testDetailsQueryOptions } from "@/hooks/queries/useTestDetailsByIds";

export const Route = createFileRoute("/")({
  // Seed the same cache read by all three comparison slots before rendering.
  // An unavailable catalogue must not turn the public homepage into an error.
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.prefetchQuery(homepageComparisonQuery),
      context.queryClient.prefetchQuery(homepageShowcaseQueryOptions),
    ]);
    const showcase = context.queryClient.getQueryData<HomepageShowcaseTest[]>(
      homepageShowcaseQueryOptions.queryKey,
    );
    if (showcase?.length)
      await context.queryClient.prefetchQuery(
        testDetailsQueryOptions(showcase.map((test) => test.id)),
      );
  },
  head: () => {
    const base = buildRouteHead({
      title: "Compare UK private blood test prices | myhealth checkup",
      description:
        "Compare private blood tests from nine UK providers: price with collection fees, biomarkers covered and typical result times. Free to use, then book directly.",
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
  component: HomepageRoute,
});

function HomepageRoute() {
  // Router-level hydration restores all successfully prefetched public queries once.
  return <Index />;
}
