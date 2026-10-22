import { getProviderLogo, normalizeProviderId } from "@/constants/providers";
import { PROVIDER_LOGO_ASSETS } from "@/constants/providerLogoAssets";

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
    logo: PROVIDER_LOGO_ASSETS.medichecks.src,
    color: "#003087",
    ukas: true,
    cqc: true,
  },
  "lola-health": {
    displayName: "Lola Health",
    logo: PROVIDER_LOGO_ASSETS["lola-health"].src,
    color: "#6B4FBB",
    ukas: true,
    cqc: false,
  },
  randox: {
    displayName: "Randox Health",
    logo: PROVIDER_LOGO_ASSETS.randox.src,
    color: "#E30613",
    ukas: true,
    cqc: true,
  },
  "goodbody-clinic": {
    displayName: "Goodbody Clinic",
    logo: PROVIDER_LOGO_ASSETS["goodbody-clinic"].src,
    color: "#2E7D32",
    ukas: false,
    cqc: true,
  },
  "london-medical-laboratory": {
    displayName: "London Medical Laboratory",
    logo: PROVIDER_LOGO_ASSETS["london-medical-laboratory"].src,
    color: "#1565C0",
    ukas: true,
    cqc: false,
  },
  clinilabs: {
    displayName: "Clinilabs",
    logo: PROVIDER_LOGO_ASSETS.clinilabs.src,
    color: "#00838F",
    ukas: false,
    cqc: false,
  },
  "london-health-company": {
    displayName: "London Health Company",
    logo: PROVIDER_LOGO_ASSETS["london-health-company"].src,
    color: "#4A148C",
    ukas: false,
    cqc: false,
  },
  "medical-diagnosis": {
    displayName: "Medical Diagnosis",
    logo: PROVIDER_LOGO_ASSETS["medical-diagnosis"].src,
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
