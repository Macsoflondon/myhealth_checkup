
// Re-export all data from the individual files
import { compareCategories } from './categories';
import { providers } from './providers';
import { mappedTestData } from './mappedTestData';
import { detailedProviders } from './detailedProviders';
import { medichecksCompareData } from './medichecksData';
import { londonLabCompareData } from './londonLabData';

// Combine all test data
export const compareData = [...mappedTestData, ...medichecksCompareData, ...londonLabCompareData];

// Re-export categories, providers, and detailed provider info
export { compareCategories, providers, detailedProviders };
