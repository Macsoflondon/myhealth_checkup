/**
 * Single source of truth for all provider data
 * Used across CompareService, ProviderService, and components
 */

import { Provider } from '@/types';

export const PROVIDER_LOGOS: Record<string, string> = {
  'medichecks': '/lovable-uploads/provider-medichecks-new-v3.png',
  'thriva': '/lovable-uploads/provider-thriva.png',
  'randox': '/lovable-uploads/provider-randox.png',
  'london-medical-laboratory': '/lovable-uploads/provider-london-medical.png',
  'lola-health': '/lovable-uploads/provider-lola-health.png',
  'goodbody-clinic': '/lovable-uploads/provider-goodbody-new-v4.png',
  'goodbody': '/lovable-uploads/provider-goodbody-new-v4.png',
  'tuli-health': '/lovable-uploads/provider-tuli-health.png',
  'london-medical': '/lovable-uploads/provider-london-medical.png',
};

export const PROVIDER_NAMES: Record<string, string> = {
  'medichecks': 'Medichecks',
  'thriva': 'Thriva',
  'randox': 'Randox',
  'london-medical-laboratory': 'London Medical Laboratory',
  'lola-health': 'Lola Health',
  'goodbody-clinic': 'GoodBody Clinic',
  'goodbody': 'Goodbody Clinic',
  'tuli-health': 'Tuli Health',
  'london-medical': 'London Medical Laboratory',
};

export const PROVIDER_DETAILS: Record<string, Provider> = {
  'goodbody': {
    id: 'goodbody',
    name: 'Goodbody Clinic',
    logo: PROVIDER_LOGOS['goodbody'],
    description: 'Premium health screening services',
    accreditations: ['CQC', 'UKAS'],
  },
  'goodbody-clinic': {
    id: 'goodbody-clinic',
    name: 'GoodBody Clinic',
    logo: PROVIDER_LOGOS['goodbody-clinic'],
    description: 'Premium health screening services',
    accreditations: ['CQC', 'UKAS'],
  },
  'medichecks': {
    id: 'medichecks',
    name: 'Medichecks',
    logo: PROVIDER_LOGOS['medichecks'],
    description: 'UK\'s leading blood testing service',
    accreditations: ['UKAS', 'ISO 15189'],
  },
  'lola-health': {
    id: 'lola-health',
    name: 'Lola Health',
    logo: PROVIDER_LOGOS['lola-health'],
    description: 'Digital health testing platform',
    accreditations: ['UKAS'],
  },
  'thriva': {
    id: 'thriva',
    name: 'Thriva',
    logo: PROVIDER_LOGOS['thriva'],
    description: 'Personalised health insights',
    accreditations: ['UKAS'],
  },
  'tuli-health': {
    id: 'tuli-health',
    name: 'Tuli Health',
    logo: PROVIDER_LOGOS['tuli-health'],
    description: 'Comprehensive health assessments',
    accreditations: ['CQC'],
  },
  'london-medical': {
    id: 'london-medical',
    name: 'London Medical Laboratory',
    logo: PROVIDER_LOGOS['london-medical'],
    description: 'Certified laboratory services',
    accreditations: ['UKAS', 'ISO 15189'],
  },
  'london-medical-laboratory': {
    id: 'london-medical-laboratory',
    name: 'London Medical Laboratory',
    logo: PROVIDER_LOGOS['london-medical-laboratory'],
    description: 'Certified laboratory services',
    accreditations: ['UKAS', 'ISO 15189'],
  },
  'randox': {
    id: 'randox',
    name: 'Randox Health',
    logo: PROVIDER_LOGOS['randox'],
    description: 'Advanced health screening',
    accreditations: ['UKAS', 'ISO 15189'],
  },
};

export const PROVIDER_TURNAROUND_TIMES: Record<string, string> = {
  'goodbody': '24-48 hours',
  'goodbody-clinic': '24-48 hours',
  'medichecks': '1-3 days',
  'lola-health': '2-4 days',
  'thriva': '2-5 days',
  'tuli-health': '3-5 days',
  'london-medical': '24-72 hours',
  'london-medical-laboratory': '24-72 hours',
  'randox': '2-4 days',
};

export const PROVIDER_COLLECTION_METHODS: Record<string, string> = {
  'goodbody': 'Venous (clinic)',
  'goodbody-clinic': 'Venous (clinic)',
  'medichecks': 'Finger-prick or Venous',
  'lola-health': 'Finger-prick (home)',
  'thriva': 'Finger-prick (home)',
  'tuli-health': 'Venous (clinic)',
  'london-medical': 'Venous (clinic)',
  'london-medical-laboratory': 'Venous (clinic)',
  'randox': 'Venous (clinic)',
};

export function getProviderLogo(providerId: string): string {
  return PROVIDER_LOGOS[providerId] || '/placeholder.svg';
}

export function getProviderName(providerId: string): string {
  return PROVIDER_NAMES[providerId] || providerId;
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
