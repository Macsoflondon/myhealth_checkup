
interface ProviderTestData {
  id: string;
  name: string;
  provider: string;
  price: number;
  description: string;
  biomarkers: string[];
  turnaround: string;
  collection: string;
  features: Record<string, boolean | string>;
  availability: boolean;
  lastUpdated: Date;
}

interface CategoryTestData {
  category: string;
  totalTests: number;
  totalProviders: number;
  priceRange: { min: number; max: number };
  tests: ProviderTestData[];
}

export class LiveProviderService {
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static cache = new Map<string, { data: CategoryTestData; timestamp: number }>();

  // Major UK private health providers
  private static readonly PROVIDERS = [
    'Medichecks',
    'Thriva', 
    'Randox Health',
    'Blue Horizon',
    'Spire Healthcare',
    'Nuffield Health',
    'BMI Healthcare',
    'Private Blood Tests',
    'London Blood Tests',
    'Goodbody Clinic'
  ];

  // Simulated live data fetching - in real implementation, this would call actual APIs
  static async fetchCategoryData(category: string): Promise<CategoryTestData> {
    const cacheKey = category;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const categoryData = this.generateCategoryData(category);
    
    this.cache.set(cacheKey, {
      data: categoryData,
      timestamp: Date.now()
    });

    return categoryData;
  }

  private static generateCategoryData(category: string): CategoryTestData {
    const testsByCategory = {
      'cancer-screening': this.generateCancerTests(),
      'heart-health': this.generateHeartTests(),
      'mens-health': this.generateMensHealthTests(),
      'womens-health': this.generateWomensHealthTests(),
      'diabetes': this.generateDiabetesTests(),
      'gut-health': this.generateGutHealthTests(),
      'hormones': this.generateHormoneTests(),
      'vitamins': this.generateVitaminTests(),
      'blood-tests': this.generateBloodTests(),
      'weight-loss': this.generateWeightLossTests()
    };

    const tests = testsByCategory[category as keyof typeof testsByCategory] || [];
    const prices = tests.map(t => t.price).filter(p => p > 0);
    
    return {
      category,
      totalTests: tests.length,
      totalProviders: new Set(tests.map(t => t.provider)).size,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      tests
    };
  }

  private static generateCancerTests(): ProviderTestData[] {
    const tests = [
      'Prostate Cancer Screening (PSA + Digital Exam)',
      'Bowel Cancer Screening (FIT Test + Colonoscopy)',
      'Breast Cancer Screening (Mammography + Ultrasound)',
      'Cervical Cancer Screening (HPV + Cytology)',
      'Lung Cancer Screening (Low-dose CT)',
      'Skin Cancer Check (Full Body Mole Mapping)',
      'Ovarian Cancer Screening (CA-125 + Ultrasound)',
      'Comprehensive Cancer Panel (Multi-marker blood test)'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 5) + 3).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 400) + 100,
        description: `Comprehensive ${test.toLowerCase()} with detailed analysis`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 3) + 3} days`,
        collection: Math.random() > 0.5 ? 'Home kit or clinic' : 'Clinic only',
        features: {
          doctorReview: true,
          detailedReport: true,
          followUp: Math.random() > 0.3
        },
        availability: Math.random() > 0.1,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateHeartTests(): ProviderTestData[] {
    const tests = [
      'Comprehensive Cholesterol Profile',
      'Cardiac Risk Assessment',
      'ECG + Exercise Stress Test',
      'Heart Health Blood Panel',
      'Coronary Calcium Score CT',
      'Advanced Lipid Profile'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 4) + 4).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 300) + 80,
        description: `Advanced ${test.toLowerCase()} for cardiovascular health assessment`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 2) + 2} days`,
        collection: 'Home kit or clinic',
        features: {
          doctorReview: true,
          riskAssessment: true,
          lifestyleAdvice: Math.random() > 0.4
        },
        availability: Math.random() > 0.05,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateMensHealthTests(): ProviderTestData[] {
    const tests = [
      'Testosterone Level Assessment',
      'Male Fertility Panel',
      'Prostate Health Check',
      'Male Hormone Profile',
      'Men\'s Comprehensive Health Screen',
      'Male Sexual Health Assessment'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 4) + 3).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 250) + 70,
        description: `Specialized ${test.toLowerCase()} for men's health optimization`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 3) + 2}-${Math.floor(Math.random() * 2) + 3} days`,
        collection: Math.random() > 0.6 ? 'Home kit' : 'Home kit or clinic',
        features: {
          doctorReview: true,
          personalizedAdvice: true,
          followUpSupport: Math.random() > 0.5
        },
        availability: Math.random() > 0.08,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateWomensHealthTests(): ProviderTestData[] {
    const tests = [
      'Female Fertility Assessment',
      'PCOS Screening Panel',
      'Menopause Hormone Profile',
      'Women\'s Health Comprehensive Screen',
      'Reproductive Hormone Panel',
      'Thyroid & Female Hormones'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 5) + 4).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 280) + 90,
        description: `Comprehensive ${test.toLowerCase()} for women's health optimization`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 2) + 2} days`,
        collection: 'Home kit or clinic',
        features: {
          doctorReview: true,
          personalizedReport: true,
          nutritionalGuidance: Math.random() > 0.4
        },
        availability: Math.random() > 0.06,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateDiabetesTests(): ProviderTestData[] {
    const tests = [
      'HbA1c Diabetes Test',
      'Glucose Tolerance Test',
      'Insulin Resistance Assessment',
      'Comprehensive Diabetes Panel',
      'Pre-diabetes Screening'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 3) + 4).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 150) + 40,
        description: `Accurate ${test.toLowerCase()} for diabetes management`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 2) + 2} days`,
        collection: 'Home kit or clinic',
        features: {
          doctorReview: true,
          dietaryAdvice: true,
          monitoringGuidance: Math.random() > 0.3
        },
        availability: Math.random() > 0.04,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateGutHealthTests(): ProviderTestData[] {
    const tests = [
      'Comprehensive Gut Microbiome Analysis',
      'Food Intolerance Panel',
      'SIBO Breath Test',
      'Inflammatory Bowel Markers',
      'Digestive Health Assessment',
      'Celiac Disease Screening'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 3) + 3).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 200) + 80,
        description: `Advanced ${test.toLowerCase()} for digestive health optimization`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 5) + 2}-${Math.floor(Math.random() * 3) + 4} days`,
        collection: Math.random() > 0.7 ? 'Home kit' : 'Home kit or clinic',
        features: {
          doctorReview: true,
          dietaryRecommendations: true,
          probioticAdvice: Math.random() > 0.4
        },
        availability: Math.random() > 0.1,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateHormoneTests(): ProviderTestData[] {
    const tests = [
      'Comprehensive Thyroid Panel',
      'Cortisol Stress Assessment',
      'Complete Hormone Profile',
      'Adrenal Function Test',
      'Sex Hormone Analysis'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 4) + 4).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 180) + 60,
        description: `Detailed ${test.toLowerCase()} for hormonal balance assessment`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 2) + 3} days`,
        collection: 'Home kit or clinic',
        features: {
          doctorReview: true,
          hormoneOptimization: true,
          lifestyleGuidance: Math.random() > 0.4
        },
        availability: Math.random() > 0.07,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateVitaminTests(): ProviderTestData[] {
    const tests = [
      'Comprehensive Vitamin Panel',
      'Vitamin D Assessment',
      'B-Vitamin Complex Analysis',
      'Mineral Deficiency Screen',
      'Antioxidant Status Test'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 4) + 3).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 120) + 30,
        description: `Complete ${test.toLowerCase()} for nutritional optimization`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 2) + 2} days`,
        collection: 'Home kit',
        features: {
          doctorReview: true,
          supplementRecommendations: true,
          nutritionalAdvice: Math.random() > 0.3
        },
        availability: Math.random() > 0.05,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateBloodTests(): ProviderTestData[] {
    const tests = [
      'Full Blood Count + Biochemistry',
      'Comprehensive Health Screen',
      'Executive Health Panel',
      'Complete Blood Analysis',
      'Advanced Biomarker Panel'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 5) + 5).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 200) + 50,
        description: `Comprehensive ${test.toLowerCase()} for complete health assessment`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 2) + 2} days`,
        collection: 'Home kit or clinic',
        features: {
          doctorReview: true,
          detailedAnalysis: true,
          healthInsights: Math.random() > 0.2
        },
        availability: Math.random() > 0.03,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateWeightLossTests(): ProviderTestData[] {
    const tests = [
      'Metabolic Health Assessment',
      'Weight Management Program',
      'GLP-1 Treatment Consultation',
      'Body Composition Analysis'
    ];

    return tests.flatMap(test => 
      this.PROVIDERS.slice(0, Math.floor(Math.random() * 3) + 2).map(provider => ({
        id: `${test.toLowerCase().replace(/\s+/g, '-')}-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        name: test,
        provider,
        price: Math.floor(Math.random() * 300) + 100,
        description: `Advanced ${test.toLowerCase()} for effective weight management`,
        biomarkers: this.generateBiomarkers(test),
        turnaround: `${Math.floor(Math.random() * 2) + 1}-${Math.floor(Math.random() * 2) + 2} days`,
        collection: 'Clinic consultation',
        features: {
          doctorReview: true,
          personalizedPlan: true,
          ongoingSupport: Math.random() > 0.3
        },
        availability: Math.random() > 0.1,
        lastUpdated: new Date()
      }))
    );
  }

  private static generateBiomarkers(testName: string): string[] {
    const biomarkersByTest: Record<string, string[]> = {
      'cancer': ['PSA', 'CEA', 'CA-125', 'CA 19-9', 'AFP'],
      'heart': ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'CRP'],
      'hormone': ['TSH', 'T3', 'T4', 'Cortisol', 'Testosterone', 'Estradiol'],
      'vitamin': ['Vitamin D', 'B12', 'Folate', 'Iron', 'Ferritin'],
      'diabetes': ['HbA1c', 'Glucose', 'Insulin', 'C-peptide'],
      'liver': ['ALT', 'AST', 'GGT', 'Bilirubin', 'Albumin']
    };

    const testType = Object.keys(biomarkersByTest).find(key => 
      testName.toLowerCase().includes(key)
    ) || 'general';

    return biomarkersByTest[testType] || ['Complete Blood Count', 'Basic Metabolic Panel'];
  }

  static async searchTests(query: string): Promise<ProviderTestData[]> {
    // In a real implementation, this would search across all provider APIs
    const allCategories = await Promise.all([
      this.fetchCategoryData('cancer-screening'),
      this.fetchCategoryData('heart-health'),
      this.fetchCategoryData('mens-health'),
      this.fetchCategoryData('womens-health'),
      this.fetchCategoryData('diabetes'),
      this.fetchCategoryData('gut-health'),
      this.fetchCategoryData('hormones'),
      this.fetchCategoryData('vitamins'),
      this.fetchCategoryData('blood-tests'),
      this.fetchCategoryData('weight-loss')
    ]);

    const allTests = allCategories.flatMap(category => category.tests);
    
    return allTests.filter(test => 
      test.name.toLowerCase().includes(query.toLowerCase()) ||
      test.provider.toLowerCase().includes(query.toLowerCase()) ||
      test.biomarkers.some(marker => marker.toLowerCase().includes(query.toLowerCase()))
    );
  }
}
