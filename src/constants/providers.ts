/**
 * Single source of truth for all provider data
 * Used across CompareService, ProviderService, and components
 */

export interface Provider {
  id: string;
  name: string;
  logo: string;
  website: string;
  description?: string;
  accreditations?: string[];
}

export const PROVIDER_LOGOS: Record<string, string> = {
  'medichecks': '/lovable-uploads/provider-medichecks-light.png',
  'thriva': '/lovable-uploads/provider-thriva.png',
  'randox': '/lovable-uploads/provider-randox.png',
  'london-medical-laboratory': '/lovable-uploads/provider-london-medical.png',
  'lola-health': '/lovable-uploads/provider-lola-health.png',
  'goodbody-clinic': '/lovable-uploads/74b36cff-95b5-4bfc-8ad8-61b4512fd92f.png',
  'london-health-company': '/lovable-uploads/provider-london-health-company.png',
  'medical-diagnosis': '/lovable-uploads/provider-medical-diagnosis.png',
  'clinilabs': '/lovable-uploads/provider-clinilabs.png',
};

export const PROVIDER_NAMES: Record<string, string> = {
  'medichecks': 'Medichecks',
  'thriva': 'Thriva',
  'randox': 'Randox Health',
  'london-medical-laboratory': 'London Medical Laboratory',
  'lola-health': 'Lola Health',
  'goodbody-clinic': 'GoodBody Clinic',
  'london-health-company': 'London Health Company',
  'medical-diagnosis': 'Medical Diagnosis',
  'clinilabs': 'Clinilabs',
};

export const PROVIDER_WEBSITES: Record<string, string> = {
  'medichecks': 'https://medichecks.com',
  'thriva': 'https://thriva.co',
  'randox': 'https://randoxhealth.com',
  'london-medical-laboratory': 'https://londonmedicallaboratory.com',
  'lola-health': 'https://referrals.lolahealth.com/myhealthcheckup',
  'goodbody-clinic': 'https://goodbodyclinic.com',
  'london-health-company': 'https://londonhealthcompany.co.uk',
  'medical-diagnosis': 'https://www.medical-diagnosis.co.uk',
  'clinilabs': 'https://www.clinilabs.co.uk',
};

export const PROVIDER_DETAILS: Record<string, Provider> = {
  'goodbody-clinic': {
    id: 'goodbody-clinic',
    name: 'GoodBody Clinic',
    logo: PROVIDER_LOGOS['goodbody-clinic'],
    website: PROVIDER_WEBSITES['goodbody-clinic'],
    description: 'Premium health screening services',
    accreditations: ['CQC', 'UKAS'],
  },
  'medichecks': {
    id: 'medichecks',
    name: 'Medichecks',
    logo: PROVIDER_LOGOS['medichecks'],
    website: PROVIDER_WEBSITES['medichecks'],
    description: 'UK\'s leading blood testing service',
    accreditations: ['UKAS', 'ISO 15189'],
  },
  'lola-health': {
    id: 'lola-health',
    name: 'Lola Health',
    logo: PROVIDER_LOGOS['lola-health'],
    website: PROVIDER_WEBSITES['lola-health'],
    description: 'Digital health testing platform',
    accreditations: ['UKAS'],
  },
  'thriva': {
    id: 'thriva',
    name: 'Thriva',
    logo: PROVIDER_LOGOS['thriva'],
    website: PROVIDER_WEBSITES['thriva'],
    description: 'Personalised health insights',
    accreditations: ['UKAS'],
  },
  'london-medical-laboratory': {
    id: 'london-medical-laboratory',
    name: 'London Medical Laboratory',
    logo: PROVIDER_LOGOS['london-medical-laboratory'],
    website: PROVIDER_WEBSITES['london-medical-laboratory'],
    description: 'Certified laboratory services',
    accreditations: ['UKAS', 'ISO 15189'],
  },
  'randox': {
    id: 'randox',
    name: 'Randox Health',
    logo: PROVIDER_LOGOS['randox'],
    website: PROVIDER_WEBSITES['randox'],
    description: 'Advanced health screening',
    accreditations: ['UKAS', 'ISO 15189'],
  },
  'london-health-company': {
    id: 'london-health-company',
    name: 'London Health Company',
    logo: PROVIDER_LOGOS['london-health-company'],
    website: PROVIDER_WEBSITES['london-health-company'],
    description: 'At-home blood test kits with lab analysis',
    accreditations: ['UKAS'],
  },
  'medical-diagnosis': {
    id: 'medical-diagnosis',
    name: 'Medical Diagnosis',
    logo: PROVIDER_LOGOS['medical-diagnosis'],
    website: PROVIDER_WEBSITES['medical-diagnosis'],
    description: 'Comprehensive diagnostic testing services',
    accreditations: ['UKAS'],
  },
  'clinilabs': {
    id: 'clinilabs',
    name: 'Clinilabs',
    logo: PROVIDER_LOGOS['clinilabs'],
    website: PROVIDER_WEBSITES['clinilabs'],
    description: 'In-clinic blood testing and diagnostics',
    accreditations: ['UKAS'],
  },
};

export const PROVIDER_TURNAROUND_TIMES: Record<string, string> = {
  'goodbody-clinic': '3-5 days',
  'medichecks': '3-6 days',
  'lola-health': '4 days',
  'thriva': '4-5 days',
  'london-medical-laboratory': 'Next day (in-store) / 3-4 days (home kit)',
  'randox': '2-3 days',
  'london-health-company': '4-8 days',
  'medical-diagnosis': '3-6 days',
  'clinilabs': '3-6 days',
};

export const PROVIDER_COLLECTION_METHODS: Record<string, string> = {
  'goodbody-clinic': 'Venous (clinic)',
  'medichecks': 'Finger-prick or Venous',
  'lola-health': 'Venous (home nurse or clinic)',
  'thriva': 'Finger-prick (home)',
  'london-medical-laboratory': 'Venous (clinic)',
  'randox': 'Venous (clinic)',
  'london-health-company': 'Finger-prick (home)',
  'medical-diagnosis': 'Venous (clinic)',
  'clinilabs': 'Venous (clinic)',
};

/**
 * Array of core providers for UI components (carousel, grids, etc.)
 * These are the primary partners displayed prominently on the site
 */
export const providers: Provider[] = [
  PROVIDER_DETAILS['goodbody-clinic'],
  PROVIDER_DETAILS['medichecks'],
  PROVIDER_DETAILS['thriva'],
  PROVIDER_DETAILS['randox'],
  PROVIDER_DETAILS['london-medical-laboratory'],
  PROVIDER_DETAILS['lola-health'],
  PROVIDER_DETAILS['london-health-company'],
  PROVIDER_DETAILS['medical-diagnosis'],
  PROVIDER_DETAILS['clinilabs'],
];

export function getProviderLogo(providerId: string): string {
  return PROVIDER_LOGOS[providerId] || '/placeholder.svg';
}

/**
 * Returns responsive srcSet (1x/2x/3x) for provider logos.
 * Generated assets live in /lovable-uploads/providers/{id}@{160,320,480}.png
 * Falls back to the original logo when no responsive set exists.
 */
const PROVIDERS_WITH_RESPONSIVE_LOGOS = new Set<string>([
  'medichecks', 'thriva', 'randox', 'london-medical-laboratory',
  'lola-health', 'goodbody-clinic', 'london-health-company',
  'medical-diagnosis', 'clinilabs',
]);

export function getProviderLogoSrcSet(providerId: string): { src: string; srcSet?: string } {
  const fallback = getProviderLogo(providerId);
  if (!PROVIDERS_WITH_RESPONSIVE_LOGOS.has(providerId)) return { src: fallback };
  const base = `/lovable-uploads/providers/${providerId}`;
  return {
    src: `${base}@160.png`,
    srcSet: `${base}@160.png 1x, ${base}@320.png 2x, ${base}@480.png 3x`,
  };
}

export function getProviderName(providerId: string): string {
  return PROVIDER_NAMES[providerId] || providerId;
}

export function getProviderWebsite(providerId: string): string {
  return PROVIDER_WEBSITES[providerId] || '';
}

export function getProviderDetails(providerId: string): Provider | null {
  return PROVIDER_DETAILS[providerId] || null;
}

export function getAllProviders(): Provider[] {
  return Object.values(PROVIDER_DETAILS);
}

export function getSupportedProviderIds(): string[] {
  return Object.keys(PROVIDER_LOGOS);
}