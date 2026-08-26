import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { getProviderName } from "@/constants/providers";
import { buildProviderHead } from "@/lib/seo/route-head";

const ProviderProfilePage = lazy(() => import("@/pages/ProviderProfilePage"));

export const Route = createFileRoute("/provider/$providerId/")({
  head: ({ params }) =>
    buildProviderHead({
      providerId: params.providerId,
      providerName: getProviderName(params.providerId),
    }),
  component: ProviderProfilePage,
});
