import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const GoodbodyClinicPage = lazy(() => import("@/pages/GoodbodyClinicPage"));

export const Route = createFileRoute("/goodbody-clinic/")({
  component: GoodbodyClinicPage,
});
