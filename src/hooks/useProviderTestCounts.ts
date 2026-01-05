/**
 * Hook for fetching test counts by provider
 * Used to show how many tests are available at each clinic
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProviderTestCount {
  provider_id: string;
  count: number;
}

async function fetchProviderTestCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("provider_tests")
    .select("provider_id")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching provider test counts:", error);
    return {};
  }

  // Count tests per provider
  const counts: Record<string, number> = {};
  data?.forEach((row) => {
    const providerId = row.provider_id?.toLowerCase() || "";
    counts[providerId] = (counts[providerId] || 0) + 1;
  });

  return counts;
}

export function useProviderTestCounts() {
  return useQuery({
    queryKey: ["provider-test-counts"],
    queryFn: fetchProviderTestCounts,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Get test count for a specific provider ID
 * Handles variations in provider ID naming
 */
export function getTestCountForProvider(
  counts: Record<string, number>,
  providerId: string | null
): number {
  if (!providerId || !counts) return 0;
  
  const normalizedId = providerId.toLowerCase().replace(/[-_\s]/g, '');
  
  // Try exact match first
  if (counts[providerId.toLowerCase()]) {
    return counts[providerId.toLowerCase()];
  }
  
  // Try normalized match
  for (const [key, count] of Object.entries(counts)) {
    const normalizedKey = key.replace(/[-_\s]/g, '');
    if (normalizedKey.includes(normalizedId) || normalizedId.includes(normalizedKey)) {
      return count;
    }
  }
  
  return 0;
}
