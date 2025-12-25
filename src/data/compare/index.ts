
// Re-export all data from the individual files
import { compareCategories } from './categories';
import { mappedTestData } from './mappedTestData';
import { detailedProviders } from './detailedProviders';
import { medichecksCompareData } from './medichecksData';
import { londonLabCompareData } from './londonLabData';

// Re-export providers from constants (single source of truth)
export { providers, PROVIDER_DETAILS, getAllProviders } from '@/constants/providers';

// Combine all test data
export const compareData = [...mappedTestData, ...medichecksCompareData, ...londonLabCompareData];

// Re-export categories and detailed provider info
export { compareCategories, detailedProviders };
