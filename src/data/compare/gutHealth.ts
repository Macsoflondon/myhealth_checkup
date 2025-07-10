// Gut health and digestive tests
export const gutHealth = [
  {
    id: "h-pylori-goodbody",
    category: "gut-health",
    name: "Helicobacter pylori Antibody Test",
    provider: "Goodbody",
    providerLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 105.00,
    features: {
      "Sample type": "Venous blood (clinic)",
      "Biomarkers": "H. pylori IgG antibodies",
      "Turnaround": "3-5 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Ulcer/gastritis risk"
    }
  },
  {
    id: "calprotectin-goodbody",
    category: "gut-health", 
    name: "Calprotectin Stool Test",
    provider: "Goodbody",
    providerLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 99.00,
    features: {
      "Sample type": "At-home stool kit",
      "Biomarkers": "Calprotectin levels",
      "Turnaround": "7 days",
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "IBD vs IBS differentiation"
    }
  },
  {
    id: "h-pylori-stool-bluecrest",
    category: "gut-health",
    name: "Helicobacter pylori Stool Antigen",
    provider: "Bluecrest",
    providerLogo: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 60.00,
    features: {
      "Sample type": "At-home stool kit",
      "Biomarkers": "H. pylori stool antigen",
      "Turnaround": "7 days",
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "Active H. pylori infection"
    }
  },
  {
    id: "calprotectin-bluecrest",
    category: "gut-health",
    name: "Faecal Calprotectin Test",
    provider: "Bluecrest",
    providerLogo: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 79.00,
    features: {
      "Sample type": "At-home stool kit",
      "Biomarkers": "Calprotectin for IBD screening",
      "Turnaround": "7 days", 
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "IBD screening"
    }
  },
  {
    id: "coeliac-spire",
    category: "gut-health",
    name: "Coeliac Screen",
    provider: "Spire",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 100.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "Tissue transglutaminase (tTG IgA)",
      "Turnaround": "4-5 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Coeliac disease screening"
    }
  },
  {
    id: "h-pylori-breath-spire",
    category: "gut-health",
    name: "H. pylori Urea Breath Test",
    provider: "Spire",
    providerLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 150.00,
    features: {
      "Sample type": "Clinic breath test", 
      "Biomarkers": "Active H. pylori infection",
      "Turnaround": "Same day",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Active H. pylori detection"
    }
  },
  {
    id: "calprotectin-tdl",
    category: "gut-health",
    name: "Faecal Calprotectin",
    provider: "TDL",
    providerLogo: "https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 60.00,
    features: {
      "Sample type": "Stool sample",
      "Biomarkers": "Calprotectin levels",
      "Turnaround": "3 days",
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "IBD screening"
    }
  },
  {
    id: "h-pylori-tdl",
    category: "gut-health",
    name: "H. pylori Antibody Test",
    provider: "TDL",
    providerLogo: "https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 65.00,
    features: {
      "Sample type": "Venous blood or stool",
      "Biomarkers": "H. pylori IgG or stool antigen",
      "Turnaround": "2-3 days",
      "Collection": "Clinic or home kit",
      "Doctor review": true,
      "Test type": "H. pylori infection screening"
    }
  },
  {
    id: "h-pylori-oneday",
    category: "gut-health",
    name: "Helicobacter pylori IgG",
    provider: "OneDayTests",
    providerLogo: "https://images.unsplash.com/photo-1576669801820-6a486b32a9f7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 65.00,
    features: {
      "Sample type": "Venous or capillary",
      "Biomarkers": "H. pylori antibodies (past infection)",
      "Turnaround": "10 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "H. pylori screening"
    }
  },
  {
    id: "calprotectin-oneday", 
    category: "gut-health",
    name: "Faecal Calprotectin",
    provider: "OneDayTests",
    providerLogo: "https://images.unsplash.com/photo-1576669801820-6a486b32a9f7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 79.00,
    features: {
      "Sample type": "Stool kit",
      "Biomarkers": "Calprotectin levels",
      "Turnaround": "3-5 days",
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "IBD screening"
    }
  },
  {
    id: "coeliac-oneday",
    category: "gut-health",
    name: "Coeliac (Gluten) Screen",
    provider: "OneDayTests",
    providerLogo: "https://images.unsplash.com/photo-1576669801820-6a486b32a9f7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 230.00,
    features: {
      "Sample type": "Venous blood",
      "Biomarkers": "Anti-tTG IgA (± IgA levels)",
      "Turnaround": "14 days",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Coeliac disease screening"
    }
  },
  {
    id: "h-pylori-breath-randox",
    category: "gut-health",
    name: "Helicobacter pylori Breath Test",
    provider: "Randox",
    providerLogo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 100.00,
    features: {
      "Sample type": "Urea breath test in-clinic",
      "Biomarkers": "Active H. pylori detection",
      "Turnaround": "Same day",
      "Collection": "Clinic only",
      "Doctor review": true,
      "Test type": "Active H. pylori infection"
    }
  },
  {
    id: "gut-health-forth",
    category: "gut-health",
    name: "Gut Health Bundle",
    provider: "Forth",
    providerLogo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200",
    price: 99.00,
    features: {
      "Sample type": "Finger-prick + stool",
      "Biomarkers": "Coeliac antibodies (tTG) + faecal calprotectin",
      "Turnaround": "5-7 days",
      "Collection": "Home kit",
      "Doctor review": true,
      "Test type": "IBS symptom investigation"
    }
  }
];