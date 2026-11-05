import { createFileRoute } from "@tanstack/react-router";
import { findSubcategory } from "@/config/subcategoryMap";
import { buildSubcategoryHead, validateSubcategorySearch } from "@/lib/seo/subcategory-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WomensHealthPage = lazy(() => import("@/pages/WomensHealthPage"));

export const Route = createFileRoute("/tests/womens-health")({
  validateSearch: validateSubcategorySearch,
  head: ({ match }) =>
    buildSubcategoryHead({
      title: "Women's health blood tests UK | myhealth checkup",
      description:
        "Compare private women's health panels covering hormones, thyroid, iron and fertility markers from UK providers.",
      path: "/tests/womens-health",
      subLabel: findSubcategory("womens-health", match.search.subcategory)?.label,
    }),
  component: WomensHealthPage,
});
