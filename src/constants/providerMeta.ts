import { getProviderLogo, normalizeProviderId } from "@/constants/providers";

export const PROVIDER_META: Record<
  string,
  {
    displayName: string;
    logo: string;
    color: string;
    ukas: boolean;
    cqc: boolean;
  }
> = {
  medichecks: {
    displayName: "Medichecks",
    logo: "/lovable-uploads/provider-medichecks-light.webp",
    color: "#003087",
    ukas: true,
    cqc: true,
  },
  "lola-health": {
    displayName: "Lola Health",
    logo: "/lovable-uploads/provider-lola-health.webp",
    color: "#6B4FBB",
    ukas: true,
    cqc: false,
  },
  randox: {
    displayName: "Randox Health",
    logo: "/lovable-uploads/provider-randox.webp",
    color: "#E30613",
    ukas: true,
    cqc: true,
  },
  "goodbody-clinic": {
    displayName: "Goodbody Clinic",
    logo: "/lovable-uploads/provider-goodbody-slate-2026.webp",
    color: "#2E7D32",
    ukas: false,
    cqc: true,
  },
  "london-medical-laboratory": {
    displayName: "London Medical Laboratory",
    logo: "/lovable-uploads/provider-london-medical.webp",
    color: "#1565C0",
    ukas: true,
    cqc: false,
  },
  clinilabs: {
    displayName: "Clinilabs",
    logo: "/lovable-uploads/provider-clinilabs.webp",
    color: "#00838F",
    ukas: false,
    cqc: false,
  },
  "london-health-company": {
    displayName: "London Health Company",
    logo: "/lovable-uploads/provider-london-health-company.webp",
    color: "#4A148C",
    ukas: false,
    cqc: false,
  },
  "medical-diagnosis": {
    displayName: "Medical Diagnosis",
    logo: "/lovable-uploads/provider-medical-diagnosis.webp",
    color: "#0277BD",
    ukas: false,
    cqc: false,
  },
};

export const getProviderMeta = (providerId: string) =>
  PROVIDER_META[normalizeProviderId(providerId)] ?? {
    displayName: providerId,
    logo: getProviderLogo(providerId),
    color: "#081129",
    ukas: false,
    cqc: false,
  };
