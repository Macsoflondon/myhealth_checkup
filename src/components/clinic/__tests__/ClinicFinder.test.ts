import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ClinicFinder utility function tests
 * 
 * The ClinicFinder component is complex with map rendering (Leaflet),
 * Supabase data fetching, and geolocation. We test the pure utility
 * function (Haversine distance) and document expected component behaviors.
 */

// Extract and test the Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

describe('ClinicFinder: Haversine Distance Calculation', () => {
  it('returns 0 for identical coordinates', () => {
    const distance = calculateDistance(51.5074, -0.1278, 51.5074, -0.1278);
    expect(distance).toBe(0);
  });

  it('calculates London to Manchester distance correctly (~260km)', () => {
    const distance = calculateDistance(51.5074, -0.1278, 53.4808, -2.2426);
    expect(distance).toBeGreaterThan(250);
    expect(distance).toBeLessThan(270);
  });

  it('calculates London to Edinburgh distance correctly (~530km)', () => {
    const distance = calculateDistance(51.5074, -0.1278, 55.9533, -3.1883);
    expect(distance).toBeGreaterThan(520);
    expect(distance).toBeLessThan(540);
  });

  it('calculates short distance correctly (~1km)', () => {
    // Two points roughly 1km apart in central London
    const distance = calculateDistance(51.5074, -0.1278, 51.5164, -0.1278);
    expect(distance).toBeGreaterThan(0.9);
    expect(distance).toBeLessThan(1.1);
  });

  it('is symmetric (distance A→B equals B→A)', () => {
    const d1 = calculateDistance(51.5074, -0.1278, 53.4808, -2.2426);
    const d2 = calculateDistance(53.4808, -2.2426, 51.5074, -0.1278);
    expect(Math.abs(d1 - d2)).toBeLessThan(0.001);
  });

  it('handles negative longitude correctly', () => {
    const distance = calculateDistance(51.5074, -0.1278, 51.5074, 0.1278);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(20); // ~17km
  });
});

describe('ClinicFinder: Filter Logic', () => {
  interface MockClinic {
    name: string;
    provider_id: string;
    latitude: number;
    longitude: number;
    distance?: number;
  }

  const mockClinics: MockClinic[] = [
    { name: 'Randox London', provider_id: 'randox', latitude: 51.5074, longitude: -0.1278 },
    { name: 'Medichecks Birmingham', provider_id: 'medichecks', latitude: 52.4862, longitude: -1.8904 },
    { name: 'Randox Manchester', provider_id: 'randox', latitude: 53.4808, longitude: -2.2426 },
  ];

  function applyFilters(
    clinics: MockClinic[],
    userLocation: [number, number] | null,
    radiusFilter: string,
    providerFilter: string
  ): MockClinic[] {
    let filtered = [...clinics];

    if (userLocation) {
      filtered = filtered.map(clinic => ({
        ...clinic,
        distance: calculateDistance(userLocation[0], userLocation[1], clinic.latitude, clinic.longitude)
      }));

      if (radiusFilter !== 'all') {
        const maxDistance = parseInt(radiusFilter);
        filtered = filtered.filter(clinic => (clinic.distance || 999) <= maxDistance);
      }

      filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (providerFilter !== 'all') {
      filtered = filtered.filter(clinic =>
        clinic.provider_id?.toLowerCase().includes(providerFilter.toLowerCase())
      );
    }

    return filtered;
  }

  it('returns all clinics sorted alphabetically when no filters applied', () => {
    const result = applyFilters(mockClinics, null, 'all', 'all');
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Medichecks Birmingham');
    expect(result[1].name).toBe('Randox London');
    expect(result[2].name).toBe('Randox Manchester');
  });

  it('filters by provider', () => {
    const result = applyFilters(mockClinics, null, 'all', 'randox');
    expect(result).toHaveLength(2);
    expect(result.every(c => c.provider_id === 'randox')).toBe(true);
  });

  it('sorts by distance when user location is set', () => {
    // User in London
    const result = applyFilters(mockClinics, [51.5074, -0.1278], 'all', 'all');
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Randox London');
    expect(result[0].distance).toBeLessThan(1);
  });

  it('filters by radius when user location is set', () => {
    // User in London, 50km radius should only include London clinic
    const result = applyFilters(mockClinics, [51.5074, -0.1278], '50', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Randox London');
  });

  it('combines radius and provider filters', () => {
    // User in London, 300km radius, randox only
    const result = applyFilters(mockClinics, [51.5074, -0.1278], '300', 'randox');
    expect(result).toHaveLength(2);
    expect(result.every(c => c.provider_id === 'randox')).toBe(true);
  });

  it('returns empty when no clinics match filters', () => {
    const result = applyFilters(mockClinics, [51.5074, -0.1278], '1', 'medichecks');
    expect(result).toHaveLength(0);
  });
});
