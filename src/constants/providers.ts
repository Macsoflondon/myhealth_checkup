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
  'medichecks': '/lovable-uploads/provider-medichecks-new-v3.png',
  'thriva': '/lovable-uploads/provider-thriva.png',
  'randox': '/lovable-uploads/provider-randox.png',
  'london-medical-laboratory': '/lovable-uploads/provider-london-medical.png',
  'lola-health': '/lovable-uploads/provider-lola-health.png',
  'goodbody-clinic': '/lovable-uploads/provider-goodbody-new-v3.png',
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
  'goodbody-clinic': '24-48 hours',
  'medichecks': '1-3 days',
  'lola-health': '2-4 days',
  'thriva': '2-5 days',
  'london-medical-laboratory': '24-72 hours',
  'randox': '2-4 days',
  'london-health-company': '2-5 days',
  'medical-diagnosis': '1-3 days',
  'clinilabs': '1-3 days',
};

export const PROVIDER_COLLECTION_METHODS: Record<string, string> = {
  'goodbody-clinic': 'Venous (clinic)',
  'medichecks': 'Finger-prick or Venous',
  'lola-health': 'Finger-prick (home)',
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
