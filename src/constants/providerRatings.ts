/**
 * Single source of truth for provider Trustpilot ratings and review counts.
 * Updated: April 2026
 */

export interface ProviderRating {
  rating: number;
  reviews: number;
  reviewsFormatted: string;
}

export const PROVIDER_RATINGS: Record<string, ProviderRating> = {
  'medichecks': { rating: 4.7, reviews: 14000, reviewsFormatted: '14,000+' },
  'goodbody-clinic': { rating: 4.8, reviews: 3600, reviewsFormatted: '3,600+' },
  'thriva': { rating: 4.5, reviews: 3006, reviewsFormatted: '3,000+' },
  'randox': { rating: 4.7, reviews: 28456, reviewsFormatted: '28,400+' },
  'london-medical-laboratory': { rating: 4.1, reviews: 3266, reviewsFormatted: '3,266' },
  'lola-health': { rating: 4.6, reviews: 159, reviewsFormatted: '155+' },
  'onedaytests': { rating: 4.8, reviews: 4021, reviewsFormatted: '4,000+' },
};

const DEFAULT_RATING: ProviderRating = { rating: 4.5, reviews: 100, reviewsFormatted: '100' };

/** Aliases that map alternative IDs to canonical keys */
const PROVIDER_ALIASES: Record<string, string> = {
  'goodbody': 'goodbody-clinic',
  'randox-health': 'randox',
  'the-doctors-laboratory': 'london-medical-laboratory',
};

/** Name-to-ID mapping for lookups by display name */
const PROVIDER_NAME_MAP: Record<string, string> = {
  'Medichecks': 'medichecks',
  'GoodBody Clinic': 'goodbody-clinic',
  'Thriva': 'thriva',
  'Randox Health': 'randox',
  'London Medical Laboratory': 'london-medical-laboratory',
  'Lola Health': 'lola-health',
  'OneDayTests': 'onedaytests',
};

/**
 * Get provider rating by ID or display name.
 * Handles aliases like 'goodbody' → 'goodbody-clinic'.
 */
export function getProviderRating(idOrName: string): ProviderRating {
  const key = idOrName.toLowerCase();
  
  // Direct match
  if (PROVIDER_RATINGS[key]) return PROVIDER_RATINGS[key];
  
  // Alias match
  const aliasKey = PROVIDER_ALIASES[key];
  if (aliasKey && PROVIDER_RATINGS[aliasKey]) return PROVIDER_RATINGS[aliasKey];
  
  // Name match
  const nameKey = PROVIDER_NAME_MAP[idOrName];
  if (nameKey && PROVIDER_RATINGS[nameKey]) return PROVIDER_RATINGS[nameKey];
  
  return DEFAULT_RATING;
}
