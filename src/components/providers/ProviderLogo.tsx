import React from "react";
import { PROVIDER_LOGO_ASSETS } from "@/constants/providerLogoAssets";

interface ProviderLogoProps {
  provider: string;
  className?: string;
  priority?: boolean;
}

export const ProviderLogo = ({
  provider,
  className = "h-20 w-auto",
  priority = false,
}: ProviderLogoProps) => {
  const getProviderLogo = (providerName: string) => {
    const normalizedName = providerName.toLowerCase();

    if (normalizedName.includes("medichecks")) {
      return PROVIDER_LOGO_ASSETS.medichecks.src;
    }

    if (normalizedName.includes("goodbody")) {
      return PROVIDER_LOGO_ASSETS["goodbody-clinic"].src;
    }

    if (normalizedName.includes("randox")) {
      return PROVIDER_LOGO_ASSETS.randox.src;
    }

    if (normalizedName.includes("london medical laboratory")) {
      return PROVIDER_LOGO_ASSETS["london-medical-laboratory"].src;
    }

    if (normalizedName.includes("lola")) {
      return PROVIDER_LOGO_ASSETS["lola-health"].src;
    }

    if (normalizedName.includes("clinilabs")) {
      return PROVIDER_LOGO_ASSETS.clinilabs.src;
    }

    if (normalizedName.includes("london health")) {
      return PROVIDER_LOGO_ASSETS["london-health-company"].src;
    }

    if (normalizedName.includes("medical diagnosis")) {
      return PROVIDER_LOGO_ASSETS["medical-diagnosis"].src;
    }

    return null;
  };

  const logoSrc = getProviderLogo(provider);

  if (!logoSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded ${className}`}
      >
        <span className="text-sm font-medium text-brand-navy">{provider}</span>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={`${provider} logo`}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
};
