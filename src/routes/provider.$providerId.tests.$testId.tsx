import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { getProviderName } from "@/constants/providers";
import { buildRouteHead } from "@/lib/seo/route-head";

const TestDetailPage = lazy(() => import("@/pages/TestDetailPage"));

const humanise = (slug: string) =>
  decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const Route = createFileRoute("/provider/$providerId/tests/$testId")({
  head: ({ params }) => {
    const name = getProviderName(params.providerId);
    const testName = humanise(params.testId);
    return buildRouteHead({
      title: `${testName} — ${name} | myhealth checkup`,
      description: `Compare the ${testName} from ${name} against other accredited UK providers. Biomarkers, sample method, typical turnaround and pricing side-by-side.`,
      path: `/provider/${params.providerId}/tests/${params.testId}`,
    });
  },
  component: TestDetailPage,
});
