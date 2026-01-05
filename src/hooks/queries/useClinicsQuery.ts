import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from '@/types';

export const CLINICS_QUERY_KEY = ['clinics'];

export function useClinicsQuery() {
  return useQuery({
    queryKey: CLINICS_QUERY_KEY,
    queryFn: async (): Promise<Clinic[]> => {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}
