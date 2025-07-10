// Diabetes and metabolic health tests
export const diabetes = [
  {
    id: "hba1c-medichecks",
    category: "diabetes",
    name: "HbA1c Diabetes Test",
    provider: "Medichecks",
    providerLogo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 46.00,
    features: {
      "Sample type": "Finger-prick or venous",
      "Biomarkers": "3-month average blood glucose",
      "Turnaround": "3 days",
      "Collection": "Home kit or clinic",
      "Doctor review": true,
      "Test type": "Diabetes monitoring"
    }
  },
  {
    id: "lipid-medichecks", 
    category: "diabetes",
    name: "Lipid Profile (Cholesterol)",
    provider: "Medichecks",
    providerLogo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 39.00,
    features: {
      "Sample type": "Finger-prick or venous",
      "Biomarkers": "HDL, LDL, triglycerides",
      "Turnaround": "2 days", 
      "Collection": "Home kit or clinic",
      "Doctor review": true,
      "Test type": "Heart health"
    }
  },
  {
    id: "hba1c-goodbody",
    category: "diabetes",
    name: "HbA1c Diabetes Blood Test",
    provider: "Goodbody",
    providerLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 49.00,
    features: {
      "Sample type": "Venous or finger-prick",
      "Biomarkers": "HbA1c for diabetes",
      "Turnaround": "2-3 days",
      "Collection": "Home kit or clinic", 
      "Doctor review": true,
      "Test type": "Diabetes monitoring"
    }
  },
  {
    id: "cholesterol-goodbody",
    category: "diabetes", 
    name: "Cholesterol Profile",
    provider: "Goodbody",
    providerLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 49.00,
    features: {
      "Sample type": "Venous or finger-prick",
      "Biomarkers": "Total, HDL, LDL cholesterol",
      "Turnaround": "2-3 days",
      "Collection": "Home kit or clinic",
      "Doctor review": true,
      "Test type": "Heart health"
    }
  },
  {
    id: "metabolic-bluecrest",
    category: "diabetes",
    name: "Metabolic Blood Panel",
    provider: "Bluecrest", 
    providerLogo: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 129.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "Lipid profile, HbA1c, liver/kidney function",
      "Turnaround": "3-5 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Comprehensive metabolic"
    }
  },
  {
    id: "diabetes-cholesterol-thriva",
    category: "diabetes",
    name: "Diabetes & Cholesterol Package",
    provider: "Thriva",
    providerLogo: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 39.00,
    features: {
      "Sample type": "Finger-prick kit",
      "Biomarkers": "HbA1c + cholesterol profile",
      "Turnaround": "2 days",
      "Collection": "Home kit",
      "Doctor review": true, 
      "Test type": "Combined diabetes/heart"
    }
  },
  {
    id: "diabetes-spire",
    category: "diabetes",
    name: "Diabetes Check (HbA1c & Glucose)",
    provider: "Spire",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 60.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "HbA1c & glucose",
      "Turnaround": "1-2 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Diabetes monitoring"
    }
  },
  {
    id: "cholesterol-spire",
    category: "diabetes",
    name: "Cholesterol Test", 
    provider: "Spire",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 50.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "Full lipid profile",
      "Turnaround": "1-2 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Heart health"
    }
  },
  {
    id: "hba1c-oneday",
    category: "diabetes",
    name: "HbA1c Test",
    provider: "OneDayTests",
    providerLogo: "https://images.unsplash.com/photo-1576669801820-6a486b32a9f7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 52.00,
    features: {
      "Sample type": "Venous or capillary",
      "Biomarkers": "HbA1c", 
      "Turnaround": "24 hours",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Diabetes monitoring"
    }
  },
  {
    id: "lipid-oneday",
    category: "diabetes",
    name: "Full Lipid Profile",
    provider: "OneDayTests",
    providerLogo: "https://images.unsplash.com/photo-1576669801820-6a486b32a9f7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 29.00,
    features: {
      "Sample type": "Venous or capillary",
      "Biomarkers": "HDL, LDL cholesterol",
      "Turnaround": "24 hours",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Heart health"
    }
  },
  {
    id: "heart-randox",
    category: "diabetes",
    name: "Heart Health Home Kit",
    provider: "Randox", 
    providerLogo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 69.00,
    features: {
      "Sample type": "Finger-prick",
      "Biomarkers": "Cholesterol profile, HbA1c, hs-CRP",
      "Turnaround": "2-3 days",
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "Comprehensive heart health"
    }
  },
  {
    id: "hba1c-forth",
    category: "diabetes", 
    name: "HbA1c Diabetes Test",
    provider: "Forth",
    providerLogo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 45.00,
    features: {
      "Sample type": "Finger-prick",
      "Biomarkers": "HbA1c",
      "Turnaround": "1-2 days", 
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "Diabetes monitoring"
    }
  },
  {
    id: "cholesterol-heart-forth",
    category: "diabetes",
    name: "Cholesterol & Heart",
    provider: "Forth",
    providerLogo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 49.00,
    features: {
      "Sample type": "Finger-prick",
      "Biomarkers": "Lipid panel + hs-CRP",
      "Turnaround": "2 days",
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "Heart health"
    }
  }
];