
// Re-export all data from the individual files
import { compareCategories } from './categories';
import { providers } from './providers';
import { bloodTests } from './bloodTests';
import { weightLoss } from './weightLoss';
import { hormones } from './hormones';
import { vitamins } from './vitamins';
import { cancerScreening } from './cancerScreening';
import { diabetes } from './diabetes';
import { gutHealth } from './gutHealth';
import { detailedProviders } from './detailedProviders';

// Combine all test data into the compareData array
export const compareData = [
  ...bloodTests,
  ...weightLoss,
  ...hormones,
  ...vitamins,
  ...cancerScreening,
  ...diabetes,
  ...gutHealth
];

// Re-export categories, providers, and detailed provider info
export { compareCategories, providers, detailedProviders };
