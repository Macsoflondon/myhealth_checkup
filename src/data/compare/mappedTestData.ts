import { realTestData, RealTestData } from './realProviderData';

export interface MappedTestData {
  id: string;
  category: string;
  name: string;
  provider: string;
  providerLogo: string;
  price: number;
  testUrl: string;
  features: {
    bioMarkers: string;
    turnaround: string;
    collection: string;
    doctorReview: boolean;
    [key: string]: any;
  };
}

// Provider logo mapping
const providerLogos: { [key: string]: string } = {
  "Medichecks": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
  "London Medical Laboratory": "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
  "Thriva": "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
  "Randox": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200"
};

// Category mapping based on tags and test names
const getCategoryFromTags = (tags: string | null, testName: string): string => {
  if (!tags) {
    // Fallback to analyzing test name for category
    const nameLower = testName.toLowerCase();
    if (nameLower.includes('hormone') || nameLower.includes('testosterone') || nameLower.includes('oestradiol') || nameLower.includes('thyroid')) {
      return 'hormones';
    }
    if (nameLower.includes('vitamin') || nameLower.includes('b12') || nameLower.includes('folate')) {
      return 'vitamins';
    }
    if (nameLower.includes('diabetes') || nameLower.includes('hba1c') || nameLower.includes('glucose')) {
      return 'diabetes';
    }
    if (nameLower.includes('heart') || nameLower.includes('cholesterol') || nameLower.includes('cardiovascular')) {
      return 'heart-health';
    }
    if (nameLower.includes('liver')) {
      return 'liver-health';
    }
    if (nameLower.includes('kidney')) {
      return 'kidney-health';
    }
    if (nameLower.includes('cancer') || nameLower.includes('screening') || nameLower.includes('psa')) {
      return 'cancer-screening';
    }
    if (nameLower.includes('fertility') || nameLower.includes('pregnancy')) {
      return 'fertility';
    }
    if (nameLower.includes('allergy')) {
      return 'allergy-testing';
    }
    return 'blood-tests'; // Default fallback
  }

  const tagsLower = tags.toLowerCase();
  const tagArray = tagsLower.split(',').map(tag => tag.trim());

  for (const tag of tagArray) {
    switch (tag) {
      case 'hormone':
        return 'hormones';
      case 'thyroid':
        return 'thyroid';
      case 'diabetes':
        return 'diabetes';
      case 'heart':
        return 'heart-health';
      case 'liver':
        return 'liver-health';
      case 'kidney':
        return 'kidney-health';
      case 'fertility':
        return 'fertility';
      case 'general health':
        return 'general-health';
      default:
        continue;
    }
  }

  return 'blood-tests'; // Default fallback
};

// Generate turnaround time based on provider
const getTurnaroundTime = (provider: string): string => {
  switch (provider) {
    case 'Medichecks':
      return '2-4 days';
    case 'London Medical Laboratory':
      return '1-3 days';
    case 'Thriva':
      return '3-5 days';
    case 'Randox':
      return '1-2 days';
    default:
      return '2-4 days';
  }
};

// Generate collection method based on provider and test type
const getCollectionMethod = (provider: string, testName: string): string => {
  if (testName.toLowerCase().includes('at home')) {
    return 'Home kit';
  }
  
  switch (provider) {
    case 'Medichecks':
      return 'Home kit or clinic';
    case 'London Medical Laboratory':
      return 'Clinic and home kit';
    case 'Thriva':
      return 'Home kit';
    case 'Randox':
      return 'Clinic only';
    default:
      return 'Home kit or clinic';
  }
};

// Map real test data to existing format
export const mapRealTestData = (realData: RealTestData[]): MappedTestData[] => {
  return realData.map((test, index) => ({
    id: `real-test-${index + 1}`,
    category: getCategoryFromTags(test.Tags, test["Test Name"]),
    name: test["Test Name"],
    provider: test.Provider,
    providerLogo: providerLogos[test.Provider] || providerLogos["Medichecks"],
    price: test["Price (£)"],
    testUrl: test["Test URL"],
    features: {
      bioMarkers: `${test["Biomarker Count"]} biomarkers`,
      turnaround: getTurnaroundTime(test.Provider),
      collection: getCollectionMethod(test.Provider, test["Test Name"]),
      doctorReview: true,
      "Real provider URL": test["Test URL"],
      "Biomarker count": test["Biomarker Count"]
    }
  }));
};

// Export the mapped data
export const mappedTestData = mapRealTestData(realTestData);

// Group data by category for easier access
export const testsByCategory = mappedTestData.reduce((acc, test) => {
  if (!acc[test.category]) {
    acc[test.category] = [];
  }
  acc[test.category].push(test);
  return acc;
}, {} as { [key: string]: MappedTestData[] });