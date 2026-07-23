import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LiveComparisonPanelData } from "@/components/sections/LiveComparisonCard";

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  medichecks: "Medichecks",
  thriva: "Thriva",
  randox: "Randox Health",
  "goodbody-clinic": "Goodbody Health",
  "lola-health": "Lola Health",
  "london-medical-laboratory": "London Medical Lab",
  "london-health-company": "London Health Co",
  "medical-diagnosis": "Medical Diagnosis",
  clinilabs: "Clinilabs",
};

interface CategoryConfig {
  canonical: string;
  displayName: string;
  methodLabel: string;
}

const COMPARISON_CATEGORIES: CategoryConfig[] = [
  { canonical: "fbc", displayName: "Full Blood Count", methodLabel: "At-home test kit" },
  { canonical: "thyroid", displayName: "Thyroid Function", methodLabel: "At-home test kit" },
  { canonical: "male_hormones", displayName: "Male Hormone Panel", methodLabel: "At-home test kit" },
  { canonical: "female_hormones", displayName: "Female Hormone Panel", methodLabel: "At-home test kit" },
];

export function useDynamicComparisonPanels(): {
  panels: LiveComparisonPanelData[];
  loading: boolean;
} {
  const [panels, setPanels] = useState<LiveComparisonPanelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPanels() {
      const results: LiveComparisonPanelData[] = [];

      for (const cat of COMPARISON_CATEGORIES) {
        const { data } = await supabase
          .from("provider_tests")
          .select("provider_id, test_name, price, scraped_at")
          .eq("canonical_category", cat.canonical)
          .eq("is_active", true)
          .not("price", "is", null)
          .gt("price", 0)
          .order("price", { ascending: true });

        if (cancelled) return;
        if (!data?.length) continue;

        const providerMap = new Map<string, { price: number; scrapedAt: string }>();
        for (const row of data) {
          const pid = row.provider_id;
          const price = parseFloat(String(row.price));
          if (isNaN(price) || price <= 0) continue;
          if (!providerMap.has(pid) || price < providerMap.get(pid)!.price) {
            providerMap.set(pid, { price, scrapedAt: row.scraped_at });
          }
        }

        const sorted = [...providerMap.entries()]
          .sort((a, b) => a[1].price - b[1].price)
          .slice(0, 8);

        if (sorted.length < 2) continue;

        const latestScrape = sorted.reduce(
          (latest, [, v]) => (v.scrapedAt > latest ? v.scrapedAt : latest),
          sorted[0][1].scrapedAt
        );

        results.push({
          name: cat.displayName,
          collectionMethod: "at_home",
          methodLabel: cat.methodLabel,
          lastScrapedAt: latestScrape,
          providers: sorted.map(([pid, { price }]) => ({
            name: PROVIDER_DISPLAY_NAMES[pid] || pid,
            options: [{ label: cat.methodLabel, price: `\u00a3${Math.round(price)}` }],
          })),
        });
      }

      if (!cancelled) {
        setPanels(results);
        setLoading(false);
      }
    }

    fetchPanels();
    return () => { cancelled = true; };
  }, []);

  return { panels, loading };
}
