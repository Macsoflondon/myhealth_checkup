/**
 * Clinic filtering utilities
 */

import { Clinic, ClinicWithDistance } from '@/types';
import { calculateDistance } from './distanceCalculator';

/**
 * Filter clinics that offer at-home testing kits
 */
export function filterAtHomeKitsClinics(clinics: Clinic[]): Clinic[] {
  return clinics.filter((clinic) => {
    const providerId = clinic.provider_id?.toLowerCase() || '';
    const accessNote = clinic.access_note?.toLowerCase() || '';
    
    return (
      providerId.includes('thriva') ||
      providerId.includes('medichecks') ||
      providerId.includes('randox') ||
      accessNote.includes('home') ||
      accessNote.includes('kit')
    );
  });
}

/**
 * Add distance calculations to clinics based on center point
 */
export function addDistanceToClinics(
  clinics: Clinic[],
  centerLat: number,
  centerLon: number
): ClinicWithDistance[] {
  return clinics.map((clinic) => ({
    ...clinic,
    distance: calculateDistance(centerLat, centerLon, clinic.latitude, clinic.longitude),
  }));
}

/**
 * Filter clinics within a given radius
 */
export function filterClinicsByRadius(
  clinics: ClinicWithDistance[],
  radiusMiles: number
): ClinicWithDistance[] {
  return clinics.filter((clinic) => (clinic.distance || 0) <= radiusMiles);
}

/**
 * Sort clinics by distance (nearest first)
 */
export function sortClinicsByDistance(
  clinics: ClinicWithDistance[]
): ClinicWithDistance[] {
  return [...clinics].sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Complete filtering pipeline for clinics
 */
export function filterAndSortClinics(
  clinics: Clinic[],
  centerLat: number,
  centerLon: number,
  radiusMiles: number,
  atHomeOnly: boolean
): ClinicWithDistance[] {
  // Step 1: Filter for at-home kits if needed
  const filtered = atHomeOnly ? filterAtHomeKitsClinics(clinics) : clinics;
  
  // Step 2: Add distance calculations
  const withDistance = addDistanceToClinics(filtered, centerLat, centerLon);
  
  // Step 3: Filter by radius
  const withinRadius = filterClinicsByRadius(withDistance, radiusMiles);
  
  // Step 4: Sort by distance
  return sortClinicsByDistance(withinRadius);
}
