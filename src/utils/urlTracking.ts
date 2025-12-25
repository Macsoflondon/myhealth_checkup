/**
 * UTM parameter builder for tracking outgoing clicks to provider sites
 * All external links should use these utilities for analytics
 */

interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  providerId?: string;
}

const DEFAULT_UTM: UTMParams = {
  source: 'myhealthcheckup',
  medium: 'comparison',
  campaign: 'test-comparison',
};

/**
 * Build a URL with UTM tracking parameters
 */
export function buildTrackedUrl(baseUrl: string, params?: UTMParams): string {
  const mergedParams = { ...DEFAULT_UTM, ...params };
  
  try {
    const url = new URL(baseUrl);
    
    if (mergedParams.source) {
      url.searchParams.set('utm_source', mergedParams.source);
    }
    if (mergedParams.medium) {
      url.searchParams.set('utm_medium', mergedParams.medium);
    }
    if (mergedParams.campaign) {
      url.searchParams.set('utm_campaign', mergedParams.campaign);
    }
    if (mergedParams.content) {
      url.searchParams.set('utm_content', mergedParams.content);
    }
    if (mergedParams.providerId) {
      url.searchParams.set('provider_id', mergedParams.providerId);
    }
    
    return url.toString();
  } catch {
    // If URL is invalid, return original with query string appended
    const separator = baseUrl.includes('?') ? '&' : '?';
    const queryParts: string[] = [];
    
    if (mergedParams.source) queryParts.push(`utm_source=${encodeURIComponent(mergedParams.source)}`);
    if (mergedParams.medium) queryParts.push(`utm_medium=${encodeURIComponent(mergedParams.medium)}`);
    if (mergedParams.campaign) queryParts.push(`utm_campaign=${encodeURIComponent(mergedParams.campaign)}`);
    if (mergedParams.content) queryParts.push(`utm_content=${encodeURIComponent(mergedParams.content)}`);
    if (mergedParams.providerId) queryParts.push(`provider_id=${encodeURIComponent(mergedParams.providerId)}`);
    
    return `${baseUrl}${separator}${queryParts.join('&')}`;
  }
}

/**
 * Build provider booking URL with tracking
 */
export function buildProviderBookingUrl(
  providerUrl: string,
  providerId: string,
  testName?: string
): string {
  return buildTrackedUrl(providerUrl, {
    source: 'myhealthcheckup',
    medium: 'booking',
    campaign: 'test-booking',
    content: testName ? encodeURIComponent(testName.substring(0, 50)) : undefined,
    providerId,
  });
}

/**
 * Build provider website URL with tracking
 */
export function buildProviderWebsiteUrl(
  providerUrl: string,
  providerId: string
): string {
  return buildTrackedUrl(providerUrl, {
    source: 'myhealthcheckup',
    medium: 'referral',
    campaign: 'provider-profile',
    providerId,
  });
}

/**
 * External link attributes for security and SEO
 */
export const externalLinkProps = {
  target: '_blank' as const,
  rel: 'noopener noreferrer' as const,
};
