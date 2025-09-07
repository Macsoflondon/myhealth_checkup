// Comprehensive Goodbody blood test database
export interface GoodbodyTest {
  id: string;
  name: string;
  price: number;
  description: string;
  biomarkers?: number;
  turnaround?: string;
  categories: string[]; // Multiple categories for cross-referencing
  url?: string;
}

export const goodbodyTests: GoodbodyTest[] = [
  // Women's Health Tests
  {
    id: 'advanced-well-woman',
    name: 'Advanced Well Woman Test',
    price: 149,
    description: 'Comprehensive health check for women including hormones',
    biomarkers: 45,
    turnaround: '2-3 days',
    categories: ['womens-health', 'general-wellness'],
    url: '/book/advanced-well-woman'
  },
  {
    id: 'female-hormones',
    name: 'Female Hormones Test',
    price: 99,
    description: 'Complete female hormone panel including FSH, LH, oestrogen',
    biomarkers: 8,
    turnaround: '2-3 days',
    categories: ['womens-health', 'hormones'],
    url: '/book/female-hormones'
  },
  {
    id: 'menopause-test',
    name: 'Menopause Test',
    price: 89,
    description: 'Check hormone levels related to menopause',
    biomarkers: 6,
    turnaround: '2-3 days',
    categories: ['womens-health', 'hormones'],
    url: '/book/menopause-test'
  },
  {
    id: 'amh-fertility',
    name: 'AMH Fertility Test',
    price: 69,
    description: 'Anti-Müllerian Hormone test for fertility assessment',
    biomarkers: 1,
    turnaround: '3-5 days',
    categories: ['womens-health', 'hormones'],
    url: '/book/amh-fertility'
  },
  {
    id: 'pcos-test',
    name: 'PCOS Test',
    price: 85,
    description: 'Comprehensive screening for polycystic ovary syndrome',
    biomarkers: 10,
    turnaround: '2-3 days',
    categories: ['womens-health', 'hormones'],
    url: '/book/pcos-test'
  },

  // Men's Health Tests
  {
    id: 'advanced-well-man',
    name: 'Advanced Well Man Test',
    price: 149,
    description: 'Comprehensive health check for men including hormones',
    biomarkers: 42,
    turnaround: '2-3 days',
    categories: ['mens-health', 'general-wellness'],
    url: '/book/advanced-well-man'
  },
  {
    id: 'male-hormones',
    name: 'Male Hormones Test',
    price: 89,
    description: 'Complete male hormone panel including testosterone',
    biomarkers: 6,
    turnaround: '2-3 days',
    categories: ['mens-health', 'hormones'],
    url: '/book/male-hormones'
  },
  {
    id: 'testosterone-test',
    name: 'Testosterone Test',
    price: 45,
    description: 'Total and free testosterone levels',
    biomarkers: 2,
    turnaround: '2-3 days',
    categories: ['mens-health', 'hormones'],
    url: '/book/testosterone-test'
  },
  {
    id: 'erectile-dysfunction',
    name: 'Erectile Dysfunction Test',
    price: 125,
    description: 'Comprehensive ED screening including hormones and circulation',
    biomarkers: 12,
    turnaround: '2-3 days',
    categories: ['mens-health'],
    url: '/book/erectile-dysfunction'
  },
  {
    id: 'prostate-test',
    name: 'Prostate Test',
    price: 65,
    description: 'PSA screening for prostate health',
    biomarkers: 2,
    turnaround: '2-3 days',
    categories: ['mens-health'],
    url: '/book/prostate-test'
  },

  // Hormone Tests
  {
    id: 'fertility-hormone-panel',
    name: 'Fertility Hormone Panel',
    price: 125,
    description: 'Comprehensive fertility assessment for both men and women',
    biomarkers: 12,
    turnaround: '3-5 days',
    categories: ['hormones', 'womens-health', 'mens-health'],
    url: '/book/fertility-hormone-panel'
  },
  {
    id: 'cortisol-stress',
    name: 'Cortisol Stress Test',
    price: 65,
    description: 'Measure stress hormone levels throughout the day',
    biomarkers: 4,
    turnaround: '2-3 days',
    categories: ['hormones', 'general-wellness'],
    url: '/book/cortisol-stress'
  },

  // Thyroid Tests
  {
    id: 'thyroid-function',
    name: 'Thyroid Function Test',
    price: 69,
    description: 'TSH, T3, T4 thyroid hormone levels',
    biomarkers: 3,
    turnaround: '2-3 days',
    categories: ['thyroid', 'hormones'],
    url: '/book/thyroid-function'
  },
  {
    id: 'thyroid-antibodies',
    name: 'Thyroid Function with Antibodies',
    price: 125,
    description: 'Complete thyroid assessment including antibodies',
    biomarkers: 6,
    turnaround: '3-5 days',
    categories: ['thyroid', 'hormones'],
    url: '/book/thyroid-antibodies'
  },

  // General Wellness Tests
  {
    id: 'premium-complete',
    name: 'Premium Complete Blood Test',
    price: 199,
    description: 'Most comprehensive health check available',
    biomarkers: 65,
    turnaround: '2-3 days',
    categories: ['general-wellness', 'womens-health', 'mens-health'],
    url: '/book/premium-complete'
  },
  {
    id: 'hepatitis-screening',
    name: 'Hepatitis Screening',
    price: 89,
    description: 'Screen for Hepatitis B and C infections',
    biomarkers: 6,
    turnaround: '3-5 days',
    categories: ['general-wellness'],
    url: '/book/hepatitis-screening'
  },
  {
    id: 'liver-function',
    name: 'Liver Function Test',
    price: 65,
    description: 'Comprehensive liver health assessment',
    biomarkers: 8,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: '/book/liver-function'
  },
  {
    id: 'kidney-function',
    name: 'Kidney Function Test',
    price: 55,
    description: 'Check kidney health and function',
    biomarkers: 6,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: '/book/kidney-function'
  },
  {
    id: 'cardiac-risk',
    name: 'Cardiac Risk Test',
    price: 75,
    description: 'Assess heart disease risk factors',
    biomarkers: 8,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: '/book/cardiac-risk'
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness Test',
    price: 125,
    description: 'Optimize performance and recovery',
    biomarkers: 15,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: '/book/sports-fitness'
  },
  {
    id: 'tiredness-test',
    name: 'Tiredness Test',
    price: 95,
    description: 'Find the cause of chronic fatigue',
    biomarkers: 12,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: '/book/tiredness-test'
  },
  {
    id: 'anaemia-test',
    name: 'Anaemia Test',
    price: 45,
    description: 'Check for iron deficiency and anaemia',
    biomarkers: 6,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: '/book/anaemia-test'
  },
  {
    id: 'full-blood-count',
    name: 'Full Blood Count',
    price: 35,
    description: 'Complete blood cell analysis',
    biomarkers: 15,
    turnaround: '1-2 days',
    categories: ['general-wellness'],
    url: '/book/full-blood-count'
  },
  {
    id: 'blood-group',
    name: 'Blood Group Test',
    price: 25,
    description: 'Determine your ABO and Rhesus blood group',
    biomarkers: 2,
    turnaround: '1-2 days',
    categories: ['general-wellness'],
    url: '/book/blood-group'
  },
  {
    id: 'helicobacter-pylori',
    name: 'Helicobacter Pylori Test',
    price: 45,
    description: 'Screen for H. pylori stomach bacteria',
    biomarkers: 1,
    turnaround: '3-5 days',
    categories: ['general-wellness'],
    url: '/book/helicobacter-pylori'
  }
];

// Helper function to get tests by category
export const getTestsByCategory = (category: string): GoodbodyTest[] => {
  return goodbodyTests.filter(test => test.categories.includes(category));
};

// Helper function to get tests for navigation dropdowns
export const getTestsForNavigation = (navItem: string): GoodbodyTest[] => {
  const categoryMap: Record<string, string[]> = {
    'WOMEN\'S HEALTH': ['womens-health'],
    'MEN\'S HEALTH': ['mens-health'],
    'HORMONES': ['hormones'],
    'THYROID': ['thyroid'],
    'GENERAL WELLNESS': ['general-wellness']
  };

  const categories = categoryMap[navItem] || [];
  const tests = categories.flatMap(category => getTestsByCategory(category));
  
  // Remove duplicates based on test ID
  const uniqueTests = tests.filter((test, index, self) => 
    index === self.findIndex(t => t.id === test.id)
  );
  
  // Limit to 8 tests for dropdown display
  return uniqueTests.slice(0, 8);
};