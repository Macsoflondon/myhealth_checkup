import React from 'react';

interface ProviderLogoProps {
  provider: string;
  className?: string;
  priority?: boolean;
}

export const ProviderLogo = ({ provider, className = "h-20 w-auto", priority = false }: ProviderLogoProps) => {
  const getProviderLogo = (providerName: string) => {
    const normalizedName = providerName.toLowerCase();
    
    if (normalizedName.includes('medichecks')) {
      return '/lovable-uploads/provider-medichecks-light.png';
    }
    
    if (normalizedName.includes('goodbody')) {
      return '/lovable-uploads/provider-goodbody-new-v3.png';
    }
    
    if (normalizedName.includes('thriva')) {
      return '/lovable-uploads/provider-thriva.png';
    }
    
    if (normalizedName.includes('randox')) {
      return '/lovable-uploads/provider-randox.png';
    }
    
    if (normalizedName.includes('london medical laboratory')) {
      return '/lovable-uploads/provider-london-medical.png';
    }
    
    if (normalizedName.includes('lola')) {
      return '/lovable-uploads/provider-lola-health.png';
    }
    
    if (normalizedName.includes('clinilabs')) {
      return '/lovable-uploads/provider-clinilabs.png';
    }
    
    if (normalizedName.includes('london health')) {
      return '/lovable-uploads/provider-london-health-company.png';
    }
    
    if (normalizedName.includes('medical diagnosis')) {
      return '/lovable-uploads/provider-medical-diagnosis.png';
    }
    
    return null;
  };

  const logoSrc = getProviderLogo(provider);
  
  if (!logoSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`}>
        <span className="text-sm font-medium text-gray-600">{provider}</span>
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