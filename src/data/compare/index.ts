
// Re-export all data from the individual files
import { compareCategories } from './categories';
import { providers } from './providers';
import { bloodTests } from './bloodTests';
import { weightLoss } from './weightLoss';
import { longevity } from './longevity';
import { hormones } from './hormones';
import { vitamins } from './vitamins';
import { travel } from './travel';
import { earWax } from './earWax';

// Combine all test data into the compareData array
export const compareData = [
  ...bloodTests,
  ...weightLoss,
  ...longevity,
  ...hormones,
  ...vitamins,
  ...travel,
  ...earWax
];

// Re-export categories and providers
export { compareCategories, providers };
