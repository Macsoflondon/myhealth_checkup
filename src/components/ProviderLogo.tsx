import React from 'react';

interface ProviderLogoProps {
  provider: string;
  className?: string;
}

export const ProviderLogo = ({ provider, className = "h-8 w-auto" }: ProviderLogoProps) => {
  const getProviderLogo = (providerName: string) => {
    const normalizedName = providerName.toLowerCase();
    
    if (normalizedName.includes('thriva')) {
      return '/lovable-uploads/503c637a-565e-4bf8-993e-6bd18111d4bd.png';
    }
    
    if (normalizedName.includes('medichecks')) {
      return '/lovable-uploads/99ec1302-6f70-4802-8071-9d8affd9b8ec.png';
    }
    
    if (normalizedName.includes('goodbody')) {
      return '/lovable-uploads/fcff419c-9bf2-4f2c-b144-23c529b5eb11.png';
    }
    
    // Return null if no specific logo is available
    return null;
  };

  const logoSrc = getProviderLogo(provider);
  
  if (!logoSrc) {
    // Return text fallback if no logo is available
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
      onError={(e) => {
        // Fallback to text if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        if (target.nextSibling) {
          (target.nextSibling as HTMLElement).style.display = 'flex';
        }
      }}
    />
  );
};