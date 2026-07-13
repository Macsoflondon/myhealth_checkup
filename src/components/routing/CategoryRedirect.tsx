import { Navigate, useParams } from "react-router-dom";

/**
 * Maps /category/:slug legacy/SEO URLs to the canonical route for that category.
 * Unknown slugs fall back to the compare page rather than 404.
 */
const SLUG_TO_ROUTE: Record<string, string> = {
  "mens-health": "/tests/mens-health",
  "womens-health": "/tests/womens-health",
  "heart": "/tests/heart",
  "heart-health": "/tests/heart",
  "diabetes": "/tests/diabetes",
  "vitamins": "/tests/vitamins",
  "vitamins-minerals": "/tests/vitamins",
  "gut": "/tests/gut",
  "gut-health": "/tests/gut",
  "cancer": "/tests/cancer",
  "cancer-screening": "/tests/cancer",
  "thyroid": "/thyroid",
  "hormones": "/hormones",
  "wellness": "/wellness",
  "sports-performance": "/sports-performance",
  "fertility": "/fertility-tests",
  "at-home": "/at-home-tests",
  "popular": "/popular-tests",
  "general-health": "/test/general-health",
  "male-hormones": "/test/male-hormones",
  "female-hormones": "/test/female-hormones",
  "vitamin-d": "/test/vitamin-d",
  "iron-profile": "/test/iron-profile",
  "lipid-profile": "/test/lipid-profile",
  "well-woman": "/test/well-woman",
};

export default function CategoryRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const key = (slug ?? "").toLowerCase();
  const target = SLUG_TO_ROUTE[key] ?? "/compare";
  return <Navigate to={target} replace />;
}
