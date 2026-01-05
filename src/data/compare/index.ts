
// Re-export all data from the individual files
import { compareCategories } from './categories';
import { providers } from './providers';
import { mappedTestData } from './mappedTestData';
import { detailedProviders } from './detailedProviders';

// Use the real mapped test data
export const compareData = mappedTestData;

// Re-export categories, providers, and detailed provider info
export { compareCategories, providers, detailedProviders };
