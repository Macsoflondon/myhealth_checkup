// Cancer screening tests across providers
export const cancerScreening = [
  {
    id: "psa-medichecks",
    category: "cancer-screening",
    name: "PSA (Prostate Specific Antigen) Blood Test",
    provider: "Medichecks",
    providerLogo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 45.00,
    features: {
      "Sample type": "Finger-prick or venous",
      "Biomarkers": "Total PSA",
      "Turnaround": "2 working days",
      "Collection": "Home kit or clinic",
      "Doctor review": true,
      "Cancer type": "Prostate"
    }
  },
  {
    id: "qfit-medichecks", 
    category: "cancer-screening",
    name: "qFIT Bowel Cancer Screening Test",
    provider: "Medichecks",
    providerLogo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 55.00,
    features: {
      "Sample type": "At-home stool kit",
      "Biomarkers": "Occult blood in stool",
      "Turnaround": "4 working days", 
      "Collection": "Home kit",
      "Doctor review": true,
      "Cancer type": "Colorectal"
    }
  },
  {
    id: "trucheck-goodbody",
    category: "cancer-screening", 
    name: "TruCheck Intelli 70 Early Cancer Screen",
    provider: "Goodbody",
    providerLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 1199.00,
    features: {
      "Sample type": "Venous blood (in-clinic)",
      "Biomarkers": "18 biomarkers, 70 cancer types",
      "Turnaround": "10-15 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Cancer type": "Multi-cancer panel"
    }
  },
  {
    id: "stockholm3-goodbody",
    category: "cancer-screening",
    name: "Stockholm3 Prostate Screening", 
    provider: "Goodbody",
    providerLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 350.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "Advanced algorithmic PSA-based test",
      "Turnaround": "7 days",
      "Collection": "Clinic only", 
      "Doctor review": true,
      "Cancer type": "Prostate"
    }
  },
  {
    id: "female-cancer-bluecrest",
    category: "cancer-screening",
    name: "Female Cancer Risk Package",
    provider: "Bluecrest",
    providerLogo: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 299.00,
    features: {
      "Sample type": "Venous blood + swabs",
      "Biomarkers": "CA125 (ovarian), HPV (cervical), qFIT (stool)",
      "Turnaround": "1 week",
      "Collection": "Clinic + home kit",
      "Doctor review": true,
      "Cancer type": "Ovarian, cervical, bowel"
    }
  },
  {
    id: "male-cancer-bluecrest",
    category: "cancer-screening",
    name: "Male Cancer Risk Package", 
    provider: "Bluecrest",
    providerLogo: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 279.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "PSA (prostate), CEA, AFP",
      "Turnaround": "1 week",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Cancer type": "Prostate, bowel, liver"
    }
  },
  {
    id: "psa-thriva",
    category: "cancer-screening",
    name: "PSA Blood Test",
    provider: "Thriva", 
    providerLogo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 65.00,
    features: {
      "Sample type": "At-home finger-prick (autodraw device)",
      "Biomarkers": "Total PSA",
      "Turnaround": "48 hours",
      "Collection": "Home kit",
      "Doctor review": true,
      "Cancer type": "Prostate"
    }
  },
  {
    id: "qfit-thriva",
    category: "cancer-screening",
    name: "qFIT Bowel Cancer Test",
    provider: "Thriva",
    providerLogo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200", 
    price: 60.00,
    features: {
      "Sample type": "At-home stool kit",
      "Biomarkers": "Microscopic blood in stool",
      "Turnaround": "48 hours",
      "Collection": "Home kit",
      "Doctor review": true,
      "Cancer type": "Bowel"
    }
  },
  {
    id: "psa-pca3-spire",
    category: "cancer-screening",
    name: "PSA & PCA3 (Prostate Cancer Tests)",
    provider: "Spire",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 100.00,
    features: {
      "Sample type": "Venous blood & urine",
      "Biomarkers": "PSA + PCA3 urine test",
      "Turnaround": "1-3 days PSA, 1 week PCA3",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Cancer type": "Prostate"
    }
  },
  {
    id: "ca125-spire",
    category: "cancer-screening", 
    name: "CA125 Ovarian Cancer Test",
    provider: "Spire",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 130.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "CA125 tumor marker", 
      "Turnaround": "2-3 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Cancer type": "Ovarian"
    }
  },
  {
    id: "multi-cancer-oneday",
    category: "cancer-screening",
    name: "Multi-Marker Cancer Panel",
    provider: "OneDayTests",
    providerLogo: "https://images.unsplash.com/photo-1576669801820-6a486b32a9f7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 299.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "CEA, CA19-9, CA15-3, CA125",
      "Turnaround": "3-5 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Cancer type": "Bowel, pancreatic, breast, ovarian"
    }
  },
  {
    id: "psa-randox",
    category: "cancer-screening",
    name: "Advanced PSA Test",
    provider: "Randox",
    providerLogo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200", 
    price: 99.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "PSA + Prostate Risk Score",
      "Turnaround": "2-3 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Cancer type": "Prostate"
    }
  }
];