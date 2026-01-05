/**
 * Hook for getting user's geolocation
 */

import { useState, useCallback } from 'react';
import { MAP_CONFIG } from '@/constants/config';

export function useUserLocation() {
  const [location, setLocation] = useState<[number, number]>(MAP_CONFIG.DEFAULT_CENTER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        setLoading(false);
      },
      (err) => {
        console.log('Geolocation error:', err);
        setError('Unable to get your location');
        setLocation(MAP_CONFIG.DEFAULT_CENTER); // Fallback to London
        setLoading(false);
      }
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setLocation(MAP_CONFIG.DEFAULT_CENTER);
    setError(null);
  }, []);

  return {
    location,
    loading,
    error,
    requestGeolocation,
    resetToDefault,
  };
}
