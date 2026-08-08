import { createFileRoute } from "@tanstack/react-router";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const VitaminDeficiencyPage = lazy(() => import("@/pages/VitaminDeficiencyPage"));

export const Route = createFileRoute("/tests/vitamins")({
  head: () =>
    buildCollectionHead({
      title: "Vitamin and Mineral Tests UK | Compare",
      description: "Compare private vitamin and mineral tests covering vitamin D, B12, folate, ferritin and more from accredited UK laboratories.",
      path: "/tests/vitamins",
    }),
  component: VitaminDeficiencyPage,
});
