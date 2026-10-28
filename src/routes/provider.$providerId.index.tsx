import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { getProviderName, normalizeProviderId } from "@/constants/providers";
import { buildProviderHead } from "@/lib/seo/route-head";

const ProviderProfilePage = lazy(() => import("@/pages/ProviderProfilePage"));

export const Route = createFileRoute("/provider/$providerId/")({
  beforeLoad: ({ params }) => {
    const providerId = normalizeProviderId(params.providerId);
    if (providerId !== params.providerId) {
      throw redirect({
        to: "/provider/$providerId",
        params: { providerId },
        statusCode: 301,
        replace: true,
      });
    }
  },
  head: ({ params }) =>
    buildProviderHead({
      providerId: params.providerId,
      providerName: getProviderName(params.providerId),
    }),
  component: ProviderProfilePage,
});
