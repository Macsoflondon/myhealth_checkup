import { Dumbbell, Activity, Zap, TrendingUp, FlaskConical, Bike, Timer, PersonStanding } from 'lucide-react';

export interface FitnessCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  testCount: number;
  link: string;
}

export const fitnessHealthCategories: FitnessCategory[] = [
  {
    id: 'bodybuilding',
    name: 'Bodybuilding Profile',
    icon: Dumbbell,
    description: 'Comprehensive panel for bodybuilders monitoring hormones, liver, kidney function, and recovery markers',
    color: '#E70D69',
    testCount: 21,
    link: '/compare?category=fitness-health&test=bodybuilding'
  },
  {
    id: 'athletic-performance',
    name: 'Athletic Performance Optimization',
    icon: TrendingUp,
    description: 'Comprehensive biomarker analysis for peak athletic performance and muscle function',
    color: '#FA6980',
    testCount: 12,
    link: '/compare?category=fitness-health'
  },
  {
    id: 'endurance-recovery',
    name: 'Endurance & Recovery Testing',
    icon: Activity,
    description: 'Monitor recovery markers, inflammation, and endurance capacity for optimal training',
    color: '#22C0D4',
    testCount: 8,
    link: '/compare?category=fitness-health'
  },
  {
    id: 'sports-nutrition',
    name: 'Sports Nutrition Analysis',
    icon: Zap,
    description: 'Assess vitamin, mineral, and nutritional status to fuel athletic excellence',
    color: '#3A5F85',
    testCount: 15,
    link: '/compare?category=fitness-health'
  },
  {
    id: 'performance-optimization',
    name: 'Performance Optimization',
    icon: FlaskConical,
    description: 'Advanced testing for competitive athletes seeking data-driven performance gains',
    color: '#081129',
    testCount: 6,
    link: '/compare?category=fitness-health&test=performance-optimization'
  }
];

// Fitness Health Test Interface
export interface FitnessTest {
  id: string;
  name: string;
  provider: string;
  price: number;
  subscriptionPrice?: number;
  turnaroundTime: string;
  biomarkerCount: number;
  biomarkers: string[];
  description: string;
  whoShouldTest: string[];
  sampleType: string;
  url: string;
  category: 'bodybuilding' | 'cycling' | 'running' | 'weightlifting' | 'general-athlete';
  features: {
    phlebotomyIncluded: boolean;
    homeKitAvailable: boolean;
    clinicVisitAvailable: boolean;
    sportsDoctorReview?: boolean;
    nhsLabAnalysis?: boolean;
    subscriptionAvailable?: boolean;
  };
}

// Alias for backward compatibility
export type BodybuildingTest = FitnessTest;

export const bodybuildingTests: FitnessTest[] = [
  {
    id: 'medical-diagnosis-bodybuilder-profile',
    name: 'Bodybuilder Profile',
    provider: 'Medical Diagnosis',
    price: 155,
    turnaroundTime: '4 hours',
    biomarkerCount: 21,
    biomarkers: [
      'Testosterone',
      'Free Testosterone (Calculated)',
      'Albumin',
      'Sex Hormone Binding Globulin (SHBG)',
      'Estradiol (E2)',
      'Luteinizing Hormone (LH)',
      'Follicle-Stimulating Hormone (FSH)',
      'Thyroid-Stimulating Hormone (TSH)',
      'Glycated Haemoglobin (HbA1c)',
      'Triglycerides',
      'Cholesterol Total',
      'HDL Cholesterol',
      'LDL Cholesterol',
      'Alanine Aminotransferase (ALT)',
      'Aspartate Aminotransferase (AST)',
      'Gamma-Glutamyl Transferase (GGT)',
      'Bilirubin Total',
      'Urea',
      'Creatinine',
      'Uric Acid',
      'Full Blood Count (FBC) + Differential'
    ],
    description: 'Bodybuilding places unique demands on the body\'s hormonal, metabolic, and organ systems. This comprehensive profile monitors liver and kidney function, lipid balance, red blood cell production, and hormone regulation to detect imbalances early and ensure safe progress.',
    whoShouldTest: [
      'Bodybuilders following advanced weight training or physique competition programmes',
      'Individuals using or considering anabolic steroids or testosterone-enhancing substances',
      'Those experiencing fatigue, mood swings, acne, or reduced performance',
      'Athletes tracking effects of supplementation, training load, or cutting/bulking cycles'
    ],
    sampleType: 'Blood',
    url: 'https://www.medical-diagnosis.co.uk/exam/profiles/health-checks-profiles/bodybuilder-profile/',
    category: 'bodybuilding',
    features: {
      phlebotomyIncluded: true,
      homeKitAvailable: false,
      clinicVisitAvailable: true
    }
  },
  {
    id: 'medlabs-bodybuilding-profile',
    name: 'Bodybuilding Profile',
    provider: 'MedLabs UK',
    price: 240,
    turnaroundTime: '24 hours',
    biomarkerCount: 45,
    biomarkers: [
      'Full Blood Count (FBC)',
      'ESR',
      'Urea',
      'Creatinine',
      'Sodium',
      'Uric Acid',
      'LDH',
      'Bilirubin',
      'Alkaline Phosphatase (ALP)',
      'ALT',
      'Creatine Kinase (CK)',
      'Gamma GT',
      'Protein',
      'Total Protein',
      'Albumin',
      'Globulin',
      'HbA1c',
      'Iron',
      'Ferritin',
      'Triglycerides',
      'Cholesterol',
      'HDL Cholesterol',
      'LDL Cholesterol',
      'Non-HDL Cholesterol',
      'TSH',
      'Free T4',
      'Free T3',
      'TPO Antibodies',
      'Testosterone',
      'Oestradiol (Estrogen)',
      'SHBG',
      'Prolactin',
      'FSH',
      'LH',
      'DHEA-S',
      'Progesterone',
      'Cortisol',
      'Vitamin D3 (25-OH)',
      'Folate',
      'Active Vitamin B12'
    ],
    description: 'Comprehensive blood test panel tailored specifically for bodybuilders, strength athletes, and fitness enthusiasts. Monitors health, performance, and recovery with essential markers across multiple systems including hormones, liver, kidney, thyroid, and vitamins.',
    whoShouldTest: [
      'Competitive bodybuilders',
      'Recreational lifters and strength athletes',
      'Anyone fine-tuning training and nutrition strategies based on real data',
      'Athletes monitoring the effects of high-intensity training or performance enhancers'
    ],
    sampleType: 'Blood',
    url: 'https://medlabs.uk/product/bodybuilding/',
    category: 'bodybuilding',
    features: {
      phlebotomyIncluded: true,
      homeKitAvailable: false,
      clinicVisitAvailable: true
    }
  }
];

// Athlete Tests from Sports Blood Tests (Edge)
export const athleteTests: FitnessTest[] = [
  {
    id: 'edge-male-cyclist',
    name: 'Blood Test for Male Cyclists',
    provider: 'Sports Blood Tests (Edge)',
    price: 129,
    subscriptionPrice: 116,
    turnaroundTime: '2 working days',
    biomarkerCount: 18,
    biomarkers: [
      'Active B12',
      'Cortisol (9am)',
      'Creatine Kinase',
      'Creatinine',
      'eGFR',
      'Ferritin',
      'Haemoglobin',
      'hs-CRP',
      'Luteinising Hormone',
      'Prolactin',
      'Red Blood Cell (RBC)',
      'Testosterone (total)',
      'Thyroid Stimulating Hormone',
      'Thyroxine (T4, free direct)',
      'Triiodothyronine (T3, free)',
      'Urea',
      'Vitamin D (25 OH)',
      'White Blood Cell Count'
    ],
    description: 'Unlock your cycling potential with our sports blood test for male cyclists. It provides accurate insights into your body\'s performance and recovery, allowing you to optimise your training – whether it\'s nutrition, recovery, or muscle performance.',
    whoShouldTest: [
      'Amateur and professional cyclists',
      'Athletes training for endurance events',
      'Those experiencing performance plateaus',
      'Cyclists monitoring recovery and training adaptation'
    ],
    sampleType: 'Finger Prick',
    url: 'https://www.sportsbloodtests.co.uk/blood-tests/cyclists/cyclist-male/',
    category: 'cycling',
    features: {
      phlebotomyIncluded: false,
      homeKitAvailable: true,
      clinicVisitAvailable: false,
      sportsDoctorReview: true,
      nhsLabAnalysis: true,
      subscriptionAvailable: true
    }
  },
  {
    id: 'edge-male-runner',
    name: 'Blood Test for Male Runners',
    provider: 'Sports Blood Tests (Edge)',
    price: 129,
    subscriptionPrice: 116,
    turnaroundTime: '2 working days',
    biomarkerCount: 18,
    biomarkers: [
      'Active B12',
      'Cortisol (9am)',
      'Creatine Kinase',
      'Creatinine',
      'eGFR',
      'Ferritin',
      'Haemoglobin',
      'hs-CRP',
      'Luteinising Hormone',
      'Prolactin',
      'Red Blood Cell',
      'Testosterone (total)',
      'Thyroid Stimulating Hormone (TSH)',
      'Thyroxine (T4, free direct)',
      'Triiodothyronine (T3, free)',
      'Urea',
      'Vitamin D (25 OH)',
      'White Blood Cell Count'
    ],
    description: 'Whether you\'re a seasoned runner or just starting your journey, achieving peak performance requires a deep understanding of your body\'s unique responses to training and recovery. Our Male Runner home blood test provides actionable insights to optimise your performance.',
    whoShouldTest: [
      'Marathon and long-distance runners',
      'Recreational runners seeking performance gains',
      'Athletes recovering from injury',
      'Runners experiencing fatigue or performance decline'
    ],
    sampleType: 'Finger Prick',
    url: 'https://www.sportsbloodtests.co.uk/blood-tests/runners/runner-male/',
    category: 'running',
    features: {
      phlebotomyIncluded: false,
      homeKitAvailable: true,
      clinicVisitAvailable: false,
      sportsDoctorReview: true,
      nhsLabAnalysis: true,
      subscriptionAvailable: true
    }
  },
  {
    id: 'edge-male-weightlifter',
    name: 'Blood Test for Male Weightlifters',
    provider: 'Sports Blood Tests (Edge)',
    price: 125,
    subscriptionPrice: 112,
    turnaroundTime: '2 working days',
    biomarkerCount: 17,
    biomarkers: [
      'Active B12',
      'Alanine Aminotransferase (ALT)',
      'Albumin',
      'Cortisol (9am)',
      'Creatine Kinase',
      'Creatinine',
      'eGFR',
      'Follicle Stimulating Hormone',
      'Free Testosterone (calculated)',
      'hs-CRP',
      'Luteinising Hormone',
      'Oestradiol (Oestrogen)',
      'Prolactin',
      'Sex Hormone-Binding Globulin',
      'Testosterone (total)',
      'Urea',
      'Vitamin D (25 OH)'
    ],
    description: 'Track key biomarkers affecting strength, recovery, and hormones with our at-home bodybuilder blood test. It measures testosterone, stress, inflammation, and essential nutrients to help you optimise muscle growth, endurance, and injury prevention.',
    whoShouldTest: [
      'Weightlifters and powerlifters',
      'Bodybuilders at all levels',
      'Strength training enthusiasts',
      'Athletes monitoring hormone balance and recovery'
    ],
    sampleType: 'Finger Prick',
    url: 'https://www.sportsbloodtests.co.uk/blood-tests/weightlifters/weightlifter-male/',
    category: 'weightlifting',
    features: {
      phlebotomyIncluded: false,
      homeKitAvailable: true,
      clinicVisitAvailable: false,
      sportsDoctorReview: true,
      nhsLabAnalysis: true,
      subscriptionAvailable: true
    }
  }
];

// Performance Optimization Tests
export const performanceOptimizationTests: FitnessTest[] = [
  {
    id: 'goodbody-sports-fitness',
    name: 'Sports and Fitness Blood Test',
    provider: 'Good Body Clinic',
    price: 99,
    turnaroundTime: '2-3 working days',
    biomarkerCount: 11,
    biomarkers: [
      'Albumin',
      'DHEA-Sulphate',
      'Follicular Stimulating Hormone (FSH)',
      'Free Androgen Index',
      'Free Testosterone (Calculated)',
      'Luteinizing Hormone (LH)',
      'Oestradiol',
      'Prolactin',
      'Sex Hormone Binding Globulin (SHBG)',
      'Testosterone',
      'Progesterone'
    ],
    description: 'Comprehensive sports blood test checking key hormones and proteins for sports performance and fitness. Hormones impact fitness levels, fat storage, muscle mass, bone strength and endurance. Ideal for athletes, bodybuilders, gym enthusiasts and anyone wanting to optimise their training.',
    whoShouldTest: [
      'Athletes and fitness enthusiasts',
      'Bodybuilders and gym-goers',
      'Those struggling with low energy or slow recovery',
      'Anyone wanting to optimise sports performance'
    ],
    sampleType: 'Blood (Finger Prick or Venous)',
    url: 'https://goodbodyclinic.com/products/sports-and-fitness-blood-test',
    category: 'general-athlete',
    features: {
      phlebotomyIncluded: false,
      homeKitAvailable: true,
      clinicVisitAvailable: true
    }
  }
];

// Combined all fitness tests
export const allFitnessTests: FitnessTest[] = [...bodybuildingTests, ...athleteTests, ...performanceOptimizationTests];
