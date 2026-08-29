import { useState, useEffect, useCallback } from "react";
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

export function useBiomarkersLibrary(): UseBiomarkersLibraryReturn {
  const [biomarkers, setBiomarkers] = useState<BiomarkerDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBiomarkers() {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from("biomarkers_library")
          .select("id, biomarker_name, biomarker_code, description, category, unit_of_measurement, normal_range_male, normal_range_female, clinical_significance, interpretation_guide, lifestyle_factors, related_conditions")
          .order("biomarker_name", { ascending: true });

        if (fetchError) throw fetchError;
        const validBiomarkers = (data ?? []).flatMap((item): BiomarkerDefinition[] => {
          if (!item.id || !item.biomarker_name || !item.biomarker_code) return [];
          return [{
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
              ? item.lifestyle_factors.filter((value): value is string => typeof value === "string")
              : null,
            related_conditions: Array.isArray(item.related_conditions)
              ? item.related_conditions.filter((value): value is string => typeof value === "string")
              : null,
          }];
        });
        setBiomarkers(validBiomarkers);
      } catch (err) {
        console.error("Failed to fetch biomarkers library:", err);
        setError(err instanceof Error ? err.message : "Failed to load biomarkers");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBiomarkers();
  }, []);

  const getBiomarkerInfo = useCallback((name: string): BiomarkerDefinition | undefined => {
    const normalizedName = name.toLowerCase().trim();
    return biomarkers.find(
      b => b.biomarker_name.toLowerCase() === normalizedName ||
           b.biomarker_code.toLowerCase() === normalizedName
    );
  }, [biomarkers]);

  const searchBiomarkers = useCallback((query: string): BiomarkerDefinition[] => {
    if (!query.trim()) return biomarkers.slice(0, 20);
    
    const normalizedQuery = query.toLowerCase().trim();
    return biomarkers.filter(b =>
      b.biomarker_name.toLowerCase().includes(normalizedQuery) ||
      b.biomarker_code.toLowerCase().includes(normalizedQuery) ||
      b.description.toLowerCase().includes(normalizedQuery) ||
      b.category.toLowerCase().includes(normalizedQuery)
    ).slice(0, 20);
  }, [biomarkers]);

  const categories = [...new Set(biomarkers.map(b => b.category))].sort();

  const getBiomarkersByCategory = useCallback((category: string): BiomarkerDefinition[] => {
    return biomarkers.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }, [biomarkers]);

  return {
    biomarkers,
    isLoading,
    error,
    getBiomarkerInfo,
    searchBiomarkers,
    categories,
    getBiomarkersByCategory
  };
}
