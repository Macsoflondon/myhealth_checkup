
export const compareCategories = [
  {
    id: "blood-tests",
    name: "Blood Tests",
    description: "Comprehensive blood analysis and health markers",
    searchTerms: ["blood", "full blood count", "fbc", "biochemistry", "blood panel"]
  },
  {
    id: "hormones",
    name: "Hormone Tests",
    description: "Thyroid, testosterone, and reproductive hormones",
    searchTerms: ["hormone", "hormonal", "testosterone", "estrogen", "progesterone", "cortisol"]
  },
  {
    id: "thyroid",
    name: "Thyroid Tests", 
    description: "Thyroid function and antibody testing",
    searchTerms: ["thyroid", "tsh", "t3", "t4", "thyroglobulin", "thyroid antibodies"]
  },
  {
    id: "vitamins",
    name: "Vitamin & Mineral Tests",
    description: "Essential nutrients and deficiency screening", 
    searchTerms: ["vitamin", "mineral", "b12", "d3", "folate", "iron", "zinc", "magnesium", "nutrient"]
  },
  {
    id: "diabetes",
    name: "Diabetes Testing",
    description: "Blood sugar, HbA1c, and diabetes monitoring",
    searchTerms: ["diabetes", "diabetic", "glucose", "hba1c", "insulin", "blood sugar"]
  },
  {
    id: "heart-health",
    name: "Heart Health",
    description: "Cardiovascular risk and cholesterol testing",
    searchTerms: ["heart", "cardiac", "cardiovascular", "cholesterol", "lipid", "triglycerides", "hdl", "ldl"]
  },
  {
    id: "liver-health", 
    name: "Liver Health",
    description: "Liver function and health monitoring",
    searchTerms: ["liver", "hepatic", "alt", "ast", "bilirubin", "liver function"]
  },
  {
    id: "kidney-health",
    name: "Kidney Health", 
    description: "Kidney function and health testing",
    searchTerms: ["kidney", "renal", "creatinine", "urea", "kidney function", "egfr"]
  },
  {
    id: "fertility",
    name: "Fertility Testing",
    description: "Reproductive health and fertility assessments",
    searchTerms: ["fertility", "reproductive", "sperm", "ovarian", "amh", "fsh", "lh"]
  },
  {
    id: "general-health",
    name: "General Health", 
    description: "Comprehensive health screening packages",
    searchTerms: ["general", "comprehensive", "health check", "wellness", "screening"]
  },
  {
    id: "allergy-testing",
    name: "Allergy Testing",
    description: "Food and environmental allergy screening", 
    searchTerms: ["allergy", "allergic", "intolerance", "food sensitivity", "ige"]
  },
  {
    id: "cancer-screening", 
    name: "Cancer Screening",
    description: "Early detection and preventive screening",
    searchTerms: ["cancer", "screening", "tumour", "psa", "cea", "ca125", "oncology"]
  }
];

// Category mapping helper function
export const getCategoryFromTestName = (testName: string): string => {
  const lowerTestName = testName.toLowerCase();
  
  for (const category of compareCategories) {
    if (category.searchTerms.some(term => lowerTestName.includes(term))) {
      return category.name;
    }
  }
  
  return "General Health"; // Default fallback
};
