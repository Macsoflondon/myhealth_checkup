
// Re-export all data from the individual files
import { compareCategories } from './categories';
import { providers } from './providers';
import { bloodTests } from './bloodTests';
import { weightLoss } from './weightLoss';
import { hormones } from './hormones';
import { vitamins } from './vitamins';

// Combine all test data into the compareData array (excluding removed categories)
export const compareData = [
  ...bloodTests,
  ...weightLoss,
  ...hormones,
  ...vitamins
];

// Re-export categories and providers
export { compareCategories, providers };
