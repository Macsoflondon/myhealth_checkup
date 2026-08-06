import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HormonesPage = lazy(() => import("@/pages/HormonesPage"));

export const Route = createFileRoute("/hormones")({
  head: () =>
    buildRouteHead({
      title: "Hormone Blood Tests UK | Compare Prices",
      description: "Compare private hormone panels covering testosterone, oestradiol, cortisol and more, with full biomarker detail and UK pricing.",
      path: "/hormones",
    }),
  component: HormonesPage,
});
