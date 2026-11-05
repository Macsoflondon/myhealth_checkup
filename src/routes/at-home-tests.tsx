import { createFileRoute } from "@tanstack/react-router";
import { findAtHomeSection } from "@/config/atHomeSections";
import { buildSubcategoryHead, validateSubcategorySearch } from "@/lib/seo/subcategory-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AtHomeTestsPage = lazy(() => import("@/pages/AtHomeTestsPage"));

export const Route = createFileRoute("/at-home-tests")({
  validateSearch: validateSubcategorySearch,
  head: ({ match }) =>
    buildSubcategoryHead({
      title: "Compare at-home blood test kits UK | myhealth checkup",
      description:
        "Compare at-home test kits from UK providers by price and biomarkers: finger-prick, QuickDraw, saliva, stool and urine samples, analysed by accredited laboratories.",
      path: "/at-home-tests",
      subLabel: findAtHomeSection(match.search.subcategory)?.label,
    }),
  component: AtHomeTestsPage,
});
