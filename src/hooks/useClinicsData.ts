/**
 * Hook for fetching and managing clinics data
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from '@/types';

export function useClinicsData() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('clinics')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (fetchError) throw fetchError;
      
      setClinics(data || []);
    } catch (err) {
      console.error('Error loading clinics:', err);
      setError('Failed to load clinics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadClinics();
  };

  return {
    clinics,
    loading,
    error,
    refetch,
  };
}
