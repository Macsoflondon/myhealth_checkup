import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LiveComparisonPanelData } from "@/components/sections/LiveComparisonCard";
import { PROVIDER_NAMES } from "@/constants/providers";

interface CategoryConfig {
  canonical: string;
  /** Slug used by the "Compare all providers" CTA (see COMPARE_PANELS). */
  panelSlug: string;
  displayName: string;
  methodLabel: string;
}

const COMPARISON_CATEGORIES: CategoryConfig[] = [
  { canonical: "fbc", panelSlug: "full-blood-count", displayName: "Full Blood Count", methodLabel: "At-home test kit" },
  { canonical: "thyroid", panelSlug: "thyroid", displayName: "Thyroid Function", methodLabel: "At-home test kit" },
  { canonical: "male_hormones", panelSlug: "male-hormones", displayName: "Male Hormone Panel", methodLabel: "At-home test kit" },
  { canonical: "female_hormones", panelSlug: "female-hormones", displayName: "Female Hormone Panel", methodLabel: "At-home test kit" },
];

/** Providers that must never appear in comparison output. */
const EXCLUDED_PROVIDER_IDS = new Set<string>(["thriva"]);

export const dynamicComparisonPanelsQueryKey = ["homepage", "dynamic-comparison-panels"] as const;

async function fetchCategoryPanel(cat: CategoryConfig): Promise<LiveComparisonPanelData | null> {
  const { data } = await supabase
    .from("provider_tests")
    .select("provider_id, price, scraped_at")
    .eq("canonical_category", cat.canonical)
    .eq("is_active", true)
    .not("price", "is", null)
    .gt("price", 0)
    .order("price", { ascending: true });

  if (!data?.length) return null;

  const providerMap = new Map<string, { price: number; scrapedAt: string }>();
  for (const row of data) {
    const pid = row.provider_id;
    if (EXCLUDED_PROVIDER_IDS.has(pid)) continue;
    const price = parseFloat(String(row.price));
    if (isNaN(price) || price <= 0) continue;
    if (!providerMap.has(pid) || price < providerMap.get(pid)!.price) {
      providerMap.set(pid, { price, scrapedAt: row.scraped_at });
    }
  }

  const sorted = [...providerMap.entries()]
    .sort((a, b) => a[1].price - b[1].price)
    .slice(0, 8);

  if (sorted.length < 2) return null;

  const latestScrape = sorted.reduce(
    (latest, [, v]) => (v.scrapedAt > latest ? v.scrapedAt : latest),
    sorted[0][1].scrapedAt,
  );

  return {
    name: cat.displayName,
    canonical: cat.panelSlug,
    collectionMethod: "at_home",
    methodLabel: cat.methodLabel,
    lastScrapedAt: latestScrape,
    providers: sorted.map(([pid, { price }]) => ({
      name: PROVIDER_NAMES[pid] || pid,
      options: [{ label: cat.methodLabel, price: `\u00a3${Math.round(price)}` }],
    })),
  };
}

/**
 * Live price panels for the homepage.
 *
 * Shared through React Query so the three components that render comparison
 * cards resolve one cached result instead of each firing its own serial
 * waterfall of category queries.
 */
export function useDynamicComparisonPanels(enabled = true): {
  panels: LiveComparisonPanelData[];
  loading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: dynamicComparisonPanelsQueryKey,
    enabled,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    queryFn: async (): Promise<LiveComparisonPanelData[]> => {
      const settled = await Promise.all(COMPARISON_CATEGORIES.map(fetchCategoryPanel));
      return settled.filter((panel): panel is LiveComparisonPanelData => panel !== null);
    },
  });

  return { panels: data ?? [], loading: enabled && isLoading };
}
