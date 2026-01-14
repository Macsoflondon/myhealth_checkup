// Provider utility functions

export const providerLogos: Record<string, string> = {
  "medichecks": "https://www.medichecks.com/static/version1720697605/frontend/Medichecks/default/en_GB/images/logo.svg",
  "thriva": "https://thriva.co/images/thriva-logo.svg",
  "randox": "https://www.randoxhealth.com/wp-content/themes/developer starter theme/images/logo.svg",
  "randox-health": "https://www.randoxhealth.com/wp-content/themes/developer starter theme/images/logo.svg",
  "goodbody-clinic": "https://www.goodbodyclinic.com/wp-content/uploads/2023/01/goodbody-clinic-logo.svg",
  "goodbody": "https://www.goodbodyclinic.com/wp-content/uploads/2023/01/goodbody-clinic-logo.svg",
  "london-medical-laboratory": "https://www.londonmedicallaboratory.co.uk/assets/images/lml-logo.svg",
  "lola-health": "https://lolahealth.com/wp-content/uploads/2023/06/lola-health-logo.svg",
  "tuli-health": "/lovable-uploads/providers/tuli-health.png",
};

export const providerDisplayNames: Record<string, string> = {
  "medichecks": "Medichecks",
  "thriva": "Thriva",
  "randox": "Randox Health",
  "randox-health": "Randox Health",
  "goodbody-clinic": "Goodbody Clinic",
  "goodbody": "Goodbody Clinic",
  "london-medical-laboratory": "London Medical Laboratory",
  "lola-health": "Lola Health",
  "tuli-health": "Tuli Health",
};

export const getProviderLogo = (providerId: string): string => {
  const normalised = providerId.toLowerCase().replace(/\s+/g, "-");
  return providerLogos[normalised] || `/lovable-uploads/providers/${normalised}.png`;
};

export const getProviderDisplayName = (providerId: string): string => {
  const normalised = providerId.toLowerCase().replace(/\s+/g, "-");
  return providerDisplayNames[normalised] || providerId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
};
