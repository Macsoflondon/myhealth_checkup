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
  // Advanced Health Tests
  {
    id: 'Goodbody061',
    name: 'Advanced Vitamins',
    price: 649,
    description: 'Comprehensive vitamin and mineral analysis',
    biomarkers: 10,
    turnaround: '2-3 days',
    categories: ['general-wellness', 'vitamins'],
    url: 'https://health.goodbodyclinic.com/product/advanced-vitamins-blood-test/'
  },
  {
    id: 'Goodbody008',
    name: 'Advanced Well Man',
    price: 175,
    description: 'Comprehensive health check for men including hormones',
    biomarkers: 49,
    turnaround: '2-3 days',
    categories: ['mens-health', 'general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/advanced-well-man-test/'
  },
  {
    id: 'Goodbody009',
    name: 'Advanced Well Woman',
    price: 175,
    description: 'Comprehensive health check for women including hormones',
    biomarkers: 52,
    turnaround: '2-3 days',
    categories: ['womens-health', 'general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/advanced-well-woman-blood-test/'
  },
  {
    id: 'Goodbody120',
    name: 'Enhanced Well Woman (Rachel\'s Test)',
    price: 175,
    description: 'Enhanced comprehensive health check for women',
    biomarkers: 52,
    turnaround: '2-3 days',
    categories: ['womens-health', 'general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/advanced-well-woman-blood-test/'
  },
  {
    id: 'Goodbody124',
    name: 'Complete Wellness',
    price: 249,
    description: 'Premium comprehensive health screening',
    biomarkers: 62,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/premium-complete-wellness-blood-test/'
  },

  // Blood & General Health
  {
    id: 'Goodbody001',
    name: 'Full Blood Count',
    price: 69,
    description: 'Complete blood cell analysis',
    biomarkers: 15,
    turnaround: '1-2 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/full-blood-count-blood-test/'
  },
  {
    id: 'Goodbody105',
    name: 'Blood Group',
    price: 109,
    description: 'Determine your ABO and Rhesus blood group',
    biomarkers: 1,
    turnaround: '1-2 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/all-products/?rc_page=6'
  },
  {
    id: 'Goodbody076',
    name: 'Anaemia',
    price: 79,
    description: 'Check for iron deficiency and anaemia',
    biomarkers: 4,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/general-health-blood-tests/?rc_page=6'
  },

  // Cardiovascular Health
  {
    id: 'Goodbody006',
    name: 'Cardiac Risk',
    price: 99,
    description: 'Assess heart disease risk factors',
    biomarkers: 8,
    turnaround: '2-3 days',
    categories: ['general-wellness', 'heart-health'],
    url: 'https://health.goodbodyclinic.com/product/cardiac-risk-blood-test/'
  },
  {
    id: 'Goodbody004',
    name: 'Cholesterol',
    price: 69,
    description: 'Complete cholesterol and lipid profile',
    biomarkers: 6,
    turnaround: '2-3 days',
    categories: ['general-wellness', 'heart-health'],
    url: 'https://health.goodbodyclinic.com/product/cholesterol-blood-test/'
  },

  // Organ Function Tests
  {
    id: 'Goodbody002',
    name: 'Kidney',
    price: 69,
    description: 'Check kidney health and function',
    biomarkers: 3,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/kidney-blood-test/'
  },
  {
    id: 'Goodbody003',
    name: 'Liver',
    price: 69,
    description: 'Comprehensive liver health assessment',
    biomarkers: 6,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/liver-blood-test/'
  },

  // Diabetes & Metabolic Health
  {
    id: 'Goodbody035',
    name: 'Diabetes',
    price: 69,
    description: 'HbA1c test for diabetes screening',
    biomarkers: 1,
    turnaround: '2-3 days',
    categories: ['general-wellness', 'diabetes'],
    url: 'https://health.goodbodyclinic.com/product/diabetes-hba1c-blood-test/'
  },

  // Thyroid Tests
  {
    id: 'Goodbody016',
    name: 'Thyroid Function',
    price: 49,
    description: 'TSH and T4 thyroid hormone levels',
    biomarkers: 2,
    turnaround: '2-3 days',
    categories: ['thyroid', 'hormones'],
    url: 'https://health.goodbodyclinic.com/all-products/?rc_page=6'
  },
  {
    id: 'Goodbody064',
    name: 'Thyroid With Antibodies',
    price: 109,
    description: 'Complete thyroid assessment including antibodies',
    biomarkers: 5,
    turnaround: '3-5 days',
    categories: ['thyroid', 'hormones'],
    url: 'https://health.goodbodyclinic.com/product/thyroid-function-with-antibodies-blood-test/'
  },

  // Hormone Tests
  {
    id: 'Goodbody047',
    name: 'Testosterone',
    price: 49,
    description: 'Testosterone level assessment',
    biomarkers: 1,
    turnaround: '2-3 days',
    categories: ['mens-health', 'hormones'],
    url: 'https://health.goodbodyclinic.com/general-health-blood-tests/?rc_page=6'
  },
  {
    id: 'Goodbody123',
    name: 'Cortisol',
    price: 45,
    description: 'Stress hormone level assessment',
    biomarkers: 1,
    turnaround: '2-3 days',
    categories: ['hormones', 'general-wellness'],
    url: 'https://health.goodbodyclinic.com/all-products/'
  },

  // Women's Health & Fertility
  {
    id: 'Goodbody020',
    name: 'Female Hormone & Fertility',
    price: 79,
    description: 'Complete female hormone panel for fertility assessment',
    biomarkers: 7,
    turnaround: '2-3 days',
    categories: ['womens-health', 'hormones', 'fertility'],
    url: 'https://health.goodbodyclinic.com/fertility-blood-tests/'
  },
  {
    id: 'Goodbody039',
    name: 'Anti-Mullerian',
    price: 109,
    description: 'AMH test for ovarian reserve and fertility',
    biomarkers: 1,
    turnaround: '3-5 days',
    categories: ['womens-health', 'hormones', 'fertility'],
    url: 'https://health.goodbodyclinic.com/product/anti-mullerian-hormone-blood-test/'
  },
  {
    id: 'Goodbody014',
    name: 'Polycystic Ovary Syndrome',
    price: 89,
    description: 'Comprehensive PCOS screening',
    biomarkers: 12,
    turnaround: '2-3 days',
    categories: ['womens-health', 'hormones'],
    url: 'https://health.goodbodyclinic.com/product/polycystic-ovary-syndrome-blood-test/'
  },
  {
    id: 'Goodbody021',
    name: 'Menopause',
    price: 79,
    description: 'Hormone levels related to menopause',
    biomarkers: 5,
    turnaround: '2-3 days',
    categories: ['womens-health', 'hormones'],
    url: 'https://health.goodbodyclinic.com/product/menopause-blood-test/'
  },
  {
    id: 'Goodbody040',
    name: 'Pregnancy',
    price: 79,
    description: 'Pregnancy hormone testing',
    biomarkers: 1,
    turnaround: '2-3 days',
    categories: ['womens-health'],
    url: 'https://health.goodbodyclinic.com/locations/kingsbury-clinic-british-chemist/'
  },

  // Men's Health
  {
    id: 'Goodbody019',
    name: 'Male Hormone & Fertility',
    price: 79,
    description: 'Complete male hormone panel for fertility assessment',
    biomarkers: 6,
    turnaround: '2-3 days',
    categories: ['mens-health', 'hormones', 'fertility'],
    url: 'https://health.goodbodyclinic.com/product/male-hormone-and-fertility-blood-test/'
  },
  {
    id: 'Goodbody067',
    name: 'Erectile Dysfunction',
    price: 79,
    description: 'Comprehensive ED screening including hormones',
    biomarkers: 11,
    turnaround: '2-3 days',
    categories: ['mens-health'],
    url: 'https://health.goodbodyclinic.com/product/erectile-dysfunction-blood-test/'
  },
  {
    id: 'Goodbody072',
    name: 'Prostate PSA',
    price: 69,
    description: 'PSA screening for prostate health',
    biomarkers: 1,
    turnaround: '2-3 days',
    categories: ['mens-health'],
    url: 'https://health.goodbodyclinic.com/product/prostate-psa-blood-test/'
  },

  // Vitamins & Minerals
  {
    id: 'Goodbody066',
    name: 'Vitamins',
    price: 69,
    description: 'Essential vitamin levels assessment',
    biomarkers: 3,
    turnaround: '2-3 days',
    categories: ['general-wellness', 'vitamins'],
    url: 'https://health.goodbodyclinic.com/general-health-blood-tests/?rc_page=6'
  },
  {
    id: 'Goodbody013',
    name: 'Iron',
    price: 89,
    description: 'Iron levels and storage assessment',
    biomarkers: 5,
    turnaround: '2-3 days',
    categories: ['general-wellness', 'vitamins'],
    url: 'https://health.goodbodyclinic.com/product/iron-blood-test/'
  },
  {
    id: 'Goodbody059',
    name: 'Trace Metal',
    price: 449,
    description: 'Heavy metals and trace elements analysis',
    biomarkers: 6,
    turnaround: '5-7 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/general-health-blood-tests/?rc_page=6'
  },

  // Specialist Screening
  {
    id: 'Goodbody051',
    name: 'Hepatitis Screening',
    price: 129,
    description: 'Screen for Hepatitis B and C infections',
    biomarkers: 3,
    turnaround: '3-5 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/hepatitis-screening-blood-test/'
  },
  {
    id: 'Goodbody055',
    name: 'Coeliac Disease',
    price: 179,
    description: 'Screen for coeliac disease',
    biomarkers: 2,
    turnaround: '3-5 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/coeliac-screen-blood-test/'
  },
  {
    id: 'Goodbody054',
    name: 'Autoimmune Disease',
    price: 379,
    description: 'Comprehensive autoimmune screening',
    biomarkers: 6,
    turnaround: '5-7 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/general-health-blood-tests/?rc_page=6'
  },
  {
    id: 'Goodbody119',
    name: 'Pylori',
    price: 105,
    description: 'H. pylori bacteria screening',
    biomarkers: 1,
    turnaround: '3-5 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/helicobacter-pylori-blood-test/'
  },

  // Allergy & Fatigue
  {
    id: 'Goodbody063',
    name: 'Complete Allergy',
    price: 399,
    description: 'Comprehensive allergy panel testing',
    biomarkers: 300,
    turnaround: '5-7 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/complete-allergy-blood-test/'
  },
  {
    id: 'Goodbody065',
    name: 'Tiredness & Fatigue',
    price: 139,
    description: 'Find the cause of chronic fatigue',
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/tiredness-and-fatigue-blood-test/'
  },

  // Sports & Fitness
  {
    id: 'Goodbody073',
    name: 'Sports & Fitness',
    price: 139,
    description: 'Optimize athletic performance and recovery',
    biomarkers: 18,
    turnaround: '2-3 days',
    categories: ['general-wellness'],
    url: 'https://health.goodbodyclinic.com/product/sports-and-fitness-blood-test/'
  },

  // ========== Prenatal & Pregnancy Testing ==========
  {
    id: 'Goodbody150',
    name: 'Prenatal Paternity Test',
    price: 399,
    description: 'Non-invasive prenatal paternity test using cell-free fetal DNA from a simple blood sample. Accurate results from 8 weeks of pregnancy to determine biological father.',
    biomarkers: 1,
    turnaround: '7-10 working days',
    categories: ['fertility', 'prenatal-paternity-tests'],
    url: '/tests/prenatal-paternity'
  },
  {
    id: 'Goodbody151',
    name: 'Gender Reveal Blood Test',
    price: 79,
    description: 'Early gender determination blood test from 8 weeks pregnancy. Non-invasive test analyzing fetal DNA in maternal blood to reveal baby\'s sex.',
    biomarkers: 1,
    turnaround: '3-5 working days',
    categories: ['fertility', 'gender-reveal-tests'],
    url: '/tests/gender-reveal'
  },
  {
    id: 'Goodbody152',
    name: 'PrenatalSAFE 3 NIPT Blood Test',
    price: 349,
    description: 'Non-invasive prenatal test screening for the 3 most common trisomies (Down syndrome/T21, Edwards syndrome/T18, Patau syndrome/T13). Safe for mother and baby.',
    biomarkers: 3,
    turnaround: '7-10 working days',
    categories: ['fertility', 'nipt-tests'],
    url: '/tests/prenatalsafe-3'
  },
  {
    id: 'Goodbody153',
    name: 'PrenatalSAFE 5 NIPT Blood Test',
    price: 449,
    description: 'Extended NIPT screening covering 5 chromosome conditions including trisomies 21, 18, 13 plus sex chromosome aneuploidies (Turner and Klinefelter syndromes).',
    biomarkers: 5,
    turnaround: '7-10 working days',
    categories: ['fertility', 'nipt-tests'],
    url: '/tests/prenatalsafe-5'
  },
  {
    id: 'Goodbody154',
    name: 'PrenatalSAFE Karyo NIPT Blood Test',
    price: 599,
    description: 'Comprehensive chromosomal analysis screening all 23 chromosome pairs for numerical abnormalities. Most detailed non-invasive prenatal screening available.',
    biomarkers: 23,
    turnaround: '10-14 working days',
    categories: ['fertility', 'nipt-tests'],
    url: '/tests/prenatalsafe-karyo'
  },
  {
    id: 'Goodbody155',
    name: 'PrenatalSAFE Karyo Plus NIPT Blood Test',
    price: 699,
    description: 'Advanced karyotype screening plus microdeletion syndromes. Screens all chromosomes and 9 common genetic microdeletion conditions including DiGeorge and Prader-Willi.',
    biomarkers: 32,
    turnaround: '10-14 working days',
    categories: ['fertility', 'nipt-tests'],
    url: '/tests/prenatalsafe-karyo-plus'
  },
  {
    id: 'Goodbody156',
    name: 'PrenatalSAFE Complete Plus NIPT Blood Test',
    price: 799,
    description: 'Most comprehensive NIPT available. Complete chromosome screening, microdeletions, and genetic syndrome panel. Includes follow-up genetic counseling.',
    biomarkers: 43,
    turnaround: '10-14 working days',
    categories: ['fertility', 'nipt-tests'],
    url: '/tests/prenatalsafe-complete-plus'
  }
];

// Helper function to get tests by category
export const getTestsByCategory = (category: string): GoodbodyTest[] => {
  return goodbodyTests.filter(test => test.categories.includes(category));
};

// Helper function to get tests for navigation dropdowns
export const getTestsForNavigation = (navItem: string): GoodbodyTest[] => {
  const categoryMap: Record<string, string[]> = {
    'WOMEN\'S HEALTH': ['womens-health', 'fertility', 'hormones'],
    'MEN\'S HEALTH': ['mens-health', 'hormones'],
    'HORMONES': ['hormones', 'thyroid', 'fertility'],
    'THYROID': ['thyroid', 'hormones'],
    'MOST POPULAR TESTS': ['general-wellness', 'vitamins', 'thyroid', 'hormones'],
    'AT-HOME TESTS': ['general-wellness', 'vitamins', 'thyroid', 'hormones'],
    'CANCER SCREENING': ['cancer-screening', 'general-wellness'],
    'GENERAL WELLNESS': ['general-wellness', 'vitamins', 'heart-health', 'hormones', 'thyroid']
  };

  const categories = categoryMap[navItem] || ['general-wellness'];
  const tests = categories.flatMap(category => getTestsByCategory(category));
  
  // Remove duplicates based on test ID
  const uniqueTests = tests.filter((test, index, self) => 
    index === self.findIndex(t => t.id === test.id)
  );
  
  // Limit to 8 tests for dropdown display
  return uniqueTests.slice(0, 8);
};