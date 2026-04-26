/**
 * Cancer biomarker groupings and clinical significance data
 */

export interface CancerBiomarker {
  id: string;
  name: string;
  description: string;
  clinicalSignificance: string;
  cancerTypes: string[];
  riskGroups: string[];
}

export interface CancerType {
  id: string;
  name: string;
  description: string;
  searchTerms: string[];
  biomarkers: string[];
  riskFactors: string[];
  ageRecommendation?: string;
  gender?: 'male' | 'female' | 'all';
}

export const CANCER_BIOMARKERS: CancerBiomarker[] = [
  {
    id: 'psa-total',
    name: 'PSA (Total)',
    description: 'Prostate-Specific Antigen measures a protein produced by prostate cells.',
    clinicalSignificance: 'Elevated levels may indicate prostate cancer, benign prostatic hyperplasia, or prostatitis.',
    cancerTypes: ['prostate'],
    riskGroups: ['Men over 50', 'Family history of prostate cancer', 'African-Caribbean men over 45'],
  },
  {
    id: 'psa-free',
    name: 'Free PSA',
    description: 'Measures the unbound form of PSA in the blood.',
    clinicalSignificance: 'Free-to-total PSA ratio helps distinguish between cancer and benign conditions.',
    cancerTypes: ['prostate'],
    riskGroups: ['Men with elevated total PSA'],
  },
  {
    id: 'ca125',
    name: 'CA-125',
    description: 'Cancer Antigen 125 is a protein found on the surface of many ovarian cancer cells.',
    clinicalSignificance: 'Elevated levels may indicate ovarian cancer, endometriosis, or other conditions.',
    cancerTypes: ['ovarian'],
    riskGroups: ['Women with family history', 'BRCA gene carriers', 'Post-menopausal women'],
  },
  {
    id: 'cea',
    name: 'CEA',
    description: 'Carcinoembryonic Antigen is a protein that may be elevated in certain cancers.',
    clinicalSignificance: 'Used primarily for monitoring colorectal cancer treatment and recurrence.',
    cancerTypes: ['bowel', 'colorectal', 'lung', 'breast'],
    riskGroups: ['Adults over 50', 'Family history of bowel cancer', 'Smokers'],
  },
  {
    id: 'afp',
    name: 'AFP (Alpha-Fetoprotein)',
    description: 'A protein produced by the liver during fetal development.',
    clinicalSignificance: 'Elevated levels in adults may indicate liver cancer or testicular cancer.',
    cancerTypes: ['liver', 'testicular'],
    riskGroups: ['Chronic hepatitis patients', 'Cirrhosis patients', 'Men aged 15-40'],
  },
  {
    id: 'ca19-9',
    name: 'CA 19-9',
    description: 'Cancer Antigen 19-9 is associated with pancreatic and other gastrointestinal cancers.',
    clinicalSignificance: 'Primarily used for monitoring pancreatic cancer treatment.',
    cancerTypes: ['pancreatic', 'bile-duct', 'stomach'],
    riskGroups: ['Adults with digestive symptoms', 'Chronic pancreatitis patients'],
  },
  {
    id: 'ca15-3',
    name: 'CA 15-3',
    description: 'Cancer Antigen 15-3 is associated with breast cancer.',
    clinicalSignificance: 'Used for monitoring breast cancer treatment and detecting recurrence.',
    cancerTypes: ['breast'],
    riskGroups: ['Women with family history', 'BRCA gene carriers'],
  },
  {
    id: 'fit',
    name: 'FIT (Faecal Immunochemical Test)',
    description: 'Detects hidden blood in stool samples.',
    clinicalSignificance: 'Early indicator of bowel cancer or polyps.',
    cancerTypes: ['bowel', 'colorectal'],
    riskGroups: ['Adults over 50', 'Family history of bowel cancer'],
  },
];

export const CANCER_TYPES: CancerType[] = [
  {
    id: 'all',
    name: 'All Cancer Tests',
    description: 'View all available cancer screening tests',
    searchTerms: ['cancer', 'tumour', 'marker', 'screening', 'oncology'],
    biomarkers: [],
    riskFactors: [],
  },
  {
    id: 'prostate',
    name: 'Prostate Cancer',
    description: 'Screening tests for prostate cancer using PSA markers',
    searchTerms: ['psa', 'prostate', 'male cancer'],
    biomarkers: ['psa-total', 'psa-free'],
    riskFactors: ['Age over 50', 'Family history', 'African-Caribbean heritage'],
    ageRecommendation: 'Men aged 50+',
    gender: 'male',
  },
  {
    id: 'ovarian',
    name: 'Ovarian Cancer',
    description: 'Screening tests for ovarian cancer',
    searchTerms: ['ca125', 'ovarian', 'ovary', 'female cancer'],
    biomarkers: ['ca125'],
    riskFactors: ['Family history', 'BRCA mutations', 'Never been pregnant', 'Endometriosis'],
    ageRecommendation: 'Women aged 50+',
    gender: 'female',
  },
  {
    id: 'bowel',
    name: 'Bowel Cancer',
    description: 'Screening tests for colorectal and bowel cancer',
    searchTerms: ['bowel', 'colorectal', 'colon', 'fit', 'cea'],
    biomarkers: ['cea', 'fit'],
    riskFactors: ['Age over 50', 'Family history', 'Inflammatory bowel disease', 'Diet high in processed meat'],
    ageRecommendation: 'Adults aged 50+',
    gender: 'all',
  },
  {
    id: 'breast',
    name: 'Breast Cancer',
    description: 'Blood markers associated with breast cancer',
    searchTerms: ['breast', 'ca15-3', 'brca'],
    biomarkers: ['ca15-3', 'cea'],
    riskFactors: ['Family history', 'BRCA mutations', 'Dense breast tissue', 'Hormone therapy'],
    ageRecommendation: 'Women aged 40+',
    gender: 'female',
  },
  {
    id: 'liver',
    name: 'Liver Cancer',
    description: 'Screening tests for liver cancer',
    searchTerms: ['liver', 'afp', 'hepatocellular'],
    biomarkers: ['afp'],
    riskFactors: ['Chronic hepatitis B or C', 'Cirrhosis', 'Heavy alcohol use'],
    ageRecommendation: 'At-risk individuals of any age',
    gender: 'all',
  },
  {
    id: 'multi',
    name: 'Multi-Cancer Panels',
    description: 'Comprehensive panels testing multiple cancer markers',
    searchTerms: ['multi-cancer', 'panel', 'comprehensive', 'full'],
    biomarkers: ['psa-total', 'ca125', 'cea', 'afp', 'ca19-9', 'ca15-3'],
    riskFactors: ['General health screening', 'Family history of multiple cancers'],
    gender: 'all',
  },
];

export const CANCER_SEARCH_TERMS = [
  'cancer',
  'psa',
  'ca125',
  'ca 125',
  'cea',
  'afp',
  'tumour',
  'tumor',
  'bowel',
  'prostate',
  'ovarian',
  'breast',
  'liver',
  'colorectal',
  'oncology',
  'marker',
  'ca19-9',
  'ca15-3',
  'screening',
];

export function getCancerTypeById(id: string): CancerType | undefined {
  return CANCER_TYPES.find(type => type.id === id);
}

export function getBiomarkerById(id: string): CancerBiomarker | undefined {
  return CANCER_BIOMARKERS.find(biomarker => biomarker.id === id);
}

export function getBiomarkersForCancerType(cancerTypeId: string): CancerBiomarker[] {
  const cancerType = getCancerTypeById(cancerTypeId);
  if (!cancerType) return [];
  return CANCER_BIOMARKERS.filter(biomarker => 
    cancerType.biomarkers.includes(biomarker.id)
  );
}
