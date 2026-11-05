import { createFileRoute } from "@tanstack/react-router";
import { findSubcategory } from "@/config/subcategoryMap";
import { buildSubcategoryHead, validateSubcategorySearch } from "@/lib/seo/subcategory-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WellnessPage = lazy(() => import("@/pages/WellnessPage"));

export const Route = createFileRoute("/wellness")({
  validateSearch: validateSubcategorySearch,
  head: ({ match }) =>
    buildSubcategoryHead({
      title: "Wellness blood test comparison UK | myhealth checkup",
      description:
        "Compare wellness blood test prices from UK providers. Check full biomarker lists, home and clinic collection options, fees and typical result times.",
      path: "/wellness",
      subLabel: findSubcategory("wellness", match.search.subcategory)?.label,
    }),
  component: WellnessPage,
});
