import { useState, useEffect } from 'react';

interface UrlValidationResult {
  isValid: boolean | null; // null = still checking, true = valid, false = invalid
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to validate if a URL is likely valid.
 * Due to CORS restrictions, we can't always verify external URLs from the browser.
 * This hook performs basic validation and assumes URLs are valid unless obviously broken.
 */
export function useUrlValidation(url: string | undefined): UrlValidationResult {
  const [result, setResult] = useState<UrlValidationResult>({
    isValid: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!url) {
      setResult({ isValid: false, isLoading: false, error: 'No URL provided' });
      return;
    }

    // Basic URL format validation
    try {
      const parsedUrl = new URL(url);
      
      // Check for obviously invalid patterns
      if (!parsedUrl.protocol.startsWith('http')) {
        setResult({ isValid: false, isLoading: false, error: 'Invalid protocol' });
        return;
      }

      // Check for placeholder or obviously incomplete URLs
      if (
        url.includes('undefined') ||
        url.includes('null') ||
        url.endsWith('/products/') ||
        url.endsWith('/products')
      ) {
        setResult({ isValid: false, isLoading: false, error: 'Incomplete URL' });
        return;
      }

      // URL format is valid - assume it works (CORS prevents actual validation)
      setResult({ isValid: true, isLoading: false, error: null });
      
    } catch {
      setResult({ isValid: false, isLoading: false, error: 'Invalid URL format' });
    }
  }, [url]);

  return result;
}

/**
 * Get a fallback URL for a provider based on their collection page
 */
export function getProviderFallbackUrl(providerId: string): string {
  const fallbackUrls: Record<string, string> = {
    'lola-health': 'https://lolahealth.com/collections/blood-tests',
    'medichecks': 'https://medichecks.com/collections/all-tests',
    'goodbody-clinic': 'https://goodbody.co.uk/blood-tests',
    
    'thriva': 'https://thriva.co/blood-tests',
    'randox': 'https://randoxhealth.com/tests',
    'london-medical-laboratory': 'https://www.londonmedicallaboratory.com/tests',
  };
  
  return fallbackUrls[providerId] || '#';
}
