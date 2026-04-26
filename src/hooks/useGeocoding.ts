/**
 * Hook for geocoding postcodes using Nominatim API
 */

import { useState, useCallback } from 'react';

export interface GeocodeResult {
  lat: number;
  lon: number;
}

export function useGeocoding() {
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodePostcode = useCallback(async (postcode: string): Promise<GeocodeResult | null> => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return null;
    }

    setSearching(true);
    setError(null);

    try {
      const formattedPostcode = postcode.trim().replace(/\s+/g, '+');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${formattedPostcode},UK&limit=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('Postcode not found. Please check and try again.');
        return null;
      }

      const { lat, lon } = data[0];
      setError(null);
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (err) {
      console.error('Error geocoding postcode:', err);
      setError('Unable to search postcode. Please try again.');
      return null;
    } finally {
      setSearching(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    geocodePostcode,
    searching,
    error,
    clearError,
  };
}
