import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { getProviderName, normalizeProviderId } from "@/constants/providers";
import { buildTestHead } from "@/lib/seo/route-head";
import { fetchTestSeoSummary } from "@/lib/seo/test-seo.functions";

const ProviderTestDetailPage = lazy(
  () => import("@/pages/ProviderTestDetailPage"),
);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const humanise = (slug: string) =>
  UUID_PATTERN.test(slug)
    ? "Test details"
    : decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Loads the test itself alongside the SEO summary, so the server-rendered
 * HTML carries the full page (name, price, biomarkers, booking details)
 * instead of a loading skeleton that only fills in after the scripts run.
 * The lookup module is imported on demand to keep it out of the startup
 * route bundle; the page component's chunk already shares it. A failed
 * lookup returns null and the page fetches the test in the browser, as it
 * did before.
 */
const loadTest = async (providerId: string, testId: string) => {
  try {
    const { findTestByIdOrSlug } = await import("@/utils/testSlugLookup");
    return await findTestByIdOrSlug(providerId, testId);
  } catch (error) {
    console.error("[provider-test] loader lookup failed", error);
    return null;
  }
};

export const Route = createFileRoute("/provider/$providerId/tests/$testId")({
  loader: async ({ params }) => {
    const providerId = normalizeProviderId(params.providerId);
    const [seo, test] = await Promise.all([
      fetchTestSeoSummary({ data: { testId: params.testId } }).catch(
        () => null,
      ),
      loadTest(providerId, params.testId),
    ]);
    return { seo, test };
  },
  head: ({ params, loaderData }) =>
    buildTestHead({
      providerId: params.providerId,
      providerName:
        loaderData?.seo?.providerName || getProviderName(params.providerId),
      testId: params.testId,
      testName: loaderData?.seo?.testName ?? humanise(params.testId),
      priceGbp: loaderData?.seo?.price ?? null,
      biomarkerCount: loaderData?.seo?.biomarkerCount ?? null,
    }),
  component: ProviderTestRoute,
});

function ProviderTestRoute() {
  const { providerId, testId } = Route.useParams();
  const { test } = Route.useLoaderData();
  return (
    <ProviderTestDetailPage
      providerId={normalizeProviderId(providerId)}
      initialTest={test}
      initialTestKey={testId}
    />
  );
}
