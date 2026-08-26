import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { getProviderName } from "@/constants/providers";
import { buildRouteHead } from "@/lib/seo/route-head";

const ProviderProfilePage = lazy(() => import("@/pages/ProviderProfilePage"));

export const Route = createFileRoute("/provider/$providerId/")({
  head: ({ params }) => {
    const name = getProviderName(params.providerId);
    return buildRouteHead({
      title: `${name} Reviews & Tests | myhealth checkup`,
      description: `${name} private health tests reviewed and compared. Browse the full test range, prices, accreditations and typical turnaround times.`,
      path: `/provider/${params.providerId}`,
    });
  },
  component: ProviderProfilePage,
});
