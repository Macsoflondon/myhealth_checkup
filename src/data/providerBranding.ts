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
  if (key.includes("london")) return providerBranding.londonmedicallab;
  if (key.includes("lola")) return providerBranding.lola;
  return null;
}
