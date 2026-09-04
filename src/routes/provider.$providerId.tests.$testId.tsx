import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { getProviderName, normalizeProviderId } from "@/constants/providers";
import { buildTestHead } from "@/lib/seo/route-head";
import { fetchTestSeoSummary } from "@/lib/seo/test-seo.functions";

const ProviderTestDetailPage = lazy(() => import("@/pages/ProviderTestDetailPage"));

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const humanise = (slug: string) =>
  UUID_PATTERN.test(slug)
    ? "Test details"
    : decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

export const Route = createFileRoute("/provider/$providerId/tests/$testId")({
  loader: ({ params }) => fetchTestSeoSummary({ data: { testId: params.testId } }),
  head: ({ params, loaderData }) =>
    buildTestHead({
      providerId: params.providerId,
      providerName: (loaderData?.providerName || getProviderName(params.providerId)),
      testId: params.testId,
      testName: loaderData?.testName ?? humanise(params.testId),
      priceGbp: loaderData?.price ?? null,
      biomarkerCount: loaderData?.biomarkerCount ?? null,
    }),
  component: () => {
    const { providerId } = Route.useParams();
    return <ProviderTestDetailPage providerId={normalizeProviderId(providerId)} />;
  },
});
