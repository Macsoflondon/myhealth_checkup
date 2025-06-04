
// Re-export all data from the individual files
import { compareCategories } from './categories';
import { providers } from './providers';
import { bloodTests } from './bloodTests';
import { weightLoss } from './weightLoss';
import { longevity } from './longevity';
import { vaccinations } from './vaccinations';

// Combine all test data into the compareData array
export const compareData = [
  ...bloodTests,
  ...weightLoss,
  ...vaccinations,
  ...longevity
];

// Re-export categories and providers
export { compareCategories, providers };
