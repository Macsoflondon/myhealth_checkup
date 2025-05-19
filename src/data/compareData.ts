
export const providers = [
  { id: "Medichecks", name: "Medichecks" },
  { id: "Thriva", name: "Thriva" },
  { id: "Randox", name: "Randox Health" },
  { id: "BlueHorizon", name: "Blue Horizon" },
  { id: "Spire", name: "Private Blood Tests (Spire)" },
  { id: "Superdrug", name: "Superdrug Health Clinics" },
  { id: "LondonBT", name: "London Blood Tests" },
  { id: "YouthRevisited", name: "Youth Revisited" },
  { id: "Goodbody", name: "Goodbody Clinic" },
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
    provider: "Medichecks",
    providerLogo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200", 
    price: 49.00,
    features: {
      bioMarkers: "45+ markers",
      turnaround: "2-3 days",
      collection: "Home kit or clinic",
      doctorReview: true,
      "Detailed report": true
    }
  },
  {
    id: "blood-test-2",
    category: "blood-tests",
    name: "Full Blood Count",
    provider: "Thriva",
    providerLogo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 59.00,
    features: {
      bioMarkers: "40+ markers",
      turnaround: "3-5 days",
      collection: "Home kit",
      doctorReview: true,
      "Detailed report": true
    }
  },
  {
    id: "blood-test-3",
    category: "blood-tests",
    name: "Full Blood Count",
    provider: "Randox",
    providerLogo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 45.00,
    features: {
      bioMarkers: "50+ markers",
      turnaround: "1-2 days",
      collection: "Clinic only",
      doctorReview: true,
      "Detailed report": true
    }
  },
  {
    id: "blood-test-4",
    category: "blood-tests",
    name: "Full Blood Count",
    provider: "BlueHorizon",
    providerLogo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 55.00,
    features: {
      bioMarkers: "48+ markers",
      turnaround: "2-3 days",
      collection: "Home kit or clinic",
      doctorReview: true,
      "Detailed report": true
    }
  },
  {
    id: "blood-test-5",
    category: "blood-tests",
    name: "Full Blood Count",
    provider: "Spire",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 52.00,
    features: {
      bioMarkers: "42+ markers",
      turnaround: "3-4 days",
      collection: "Clinic only",
      doctorReview: true,
      "Detailed report": true
    }
  },
  
  // Weight Loss Services
  {
    id: "weight-loss-1",
    category: "weight-loss",
    name: "GLP-1 Treatment",
    provider: "Medichecks",
    providerLogo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 149.00,
    features: {
      bioMarkers: "Metabolic profile",
      turnaround: "Doctor call within 24h",
      collection: "Medication delivered",
      doctorReview: true,
      "Regular check-ins": true,
      "App support": true
    }
  },
  {
    id: "weight-loss-2",
    category: "weight-loss",
    name: "GLP-1 Treatment",
    provider: "Goodbody",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 179.00,
    features: {
      bioMarkers: "Basic metabolic panel",
      turnaround: "Doctor call within 48h",
      collection: "Medication delivered",
      doctorReview: true,
      "Regular check-ins": true,
      "App support": true
    }
  },
  {
    id: "weight-loss-3",
    category: "weight-loss",
    name: "GLP-1 Treatment",
    provider: "Superdrug",
    providerLogo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 165.00,
    features: {
      bioMarkers: "Comprehensive metabolic panel",
      turnaround: "Doctor call within 36h",
      collection: "Medication delivered",
      doctorReview: true,
      "Regular check-ins": true,
      "App support": true
    }
  },
  
  // Longevity Treatments
  {
    id: "longevity-1",
    category: "longevity",
    name: "NAD+ Therapy",
    provider: "YouthRevisited",
    providerLogo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 299.00,
    features: {
      bioMarkers: "Aging biomarkers",
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
    providerLogo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 349.00,
    features: {
      bioMarkers: "Comprehensive aging panel",
      turnaround: "Book within 3 days",
      collection: "Clinic only",
      doctorReview: true,
      "Follow-up tests": true,
      "Personalized protocol": true
    }
  },
  {
    id: "longevity-3",
    category: "longevity",
    name: "NAD+ Therapy",
    provider: "BlueHorizon",
    providerLogo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 325.00,
    features: {
      bioMarkers: "Advanced aging biomarkers",
      turnaround: "Book within 2 days",
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
    provider: "Thriva",
    providerLogo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 79.00,
    features: {
      bioMarkers: "TSH, T3, T4, antibodies",
      turnaround: "3-5 days",
      collection: "Home kit",
      doctorReview: true,
      "Detailed analysis": true
    }
  },
  {
    id: "hormone-2",
    category: "hormones",
    name: "Thyroid Function",
    provider: "Randox",
    providerLogo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 69.00,
    features: {
      bioMarkers: "Complete thyroid panel",
      turnaround: "2-3 days",
      collection: "Clinic only",
      doctorReview: true,
      "Detailed analysis": true
    }
  },
  {
    id: "hormone-3",
    category: "hormones",
    name: "Thyroid Function",
    provider: "LondonBT",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 75.00,
    features: {
      bioMarkers: "Extended thyroid function panel",
      turnaround: "2-4 days",
      collection: "Home kit or clinic",
      doctorReview: true,
      "Detailed analysis": true
    }
  },
  
  // Vitamin Assessments
  {
    id: "vitamin-1",
    category: "vitamins",
    name: "Vitamin D & B12",
    provider: "Goodbody",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 49.00,
    features: {
      bioMarkers: "Vit D, B12, Folate",
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
    providerLogo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 59.00,
    features: {
      bioMarkers: "Full vitamin profile",
      turnaround: "1-2 days",
      collection: "Clinic only",
      doctorReview: true,
      "Supplement advice": true
    }
  },
  {
    id: "vitamin-3",
    category: "vitamins",
    name: "Vitamin D & B12",
    provider: "Spire",
    providerLogo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 45.00,
    features: {
      bioMarkers: "Vit D, B12, Folate, Iron",
      turnaround: "3-4 days",
      collection: "Home kit",
      doctorReview: true,
      "Supplement advice": true
    }
  },
  
  // Travel Vaccinations
  {
    id: "travel-1",
    category: "travel",
    name: "Travel Health Pack",
    provider: "Superdrug",
    providerLogo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 85.00,
    features: {
      bioMarkers: "Immunity status check",
      turnaround: "Same day service",
      collection: "Clinic only",
      doctorReview: true,
      "Vaccination certificate": true
    }
  },
  {
    id: "travel-2",
    category: "travel",
    name: "Travel Health Pack",
    provider: "Randox",
    providerLogo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 95.00,
    features: {
      bioMarkers: "Region-specific immunity panel",
      turnaround: "Next day service",
      collection: "Clinic only",
      doctorReview: true,
      "Vaccination certificate": true
    }
  },
  {
    id: "travel-3",
    category: "travel",
    name: "Travel Health Pack",
    provider: "Medichecks",
    providerLogo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 90.00,
    features: {
      bioMarkers: "Basic immunity status",
      turnaround: "1-2 days service",
      collection: "Clinic only",
      doctorReview: true,
      "Vaccination certificate": true
    }
  }
];
