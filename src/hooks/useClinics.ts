import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Clinic {
  id?: string;
  name: string;
  full_address?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  provider_id?: string;
  access_note?: string;
  distance?: number;
}

export function useClinics() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClinics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data && data.length) {
        const normalized = data.map(clinic => ({
          id: clinic.id,
          name: clinic.name || 'Clinic',
          full_address: clinic.full_address || '',
          postal_code: clinic.postal_code || '',
          latitude: typeof clinic.latitude === 'number' ? clinic.latitude : 
                   clinic.latitude ? Number(clinic.latitude) : undefined,
          longitude: typeof clinic.longitude === 'number' ? clinic.longitude : 
                    clinic.longitude ? Number(clinic.longitude) : undefined,
          provider_id: clinic.provider_id || 'unknown',
          access_note: clinic.access_note || ''
        }));
        setClinics(normalized);
        return;
      }

      // Fallback to local JSON if no Supabase data
      const res = await fetch('/clinics_master.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('No clinic data available');
      
      const localData: Clinic[] = await res.json();
      const normalized = (Array.isArray(localData) ? localData : []).map(clinic => ({
        name: clinic.name || 'Clinic',
        full_address: clinic.full_address || '',
        postal_code: clinic.postal_code || '',
        latitude: typeof clinic.latitude === 'number' ? clinic.latitude : undefined,
        longitude: typeof clinic.longitude === 'number' ? clinic.longitude : undefined,
        provider_id: 'unknown',
        access_note: clinic.access_note || ''
      }));
      setClinics(normalized);
      
    } catch (e: any) {
      setError(e?.message || 'Failed to load clinic data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinics();
  }, []);

  return { clinics, loading, error, refetch: loadClinics };
}