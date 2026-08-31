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
    'randox': { rating: 4.7, reviews: 28456, reviewsFormatted: '28,400+' },
    'london-medical-laboratory': { rating: 4.1, reviews: 3266, reviewsFormatted: '3,266' },
    'lola-health': { rating: 4.6, reviews: 160, reviewsFormatted: '160+' },
    'onedaytests': { rating: 4.8, reviews: 4021, reviewsFormatted: '4,000+' },
    'the-doctors-laboratory': { rating: 1.9, reviews: 22, reviewsFormatted: '22' },
    // Trustpilot, verified August 2026: uk.trustpilot.com/review/londonhealthcompany.co.uk
    'london-health-company': { rating: 3.9, reviews: 724, reviewsFormatted: '724' },
    // Doctify, verified August 2026: doctify.com/uk/practice/clinilabs (Trustpilot has too few reviews to publish a score)
    'clinilabs': { rating: 5.0, reviews: 12, reviewsFormatted: '12' },
};

/** Aliases that map alternative IDs to canonical keys */
const PROVIDER_ALIASES: Record<string, string> = {
    'goodbody': 'goodbody-clinic',
    'randox-health': 'randox',
};

/** Name-to-ID mapping for lookups by display name */
const PROVIDER_NAME_MAP: Record<string, string> = {
    'Medichecks': 'medichecks',
    'GoodBody Clinic': 'goodbody-clinic',
    'Randox Health': 'randox',
    'London Medical Laboratory': 'london-medical-laboratory',
    'Lola Health': 'lola-health',
    'OneDayTests': 'onedaytests',
    'The Doctors Laboratory': 'the-doctors-laboratory',
};

/**
 * Get provider rating by ID or display name.
 * Handles aliases like 'goodbody' → 'goodbody-clinic'.
 *
 * Returns `null` when we hold no verified rating for that provider — callers
 * MUST hide the rating UI rather than render a placeholder or estimated value.
 * Never invent a fallback rating: fabricated review data breaks the honest
 * comparison promise and UK advertising/CMA rules.
 */
export function getProviderRating(idOrName: string): ProviderRating | null {
    const key = idOrName.toLowerCase();

  // Direct match
  if (PROVIDER_RATINGS[key]) return PROVIDER_RATINGS[key];

  // Alias match
  const aliasKey = PROVIDER_ALIASES[key];
    if (aliasKey && PROVIDER_RATINGS[aliasKey]) return PROVIDER_RATINGS[aliasKey];

  // Name match
  const nameKey = PROVIDER_NAME_MAP[idOrName];
    if (nameKey && PROVIDER_RATINGS[nameKey]) return PROVIDER_RATINGS[nameKey];

  return null;
}
