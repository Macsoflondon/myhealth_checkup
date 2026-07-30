import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MedicalReviewPage = lazy(() => import("@/pages/MedicalReviewPage"));

export const Route = createFileRoute("/about/medical-review")({
  component: MedicalReviewPage,
});
