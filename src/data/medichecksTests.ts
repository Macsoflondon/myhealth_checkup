export interface MedichecksTest {
  id: string;
  name: string;
  price: number;
  url: string;
  category: string;
  biomarkerCount: number;
  description: string;
}

export const medichecksTests: MedichecksTest[] = [
  {
    id: "medichecks-testosterone",
    name: "Testosterone Blood Test",
    price: 29,
    url: "https://www.medichecks.com/products/testosterone-blood-test",
    category: "Hormone",
    biomarkerCount: 4,
    description: "Comprehensive testosterone level assessment for hormonal health monitoring."
  },
  {
    id: "medichecks-male-hormone",
    name: "Male Hormone Blood Test",
    price: 79,
    url: "https://www.medichecks.com/products/male-hormone-check-blood-test",
    category: "Hormone",
    biomarkerCount: 4,
    description: "Complete male hormone panel for comprehensive hormonal health assessment."
  },
  {
    id: "medichecks-ultimate-performance",
    name: "Ultimate Performance Blood Test",
    price: 199,
    url: "https://www.medichecks.com/products/ultimate-performance-blood-test",
    category: "Sports Performance",
    biomarkerCount: 4,
    description: "Advanced testing for athletes and active individuals seeking optimal performance."
  },
  {
    id: "medichecks-advanced-thyroid",
    name: "Advanced Thyroid Function Blood Test",
    price: 89,
    url: "https://www.medichecks.com/products/advanced-thyroid-function-blood-test",
    category: "Thyroid",
    biomarkerCount: 4,
    description: "Comprehensive thyroid function assessment including key thyroid hormones."
  },
  {
    id: "medichecks-well-woman-advanced",
    name: "Advanced Well Woman Blood Test",
    price: 159,
    url: "https://www.medichecks.com/products/well-woman-advanced-blood-test",
    category: "Women's Health",
    biomarkerCount: 4,
    description: "Comprehensive health check tailored specifically for women's health needs."
  },
  {
    id: "medichecks-well-man-advanced",
    name: "Advanced Well Man Blood Test",
    price: 159,
    url: "https://www.medichecks.com/products/well-man-advanced-blood-test",
    category: "Men's Health",
    biomarkerCount: 4,
    description: "Complete health assessment designed specifically for men's health monitoring."
  },
  {
    id: "medichecks-trt-advanced",
    name: "Advanced TRT (Testosterone Replacement Therapy) Blood Test",
    price: 149,
    url: "https://www.medichecks.com/products/trt-check-plus-testosterone-replacement-therapy-blood-test",
    category: "Hormone",
    biomarkerCount: 4,
    description: "Specialized testing for individuals on testosterone replacement therapy."
  },
  {
    id: "medichecks-thyroid-function",
    name: "Thyroid Function Blood Test",
    price: 45,
    url: "https://www.medichecks.com/products/thyroid-function-blood-test",
    category: "Thyroid",
    biomarkerCount: 4,
    description: "Essential thyroid function screening to monitor thyroid health."
  },
  {
    id: "medichecks-female-hormone",
    name: "Female Hormone Blood Test",
    price: 79,
    url: "https://www.medichecks.com/products/female-hormone-check-blood-test",
    category: "Hormone",
    biomarkerCount: 4,
    description: "Comprehensive female hormone panel for hormonal health assessment."
  },
  {
    id: "medichecks-health-lifestyle",
    name: "Health and Lifestyle Blood Test",
    price: 89,
    url: "https://www.medichecks.com/products/health-and-lifestyle-check-blood-test",
    category: "General Health",
    biomarkerCount: 4,
    description: "Comprehensive health check covering key lifestyle and wellness markers."
  },
  {
    id: "medichecks-thyroid-antibodies",
    name: "Thyroid Function with Antibodies Blood Test",
    price: 65,
    url: "https://www.medichecks.com/products/thyroid-function-antibodies-blood-test",
    category: "Thyroid",
    biomarkerCount: 4,
    description: "Thyroid assessment including antibody testing for autoimmune conditions."
  },
  {
    id: "medichecks-sports-hormone",
    name: "Sports Hormone Blood Test",
    price: 109,
    url: "https://www.medichecks.com/products/sports-hormone-check-blood-test",
    category: "Sports Performance",
    biomarkerCount: 4,
    description: "Hormone panel designed for athletes and active individuals."
  },
  {
    id: "medichecks-liver-function",
    name: "Liver Function Blood Test",
    price: 39,
    url: "https://www.medichecks.com/products/liver-check-blood-test",
    category: "Liver",
    biomarkerCount: 4,
    description: "Essential liver function screening to monitor liver health."
  },
  {
    id: "medichecks-optimal-health",
    name: "Optimal Health Blood Test",
    price: 249,
    url: "https://www.medichecks.com/products/optimal-health-blood-test",
    category: "General Health",
    biomarkerCount: 4,
    description: "Most comprehensive health assessment covering all major health markers."
  },
  {
    id: "medichecks-vitamin-d",
    name: "Vitamin D (25 OH) Blood Test",
    price: 39,
    url: "https://www.medichecks.com/products/vitamin-d-25-oh-blood-test",
    category: "Vitamins",
    biomarkerCount: 4,
    description: "Essential vitamin D level testing for bone and immune health."
  },
  {
    id: "medichecks-female-hormone-advanced",
    name: "Advanced Female Hormone Blood Test",
    price: 99,
    url: "https://www.medichecks.com/products/female-hormone-check-advanced-blood-test",
    category: "Hormone",
    biomarkerCount: 4,
    description: "Comprehensive female hormone assessment for detailed hormonal analysis."
  },
  {
    id: "medichecks-psa",
    name: "PSA (Prostate Specific Antigen) Blood Test",
    price: 45,
    url: "https://www.medichecks.com/products/psa-prostate-specific-antigen-blood-test",
    category: "Men's Health",
    biomarkerCount: 4,
    description: "Prostate health screening for men to monitor PSA levels."
  },
  {
    id: "medichecks-iron",
    name: "Iron Blood Test",
    price: 49,
    url: "https://www.medichecks.com/products/iron-deficiency-check-blood-test",
    category: "General Health",
    biomarkerCount: 4,
    description: "Iron status assessment to detect iron deficiency or overload."
  }
];
