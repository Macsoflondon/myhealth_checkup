import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead, DEFAULT_SHARE_IMAGE_URL } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { symptomPages } from "@/data/symptomPages";

const SymptomDetailPage = lazy(() => import("@/pages/SymptomDetailPage"));

export const Route = createFileRoute("/compare/symptoms/$symptomSlug")({
  head: ({ params }) => {
    const symptom = symptomPages.find((s) => s.slug === params.symptomSlug);
    const name = symptom?.name ?? "your symptom";

    return buildRouteHead({
      title: `Compare tests for ${name} | myhealth checkup`,
      description: symptom
        ? `Compare private blood tests for ${name.toLowerCase()}: price in GBP, biomarkers included, sample method and typical turnaround across UKAS-accredited UK providers.`
        : "Compare private blood tests by symptom: price in GBP, biomarkers included, sample method and typical turnaround across UKAS-accredited UK providers.",
      path: `/compare/symptoms/${params.symptomSlug}`,
      image: {
        url: DEFAULT_SHARE_IMAGE_URL,
        alt: `myhealth checkup: compare private blood tests for ${name.toLowerCase()}`,
      },
    });
  },
  component: SymptomDetailPage,
});
