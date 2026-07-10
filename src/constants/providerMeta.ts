import { getProviderLogo, normalizeProviderId } from "@/constants/providers";

export const PROVIDER_META: Record<string, {
  displayName: string;
  logo: string;
  color: string;
  ukas: boolean;
  cqc: boolean;
}> = {
  "medichecks": {
    displayName: "Medichecks",
    logo: "/lovable-uploads/medichecks-logo.png",
    color: "#003087",
    ukas: true,
    cqc: true,
  },
  "lola-health": {
    displayName: "Lola Health",
    logo: "/lovable-uploads/lola-health-logo.png",
    color: "#6B4FBB",
    ukas: true,
    cqc: false,
  },
  "randox": {
    displayName: "Randox Health",
    logo: "/lovable-uploads/randox-logo.png",
    color: "#E30613",
    ukas: true,
    cqc: true,
  },
  "goodbody-clinic": {
    displayName: "Goodbody Clinic",
    logo: "/lovable-uploads/goodbody-logo.png",
    color: "#2E7D32",
    ukas: false,
    cqc: true,
  },
  "london-medical-laboratory": {
    displayName: "London Medical Laboratory",
    logo: "/lovable-uploads/lml-logo.png",
    color: "#1565C0",
    ukas: true,
    cqc: false,
  },
  "clinilabs": {
    displayName: "Clinilabs",
    logo: "/lovable-uploads/clinilabs-logo.png",
    color: "#00838F",
    ukas: false,
    cqc: false,
  },
  "london-health-company": {
    displayName: "London Health Company",
    logo: "/lovable-uploads/lhc-logo.png",
    color: "#4A148C",
    ukas: false,
    cqc: false,
  },
  "medical-diagnosis": {
    displayName: "Medical Diagnosis",
    logo: "/lovable-uploads/medical-diagnosis-logo.png",
    color: "#0277BD",
    ukas: false,
    cqc: false,
  },
  "thriva": {
    displayName: "Thriva",
    logo: "/lovable-uploads/thriva-logo.png",
    color: "#1B5E20",
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
