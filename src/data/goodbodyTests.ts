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
    categories: ['general-wellness', 'vitamins', 'advanced-vitamins-tests'],
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
    categories: ['general-wellness', 'heart-health', 'cholesterol-tests'],
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
    categories: ['general-wellness', 'diabetes', 'diabetes-tests'],
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
    categories: ['general-wellness', 'vitamins', 'vitamins-tests'],
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
    categories: ['general-wellness', 'coeliac-tests', 'allergy-testing'],
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
    categories: ['general-wellness', 'allergy-testing'],
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
  },
  
  // Weight Loss & Metabolic Health
  {
    id: 'Goodbody160',
    name: 'Weight Loss Blood Test',
    price: 89,
    description: 'Comprehensive metabolic screening including thyroid function, hormones, and nutritional markers affecting weight management',
    biomarkers: 20,
    turnaround: '2-3 days',
    categories: ['general-wellness', 'weight-loss-tests', 'thyroid-tests', 'hormones'],
    url: '/tests/weight-loss'
  },

  // ========== Cancer Screening Tests ==========
  {
    id: 'Goodbody200',
    name: 'TruCheck Intelli 70 Organ Early Cancer Screening',
    price: 1199,
    description: 'Our most comprehensive cancer test to detect up to 70 types of solid cancer tumours including Melanoma, Head and Neck, Thyroid, Lung, Breast, Liver and many more. Includes doctor pre-consultation.',
    biomarkers: 70,
    turnaround: '2-3 weeks',
    categories: ['cancer-screening'],
    url: 'https://health.goodbodyclinic.com/product/early-cancer-screening-blood-test/'
  },
  {
    id: 'Goodbody201',
    name: 'Complete Hereditary Cancer DNA Test',
    price: 799,
    description: 'DNA test using saliva sample to determine genetic mutations that increase cancer risk. Tests for bowel, breast, prostate, skin, and cardiac hereditary cancers.',
    biomarkers: 50,
    turnaround: '3-4 weeks',
    categories: ['cancer-screening'],
    url: 'https://health.goodbodyclinic.com/product/hereditary-cancer-dna-test/'
  },
  {
    id: 'Goodbody202',
    name: 'Lung Cancer Screening Test',
    price: 340,
    description: 'At-home finger prick test to detect circulating autoantibodies generated by the immune system as defence against lung cancer. Detects lung cancer 4-9 years before standard clinical diagnosis.',
    biomarkers: 7,
    turnaround: '2-3 weeks',
    categories: ['cancer-screening'],
    url: 'https://health.goodbodyclinic.com/product/lung-cancer-screening-test/'
  },
  {
    id: 'Goodbody203',
    name: 'HPV Cervical Cancer Screening Home Test',
    price: 165,
    description: 'Discreet home test detecting 24 high-risk HPV types, the major cause of cervical cancer in women. Detects HPV 16, 18 and 22 other high-risk types.',
    biomarkers: 24,
    turnaround: '3 days',
    categories: ['cancer-screening', 'womens-health'],
    url: 'https://health.goodbodyclinic.com/product/hpv-cervical-cancer-screening-home-test/'
  },
  {
    id: 'Goodbody204',
    name: 'Bowel Cancer Screening Test (FIT)',
    price: 69,
    description: 'Discreet home test to check for occult blood in faeces, which can indicate colon cancer, bowel cancer, polyps, colitis or diverticulitis. Bowel cancer is one of the easiest cancers to cure if caught early.',
    biomarkers: 1,
    turnaround: '3-5 working days',
    categories: ['cancer-screening'],
    url: 'https://health.goodbodyclinic.com/product/bowel-cancer-screening-test/'
  },
  {
    id: 'Goodbody205',
    name: 'EpiSwitch PSE Prostate Cancer Test',
    price: 885,
    description: 'Advanced blood test to detect prostate cancer with 94% accuracy. Taken alongside or following a standard PSA test for better-informed decision making about next steps.',
    biomarkers: 5,
    turnaround: '3-5 days',
    categories: ['cancer-screening', 'mens-health'],
    url: 'https://health.goodbodyclinic.com/product/episwitch-pse-advanced-blood-test/'
  },
  {
    id: 'Goodbody206',
    name: 'Stockholm3 Prostate Cancer Screening',
    price: 495,
    description: 'Blood test measuring 5 protein markers and multiple genetic markers, resulting in a risk score indicating likelihood of aggressive prostate cancer that may spread.',
    biomarkers: 8,
    turnaround: '2-3 weeks',
    categories: ['cancer-screening', 'mens-health'],
    url: 'https://health.goodbodyclinic.com/product/stockholm3-prostate-cancer-screening-blood-test/'
  },
  {
    id: 'Goodbody207',
    name: 'Prostate PSA Cancer Blood Test',
    price: 69,
    description: 'Standard PSA screening for prostate health and cancer detection. Simple blood test to measure prostate-specific antigen levels.',
    biomarkers: 1,
    turnaround: '2-3 days',
    categories: ['cancer-screening', 'mens-health'],
    url: 'https://health.goodbodyclinic.com/product/prostate-psa-blood-test/'
  },
  {
    id: 'Goodbody208',
    name: 'Guardant Reveal™',
    price: 1499,
    description: 'Advanced blood test for cancer recurrence monitoring and treatment response assessment. Detects minimal residual disease and circulating tumour DNA.',
    biomarkers: 18,
    turnaround: '2-3 weeks',
    categories: ['cancer-screening'],
    url: 'https://health.goodbodyclinic.com/product/guardant-reveal-cancer-test/'
  },
  {
    id: 'Goodbody209',
    name: 'Guardant360 CDx',
    price: 1999,
    description: 'Comprehensive genomic profiling for advanced-stage cancer therapy selection. FDA-approved companion diagnostic for targeted cancer treatments.',
    biomarkers: 74,
    turnaround: '2-3 weeks',
    categories: ['cancer-screening'],
    url: 'https://health.goodbodyclinic.com/product/guardant-360-cancer-test/'
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
    'CANCER SCREENING': ['cancer-screening'],
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