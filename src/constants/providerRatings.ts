/**
 * Single source of truth for provider Trustpilot ratings and review counts.
 * Updated: March 2026
 */

export interface ProviderRating {
  rating: number;
  reviews: number;
  reviewsFormatted: string;
}

export const PROVIDER_RATINGS: Record<string, ProviderRating> = {
  'medichecks': { rating: 4.0, reviews: 950, reviewsFormatted: '950' },
  'goodbody-clinic': { rating: 4.8, reviews: 3600, reviewsFormatted: '3,600+' },
  'thriva': { rating: 4.4, reviews: 2500, reviewsFormatted: '2,500' },
  'randox': { rating: 4.6, reviews: 26000, reviewsFormatted: '26,000' },
  'london-medical-laboratory': { rating: 4.1, reviews: 3266, reviewsFormatted: '3,266' },
  'lola-health': { rating: 4.8, reviews: 130, reviewsFormatted: '130' },
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
