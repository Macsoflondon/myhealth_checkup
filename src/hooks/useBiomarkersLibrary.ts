import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BiomarkerDefinition {
  id: string;
  biomarker_name: string;
  biomarker_code: string;
  description: string;
  category: string;
  unit_of_measurement: string | null;
  normal_range_male: string | null;
  normal_range_female: string | null;
  clinical_significance: string | null;
  interpretation_guide: unknown;
  lifestyle_factors: string[] | null;
  related_conditions: string[] | null;
}

interface UseBiomarkersLibraryReturn {
  biomarkers: BiomarkerDefinition[];
  isLoading: boolean;
  error: string | null;
  getBiomarkerInfo: (name: string) => BiomarkerDefinition | undefined;
  searchBiomarkers: (query: string) => BiomarkerDefinition[];
  categories: string[];
  getBiomarkersByCategory: (category: string) => BiomarkerDefinition[];
}

export const BIOMARKERS_LIBRARY_QUERY_KEY = ["biomarkers-library"] as const;

const EMPTY: BiomarkerDefinition[] = [];

async function fetchBiomarkersLibrary(): Promise<BiomarkerDefinition[]> {
  const { data, error } = await supabase
    .from("biomarkers_library")
    .select(
      "id, biomarker_name, biomarker_code, description, category, unit_of_measurement, normal_range_male, normal_range_female, clinical_significance, interpretation_guide, lifestyle_factors, related_conditions",
    )
    .order("biomarker_name", { ascending: true });

  if (error) throw error;
  return (data ?? []).flatMap((item): BiomarkerDefinition[] => {
    if (!item.id || !item.biomarker_name || !item.biomarker_code) return [];
    return [
      {
        id: item.id,
        biomarker_name: item.biomarker_name,
        biomarker_code: item.biomarker_code,
        description: item.description ?? "",
        category: item.category ?? "Uncategorised",
        unit_of_measurement: item.unit_of_measurement,
        normal_range_male: item.normal_range_male,
        normal_range_female: item.normal_range_female,
        clinical_significance: item.clinical_significance,
        interpretation_guide: item.interpretation_guide,
        lifestyle_factors: Array.isArray(item.lifestyle_factors)
          ? item.lifestyle_factors.filter(
              (value): value is string => typeof value === "string",
            )
          : null,
        related_conditions: Array.isArray(item.related_conditions)
          ? item.related_conditions.filter(
              (value): value is string => typeof value === "string",
            )
          : null,
      },
    ];
  });
}

export function useBiomarkersLibrary(): UseBiomarkersLibraryReturn {
  const query = useQuery({
    queryKey: BIOMARKERS_LIBRARY_QUERY_KEY,
    queryFn: fetchBiomarkersLibrary,
    staleTime: 10 * 60 * 1000,
  });

  const biomarkers = query.data ?? EMPTY;
  const error = query.error
    ? query.error instanceof Error
      ? query.error.message
      : "Failed to load biomarkers"
    : null;

  // First entry wins, matching the previous Array.find order.
  const lookup = useMemo(() => {
    const map = new Map<string, BiomarkerDefinition>();
    for (const b of biomarkers) {
      const name = b.biomarker_name.toLowerCase();
      const code = b.biomarker_code.toLowerCase();
      if (!map.has(name)) map.set(name, b);
      if (!map.has(code)) map.set(code, b);
    }
    return map;
  }, [biomarkers]);

  const getBiomarkerInfo = useCallback(
    (name: string): BiomarkerDefinition | undefined =>
      lookup.get(name.toLowerCase().trim()),
    [lookup],
  );

  const searchBiomarkers = useCallback(
    (search: string): BiomarkerDefinition[] => {
      if (!search.trim()) return biomarkers.slice(0, 20);
      const q = search.toLowerCase().trim();
      return biomarkers
        .filter(
          (b) =>
            b.biomarker_name.toLowerCase().includes(q) ||
            b.biomarker_code.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q),
        )
        .slice(0, 20);
    },
    [biomarkers],
  );

  const categories = useMemo(
    () => [...new Set(biomarkers.map((b) => b.category))].sort(),
    [biomarkers],
  );

  const getBiomarkersByCategory = useCallback(
    (category: string): BiomarkerDefinition[] =>
      biomarkers.filter(
        (b) => b.category.toLowerCase() === category.toLowerCase(),
      ),
    [biomarkers],
  );

  return {
    biomarkers,
    isLoading: query.isPending,
    error,
    getBiomarkerInfo,
    searchBiomarkers,
    categories,
    getBiomarkersByCategory,
  };
}
