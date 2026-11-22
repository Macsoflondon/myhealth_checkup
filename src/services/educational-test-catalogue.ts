import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  describeBiomarkers,
  displayTurnaround,
  parseCollection,
} from "@/lib/resolve-test-fields";
import {
  trackedClickHref,
  verifiedProviderUrl,
} from "@/lib/affiliate/click-redirect";
import { getProviderDisplayName } from "@/utils/providerRoutes";

export type EducationalPanel =
  | "general-health"
  | "male-hormones"
  | "female-hormones"
  | "well-woman"
  | "iron-profile"
  | "vitamin-d"
  | "lipid-profile";
export type CatalogueRow =
  Database["public"]["Views"]["unified_provider_tests"]["Row"];

export interface EducationalProvider {
  id: string;
  name: string;
  testName: string;
  price: number | null;
  testPrice: number | null;
  turnaround: string;
  biomarkers: number | null;
  biomarkerNames: string[];
  collection: string;
  locations: string;
  checkedAt: string | null;
  collectionFee: string;
  reviewFee: string;
  bookingUrl: string;
}

export function catalogueMarkerNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry: unknown) => {
    if (typeof entry === "string") return [entry];
    if (
      entry &&
      typeof entry === "object" &&
      "value" in entry &&
      typeof entry.value === "string"
    )
      return [entry.value];
    return [];
  });
}

export function matchesEducationalPanel(
  row: Pick<CatalogueRow, "test_name" | "category_primary" | "biomarkers_list">,
  panel: EducationalPanel,
): boolean {
  const name = (row.test_name ?? "").toLowerCase().replace(/[’']/g, "");
  const category = (row.category_primary ?? "").toLowerCase();
  const markers = catalogueMarkerNames(row.biomarkers_list);
  switch (panel) {
    case "general-health":
      return (
        /general[- ]health|full[- ]body|wellness|wellbeing|well[- ](?:man|woman)/.test(
          name,
        ) ||
        (!/liver|kidney|thyroid|iron|cholesterol|diabetes|vitamin|hormone|allergy/.test(
          name,
        ) &&
          (/health[- ](?:check|panel|profile)/.test(name) ||
            /general-health|general wellness/.test(category)))
      );
    case "male-hormones":
      return (
        /(?:male|mens?|testosterone).*hormone|hormone.*(?:male|mens?)/.test(
          name,
        ) &&
        !/female|women/.test(name) &&
        markers.some((marker) => /testosterone/i.test(marker))
      );
    case "female-hormones":
    case "well-woman":
      return /(?:female|womens?).*hormone|hormone.*(?:female|womens?)|well[- ]woman/.test(
        name,
      );
    case "iron-profile":
      return (
        markers.some((marker) => /\bferritin\b/i.test(marker)) &&
        markers.some((marker) =>
          /^(?:serum\s+)?iron(?:\s*\([^)]*\))?$/i.test(marker.trim()),
        )
      );
    case "vitamin-d":
      return markers.some((marker) =>
        /vitamin\s*d\b|25[-\s]*(?:oh|hydroxy)|25[-\s]*hydroxyvitamin/i.test(
          marker,
        ),
      );
    case "lipid-profile":
      return /cholesterol|lipid/.test(name);
  }
}

export function formatCatalogueMoney(value: number | null): string {
  return value === null
    ? "Not stated"
    : new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(value);
}

export function selectEducationalProviders(
  rows: CatalogueRow[],
  panel: EducationalPanel,
): EducationalProvider[] {
  const unique = [...new Map(rows.map((row) => [row.id, row])).values()];
  return unique
    .flatMap((row) => {
      if (
        !row.id ||
        !row.provider_id ||
        !row.test_name ||
        row.is_addon ||
        !matchesEducationalPanel(row, panel)
      )
        return [];
      const destination = verifiedProviderUrl(row.url, row.provider_id);
      // Catalogue product links only: homepages and category links are not bookings.
      if (
        !destination ||
        /^(?:\/|\/en-gb\/?|\/products?\/?|\/collections?\/?|\/product-category(?:\/.*)?)$/i.test(
          destination.pathname,
        )
      )
        return [];
      const amount = row.collection_fee_amount;
      const collectionFee =
        row.collection_fee_type === "none"
          ? "Included"
          : amount !== null
            ? `${row.collection_fee_type === "from" ? "From " : ""}${formatCatalogueMoney(amount)}`
            : row.collection_fee_note || "Not stated";
      return [
        {
          id: row.id,
          name: getProviderDisplayName(row.provider_id),
          testName: row.test_name,
          price: row.total_expected_cost,
          testPrice: row.price,
          turnaround:
            displayTurnaround(row.turnaround_days_text) ?? "Not stated",
          biomarkers: describeBiomarkers(row).count,
          biomarkerNames: catalogueMarkerNames(row.biomarkers_list),
          collection:
            row.collection_method || row.sample_type
              ? parseCollection(row.collection_method || row.sample_type || "")
                  .label
              : "Not stated",
          locations:
            Array.isArray(row.location_options) && row.location_options.length
              ? row.location_options
                  .filter((v): v is string => typeof v === "string")
                  .join(", ") || "Not stated"
              : [
                  row.home_kit_available ? "At home" : "",
                  row.clinic_visit_available ? "Clinic" : "",
                ]
                  .filter(Boolean)
                  .join(" / ") || "Not stated",
          checkedAt: row.price_checked_at ?? row.updated_at,
          collectionFee,
          reviewFee:
            row.clinical_review_fee === 0
              ? "Included"
              : formatCatalogueMoney(row.clinical_review_fee),
          bookingUrl: trackedClickHref(row.id, "comparison", `/test/${panel}`),
        },
      ];
    })
    .sort(
      (a, b) =>
        (a.price ?? Infinity) - (b.price ?? Infinity) ||
        a.testName.localeCompare(b.testName),
    );
}

export const educationalCatalogueQuery = queryOptions({
  queryKey: ["educational-test-catalogue"],
  queryFn: async (): Promise<CatalogueRow[]> => {
    const { data, error } = await supabase
      .from("unified_provider_tests")
      .select(
        "id,provider_id,test_name,category_primary,biomarkers_list,biomarker_count,total_expected_cost,price,turnaround_days_text,collection_method,sample_type,location_options,clinic_visit_available,home_kit_available,collection_fee_amount,collection_fee_type,collection_fee_note,clinical_review_fee,price_checked_at,updated_at,url,is_addon",
      )
      .limit(2000);
    if (error) throw error;
    // Projected public fields are sufficient; unused view fields are not required by selectors.
    return (data ?? []) as CatalogueRow[];
  },
  staleTime: 5 * 60 * 1000,
});

export function resolveSimilarCategory(
  canonicalCategory?: string | null,
  categoryIds?: string[] | null,
): string | null {
  return (
    canonicalCategory?.trim() ||
    categoryIds?.find((category) => category.trim())?.trim() ||
    null
  );
}

export async function getSimilarCatalogueTests(
  category: string | null,
  currentName?: string,
  currentProvider?: string,
): Promise<CatalogueRow[]> {
  if (!category) return [];
  const { data, error } = await supabase
    .from("unified_provider_tests")
    .select("*")
    .eq("category_primary", category)
    .order("total_expected_cost", { ascending: true })
    .limit(100);
  if (error) throw error;
  return [...new Map((data ?? []).map((row) => [row.id, row])).values()]
    .filter(
      (row) =>
        row.id &&
        row.provider_id !== currentProvider &&
        row.test_name?.toLowerCase() !== currentName?.toLowerCase(),
    )
    .slice(0, 3);
}
