/**
 * Fetches the heavy prose fields (provider description, biomarker list,
 * collection options) for a small set of tests that are actually rendered.
 *
 * Pool queries deliberately omit these columns — a few hundred provider
 * descriptions is close to a megabyte of payload for a handful of visible
 * cards.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export interface TestDetails {
  description: string | null;
  biomarkersList: unknown;
  collectionOptions: unknown;
}

export type TestDetailsMap = Record<string, TestDetails>;

export function useTestDetailsByIds(ids: readonly string[]): TestDetailsMap {
  const sortedIds = [...ids].filter(Boolean).sort();

  const { data } = useQuery({
    queryKey: ["test-details", sortedIds],
    enabled: sortedIds.length > 0,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    queryFn: async (): Promise<TestDetailsMap> => {
      const { data: rows, error } = await supabase
        .from("provider_tests")
        .select("id, description, biomarkers_list, collection_options")
        .in("id", sortedIds);

      if (error) {
        logger.error("Error fetching test details:", error);
        return {};
      }

      const map: TestDetailsMap = {};
      for (const row of rows ?? []) {
        map[row.id] = {
          description: typeof row.description === "string" ? row.description : null,
          biomarkersList: row.biomarkers_list ?? null,
          collectionOptions: row.collection_options ?? null,
        };
      }
      return map;
    },
  });

  return data ?? {};
}
