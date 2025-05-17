
export const providers = [
  { id: "Tuli", name: "Tuli Health" },
  { id: "Goodbody", name: "Goodbody" },
  { id: "Medicheck", name: "Medicheck" },
  { id: "Randox", name: "Randox Laboratory" },
  { id: "LondonLab", name: "London Laboratory" }
];

export const compareCategories = [
  { id: "blood-tests", name: "Blood Tests" },
  { id: "weight-loss", name: "Weight Loss Services" },
  { id: "longevity", name: "Longevity Treatments" },
  { id: "hormones", name: "Hormone Tests" },
  { id: "vitamins", name: "Vitamin Assessments" },
  { id: "travel", name: "Travel Vaccinations" }
];

export const compareData = [
  // Blood Tests
  {
    id: "blood-test-1",
    category: "blood-tests",
    name: "Full Blood Count",
    provider: "Tuli",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 49.00,
    features: {
      turnaround: "2-3 days",
      collection: "Home kit or clinic",
      doctorReview: true,
      "GP follow-up": true,
      "Detailed report": true,
      "Nutritional advice": false
    }
  },
  {
    id: "blood-test-2",
    category: "blood-tests",
    name: "Full Blood Count",
    provider: "Medicheck",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 59.00,
    features: {
      turnaround: "3-5 days",
      collection: "Home kit",
      doctorReview: true,
      "GP follow-up": false,
      "Detailed report": true,
      "Nutritional advice": true
    }
  },
  {
    id: "blood-test-3",
    category: "blood-tests",
    name: "Full Blood Count",
    provider: "Randox",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 45.00,
    features: {
      turnaround: "1-2 days",
      collection: "Clinic only",
      doctorReview: true,
      "GP follow-up": true,
      "Detailed report": true,
      "Nutritional advice": false
    }
  },
  
  // Weight Loss Services
  {
    id: "weight-loss-1",
    category: "weight-loss",
    name: "GLP-1 Treatment",
    provider: "Tuli",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 149.00,
    features: {
      turnaround: "Doctor call within 24h",
      collection: "Medication delivered",
      doctorReview: true,
      "Regular check-ins": true,
      "Nutritional support": true,
      "App support": true
    }
  },
  {
    id: "weight-loss-2",
    category: "weight-loss",
    name: "GLP-1 Treatment",
    provider: "Goodbody",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 179.00,
    features: {
      turnaround: "Doctor call within 48h",
      collection: "Medication delivered",
      doctorReview: true,
      "Regular check-ins": true,
      "Nutritional support": true,
      "App support": true
    }
  },
  
  // Longevity Treatments
  {
    id: "longevity-1",
    category: "longevity",
    name: "NAD+ Therapy",
    provider: "Tuli",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 299.00,
    features: {
      turnaround: "Same-day appointments",
      collection: "Clinic only",
      doctorReview: true,
      "Follow-up tests": true,
      "Personalized protocol": true
    }
  },
  {
    id: "longevity-2",
    category: "longevity",
    name: "NAD+ Therapy",
    provider: "LondonLab",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 349.00,
    features: {
      turnaround: "Book within 3 days",
      collection: "Clinic only",
      doctorReview: true,
      "Follow-up tests": true,
      "Personalized protocol": true
    }
  },
  
  // Hormone Tests
  {
    id: "hormone-1",
    category: "hormones",
    name: "Thyroid Function",
    provider: "Medicheck",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 79.00,
    features: {
      turnaround: "3-5 days",
      collection: "Home kit",
      doctorReview: true,
      "Detailed analysis": true,
      "Treatment options": false
    }
  },
  {
    id: "hormone-2",
    category: "hormones",
    name: "Thyroid Function",
    provider: "Randox",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 69.00,
    features: {
      turnaround: "2-3 days",
      collection: "Clinic only",
      doctorReview: true,
      "Detailed analysis": true,
      "Treatment options": true
    }
  },
  
  // Vitamin Assessments
  {
    id: "vitamin-1",
    category: "vitamins",
    name: "Vitamin D & B12",
    provider: "Goodbody",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 49.00,
    features: {
      turnaround: "2-4 days",
      collection: "Home kit",
      doctorReview: true,
      "Supplement advice": true
    }
  },
  {
    id: "vitamin-2",
    category: "vitamins",
    name: "Vitamin D & B12",
    provider: "LondonLab",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 59.00,
    features: {
      turnaround: "1-2 days",
      collection: "Clinic only",
      doctorReview: true,
      "Supplement advice": true
    }
  },
  
  // Travel Vaccinations
  {
    id: "travel-1",
    category: "travel",
    name: "Travel Health Pack",
    provider: "Tuli",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 85.00,
    features: {
      turnaround: "Same day service",
      collection: "Clinic only",
      doctorReview: true,
      "Vaccination certificate": true,
      "Follow-up care": true
    }
  },
  {
    id: "travel-2",
    category: "travel",
    name: "Travel Health Pack",
    provider: "Randox",
    providerLogo: "/placeholder.svg", // Replace with actual logo
    price: 95.00,
    features: {
      turnaround: "Next day service",
      collection: "Clinic only",
      doctorReview: true,
      "Vaccination certificate": true,
      "Follow-up care": false
    }
  }
];
