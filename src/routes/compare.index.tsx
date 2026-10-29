import { createFileRoute } from "@tanstack/react-router";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareTests = lazy(() => import("@/pages/CompareTests"));

export const Route = createFileRoute("/compare/")({
  head: () => {
    const base = buildCollectionHead({
      title: "Blood test price comparison UK | myhealth checkup",
      description:
        "Compare private blood test prices across UK providers. Check biomarkers, home kits, clinic collection, additional fees and typical turnaround times.",
      path: "/compare",
    });
    return {
      ...base,
      scripts: [
        ...base.scripts,
        {
          type: "application/ld+json",
          children: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I compare private blood tests in the UK?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use myhealth checkup to compare price, biomarker coverage, sample method, and typical turnaround across UKAS-accredited providers including Medichecks, Randox and more. Filter by category, then select up to five tests to compare side-by-side.",
                },
              },
              {
                "@type": "Question",
                name: "Are the labs UKAS accredited?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We only list providers whose laboratories hold UKAS accreditation (ISO 15189 where applicable) and whose clinics are CQC regulated. Accreditation status is shown on every provider profile.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need a GP referral to book a private blood test?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No GP referral is required for the tests listed on myhealth checkup. You can book directly through the provider. Some specialist tests may include an optional GP review of your results.",
                },
              },
              {
                "@type": "Question",
                name: "How long do results take?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Typical turnaround is 2–5 working days from sample receipt for most blood tests, though times vary by provider and test type. Estimated turnaround is shown on each test card.",
                },
              },
              {
                "@type": "Question",
                name: "Is myhealth checkup free to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The comparison platform is free for users. We may earn a referral fee when you book through a provider link, which never affects the price you pay or the ranking of results.",
                },
              },
            ],
          }),
        },
      ],
    };
  },
  component: CompareTests,
});
