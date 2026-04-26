export interface LondonLaboratoryTest {
  id: string;
  name: string;
  price: number;
  url: string;
  category: string;
  biomarkerCount: number;
  description: string;
}

export const londonLaboratoryTests: LondonLaboratoryTest[] = [
  {
    id: "lml-general-health",
    name: "General Health Screen",
    price: 89,
    url: "https://www.londonmedicallaboratory.com/",
    category: "General Health",
    biomarkerCount: 12,
    description: "Comprehensive health screening covering essential health markers."
  },
  {
    id: "lml-vitamin-profile",
    name: "Vitamin Profile",
    price: 129,
    url: "https://www.londonmedicallaboratory.com/",
    category: "Vitamins",
    biomarkerCount: 8,
    description: "Complete vitamin status assessment including key vitamins."
  },
  {
    id: "lml-hormone-check",
    name: "Hormone Check",
    price: 149,
    url: "https://www.londonmedicallaboratory.com/",
    category: "Hormone",
    biomarkerCount: 10,
    description: "Comprehensive hormone panel for hormonal health assessment."
  },
  {
    id: "lml-thyroid-advanced",
    name: "Advanced Thyroid Function",
    price: 99,
    url: "https://www.londonmedicallaboratory.com/",
    category: "Thyroid",
    biomarkerCount: 6,
    description: "Detailed thyroid function assessment with comprehensive markers."
  },
  {
    id: "lml-fertility-female",
    name: "Female Fertility Profile",
    price: 179,
    url: "https://www.londonmedicallaboratory.com/",
    category: "Fertility",
    biomarkerCount: 8,
    description: "Comprehensive fertility assessment for women planning pregnancy."
  },
  {
    id: "lml-fertility-male",
    name: "Male Fertility Profile",
    price: 169,
    url: "https://www.londonmedicallaboratory.com/",
    category: "Fertility",
    biomarkerCount: 7,
    description: "Complete fertility screening for men assessing reproductive health."
  },
  {
    id: "lml-heart-health",
    name: "Heart Health Profile",
    price: 119,
    url: "https://www.londonmedicallaboratory.com/",
    category: "Heart Health",
    biomarkerCount: 9,
    description: "Cardiovascular health assessment including key cardiac markers."
  },
  {
    id: "lml-diabetes-screen",
    name: "Diabetes Screening",
    price: 79,
    url: "https://www.londonmedicallaboratory.com/",
    category: "Diabetes",
    biomarkerCount: 5,
    description: "Essential diabetes screening to monitor blood sugar levels."
  }
];
