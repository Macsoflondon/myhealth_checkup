/**
 * Hook for fetching tests available at a specific clinic
 * based on the clinic's provider_id
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClinicTest {
  id: string;
  test_name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  url: string | null;
}

async function fetchClinicTests(providerId: string | null): Promise<ClinicTest[]> {
  if (!providerId) return [];

  // Normalize provider ID for matching
  const normalizedId = providerId.toLowerCase().replace(/[-_\s]/g, '');
  
  const { data, error } = await supabase
    .from("provider_tests")
    .select("id, test_name, description, price, category, url")
    .eq("is_active", true)
    .or(`provider_id.ilike.%${normalizedId}%,provider_id.ilike.%${providerId}%`)
    .order("category", { ascending: true })
    .order("test_name", { ascending: true })
    .limit(50);

  if (error) {
    console.error("Error fetching clinic tests:", error);
    return [];
  }

  return data || [];
}

export function useClinicTests(providerId: string | null) {
  return useQuery({
    queryKey: ["clinic-tests", providerId],
    queryFn: () => fetchClinicTests(providerId),
    enabled: !!providerId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
