import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HeroAdMeta {
  markers: string[];
  biomarkerCount: number | null;
  turnaround: string | null;
}

export function useHeroAdBiomarkers(urls: string[]) {
  const key = [...urls].sort();
  return useQuery({
    queryKey: ["hero-ad-biomarkers", key],
    enabled: urls.length > 0,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<Map<string, HeroAdMeta>> => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("url, biomarker_count, biomarkers_list, turnaround_days_text")
        .in("url", urls);
      const map = new Map<string, HeroAdMeta>();
      if (error || !data) return map;
      for (const row of data as Array<{
        url: string | null;
        biomarker_count: number | null;
        biomarkers_list: unknown;
        turnaround_days_text: string | null;
      }>) {
        if (!row.url) continue;
        const markers = Array.isArray(row.biomarkers_list)
          ? row.biomarkers_list
              .map((x) => (typeof x === "string" ? x : ""))
              .filter(Boolean)
              .slice(0, 4)
          : [];
        map.set(row.url, {
          markers,
          biomarkerCount: row.biomarker_count ?? null,
          turnaround: row.turnaround_days_text ?? null,
        });
      }
      return map;
    },
  });
}
