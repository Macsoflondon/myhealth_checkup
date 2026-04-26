export interface ProviderBrand {
  primary: string;
  accent: string;
  tagline: string;
  primaryLight: string; // light tint for backgrounds
  accentLight: string;  // light tint for feature cards
}

export const providerBranding: Record<string, ProviderBrand> = {
  medichecks: {
    primary: "#E0005A",
    accent: "#1C1C3A",
    tagline: "Unlock the Ultimate You",
    primaryLight: "#E0005A1A",
    accentLight: "#1C1C3A12",
  },
  goodbody: {
    primary: "#009B8D",
    accent: "#1A2B4A",
    tagline: "Know More. Live Better.",
    primaryLight: "#009B8D1A",
    accentLight: "#1A2B4A12",
  },
  thriva: {
    primary: "#3D1152",
    accent: "#E85D75",
    tagline: "Know your body. Own your health.",
    primaryLight: "#3D11521A",
    accentLight: "#E85D7512",
  },
  randox: {
    primary: "#2D4BA0",
    accent: "#1a2d6b",
    tagline: "Your Health, Our Passion",
    primaryLight: "#2D4BA01A",
    accentLight: "#1a2d6b12",
  },
  londonmedicallab: {
    primary: "#1565C0",
    accent: "#6A1B9A",
    tagline: "Love My Life",
    primaryLight: "#1565C01A",
    accentLight: "#6A1B9A12",
  },
  lola: {
    primary: "#E8604C",
    accent: "#1B4B5A",
    tagline: "Unlock Your Longevity",
    primaryLight: "#E8604C1A",
    accentLight: "#1B4B5A12",
  },
  clinilabs: {
    primary: "#2E7D32",
    accent: "#1565C0",
    tagline: "Clinical Excellence",
    primaryLight: "#2E7D321A",
    accentLight: "#1565C012",
  },
  londonhealthcompany: {
    primary: "#E91E9C",
    accent: "#1A237E",
    tagline: "Your Health Partner",
    primaryLight: "#E91E9C1A",
    accentLight: "#1A237E12",
  },
  medicaldiagnosis: {
    primary: "#E53935",
    accent: "#00838F",
    tagline: "Accurate Diagnosis",
    primaryLight: "#E539351A",
    accentLight: "#00838F12",
  },
  bluehorizon: {
    primary: "#1976D2",
    accent: "#0D47A1",
    tagline: "Your Health, Clearly Tested",
    primaryLight: "#1976D21A",
    accentLight: "#0D47A112",
  },
  spire: {
    primary: "#00796B",
    accent: "#004D40",
    tagline: "Trusted Hospital Testing",
    primaryLight: "#00796B1A",
    accentLight: "#004D4012",
  },
  londonbloodtests: {
    primary: "#1E88E5",
    accent: "#0D47A1",
    tagline: "Fast Results, Central London",
    primaryLight: "#1E88E51A",
    accentLight: "#0D47A112",
  },
  youthrevisited: {
    primary: "#7B1FA2",
    accent: "#4A148C",
    tagline: "Optimise Your Wellbeing",
    primaryLight: "#7B1FA21A",
    accentLight: "#4A148C12",
  },
  manual: {
    primary: "#2196F3",
    accent: "#0D47A1",
    tagline: "Men's Health, Simplified",
    primaryLight: "#2196F31A",
    accentLight: "#0D47A112",
  },
  functionaldx: {
    primary: "#00897B",
    accent: "#004D40",
    tagline: "Advanced Functional Testing",
    primaryLight: "#00897B1A",
    accentLight: "#004D4012",
  },
  onedaytests: {
    primary: "#F57C00",
    accent: "#E65100",
    tagline: "Results When You Need Them",
    primaryLight: "#F57C001A",
    accentLight: "#E6510012",
  },
  londonlaboratory: {
    primary: "#1565C0",
    accent: "#0D47A1",
    tagline: "Harley Street Diagnostics",
    primaryLight: "#1565C01A",
    accentLight: "#0D47A112",
  },
  thedoctorslaboratory: {
    primary: "#283593",
    accent: "#1A237E",
    tagline: "Gold Standard Pathology",
    primaryLight: "#2835931A",
    accentLight: "#1A237E12",
  },
};

/**
 * Look up branding by provider name (case-insensitive partial match)
 */
export function getBranding(nameOrId: string): ProviderBrand | null {
  const key = nameOrId.toLowerCase();
  if (key.includes("medichecks")) return providerBranding.medichecks;
  if (key.includes("goodbody")) return providerBranding.goodbody;
  if (key.includes("thriva")) return providerBranding.thriva;
  if (key.includes("randox")) return providerBranding.randox;
  if (key.includes("lola")) return providerBranding.lola;
  if (key.includes("clinilabs")) return providerBranding.clinilabs;
  if (key.includes("london health")) return providerBranding.londonhealthcompany;
  if (key.includes("medical diagnosis")) return providerBranding.medicaldiagnosis;
  if (key.includes("blue horizon")) return providerBranding.bluehorizon;
  if (key.includes("spire")) return providerBranding.spire;
  if (key.includes("london blood")) return providerBranding.londonbloodtests;
  if (key.includes("youth revisited")) return providerBranding.youthrevisited;
  if (key.includes("manual")) return providerBranding.manual;
  if (key.includes("functional dx")) return providerBranding.functionaldx;
  if (key.includes("onedaytests") || key.includes("one day")) return providerBranding.onedaytests;
  if (key.includes("doctors laboratory") || key.includes("tdl")) return providerBranding.thedoctorslaboratory;
  if (key.includes("london laboratory")) return providerBranding.londonlaboratory;
  if (key.includes("london medical")) return providerBranding.londonmedicallab;
  return null;
}
