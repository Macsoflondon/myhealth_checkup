import { Dumbbell, Activity, Zap, TrendingUp, FlaskConical } from 'lucide-react';

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
    link: '/compare?category=fitness-health'
  }
];

// Bodybuilding Profile Test Data
export interface BodybuildingTest {
  id: string;
  name: string;
  provider: string;
  price: number;
  originalPrice?: number;
  turnaroundTime: string;
  biomarkerCount: number;
  biomarkers: string[];
  description: string;
  whoShouldTest: string[];
  sampleType: string;
  url: string;
  features: {
    phlebotomyIncluded: boolean;
    homeKitAvailable: boolean;
    clinicVisitAvailable: boolean;
  };
}

export const bodybuildingTests: BodybuildingTest[] = [
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
    features: {
      phlebotomyIncluded: true,
      homeKitAvailable: false,
      clinicVisitAvailable: true
    }
  }
];
