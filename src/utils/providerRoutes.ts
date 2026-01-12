/**
 * Centralized provider route configuration
 * Maps database provider_id values to their URL route paths
 * 
 * Database provider_id values:
 * - goodbody-clinic
 * - lola-health
 * - london-medical-laboratory
 * - medichecks
 * - randox
 * - thriva
 */

// Map database provider_id to URL route path (canonical routes)
export const PROVIDER_ROUTE_MAP: Record<string, string> = {
  'goodbody-clinic': '/goodbody-clinic',
  'goodbody': '/goodbody-clinic', // Alias
  'lola-health': '/lola-health',
  'london-medical-laboratory': '/london-medical-laboratory',
  'medichecks': '/medichecks',
  'randox': '/randox',
  'randox-health': '/randox', // Alias
  'thriva': '/thriva',
  'tuli-health': '/tuli-health',
};

// Provider display names
export const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  'goodbody-clinic': 'GoodBody Clinic',
  'goodbody': 'GoodBody Clinic',
  'lola-health': 'Lola Health',
  'london-medical-laboratory': 'London Medical Laboratory',
  'medichecks': 'Medichecks',
  'randox': 'Randox Health',
  'randox-health': 'Randox Health',
  'thriva': 'Thriva',
  'tuli-health': 'Tuli Health',
};

/**
 * Get the canonical URL route for a provider
 * @param providerId - The provider_id from the database
 * @returns The URL path for the provider's test detail pages
 */
export function getProviderRoute(providerId: string): string {
  const normalizedId = providerId.toLowerCase();
  return PROVIDER_ROUTE_MAP[normalizedId] || '/compare';
}

/**
 * Get the provider display name
 * @param providerId - The provider_id from the database
 * @returns The display name for the provider
 */
export function getProviderDisplayName(providerId: string): string {
  const normalizedId = providerId.toLowerCase();
  return PROVIDER_DISPLAY_NAMES[normalizedId] || providerId;
}

/**
 * Generate a full test URL for a provider test
 * @param providerId - The provider_id from the database
 * @param testSlug - The test slug or ID
 * @returns The full URL path for the test
 */
export function getTestDetailUrl(providerId: string, testSlug: string): string {
  const route = getProviderRoute(providerId);
  return `${route}/${testSlug}`;
}

/**
 * Get provider ID from a provider name string (e.g., from MegaMenu data)
 * @param providerName - The provider name or partial match string
 * @returns The canonical provider_id
 */
export function normalizeProviderFromName(providerName: string): string {
  const name = providerName.toLowerCase().replace(/\s+/g, '-').replace('clinic', '');
  
  if (name.includes('medichecks')) return 'medichecks';
  if (name.includes('goodbody')) return 'goodbody-clinic';
  if (name.includes('lola')) return 'lola-health';
  if (name.includes('thriva')) return 'thriva';
  if (name.includes('randox')) return 'randox';
  if (name.includes('tuli')) return 'tuli-health';
  if (name.includes('london')) return 'london-medical-laboratory';
  
  return providerName;
}

/**
 * Generate test URL from provider name string (for MegaMenu compatibility)
 * @param providerName - The provider name from test data
 * @param testId - The test ID or slug
 * @param fallbackCategory - Category for fallback URL
 * @returns The URL path for the test
 */
export function getTestUrlFromProviderName(
  providerName: string | undefined,
  testId: string,
  fallbackCategory?: string
): string {
  if (!providerName) {
    return fallbackCategory ? `/compare?category=${fallbackCategory}` : '/compare';
  }
  
  const providerId = normalizeProviderFromName(providerName);
  return getTestDetailUrl(providerId, testId);
}
