import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const GoodbodyClinicPage = lazy(() => import("@/pages/GoodbodyClinicPage"));

export const Route = createFileRoute("/goodbody-clinic/")({
  head: () =>
    buildRouteHead({
      title: "GOODBODY Clinic Blood Tests & Prices | myhealth checkup",
      description: "Compare GOODBODY Clinic blood tests, biomarkers, sample methods and prices in GBP across UK clinic and home options.",
      path: "/goodbody-clinic",
    }),
  component: GoodbodyClinicPage,
});
