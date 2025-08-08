import React from 'react';

interface ProviderLogoProps {
  provider: string;
  className?: string;
}

export const ProviderLogo = ({ provider, className = "h-8 w-auto" }: ProviderLogoProps) => {
  const getProviderLogo = (providerName: string) => {
    const normalizedName = providerName.toLowerCase();
    
    if (normalizedName.includes('medichecks')) {
      return '/lovable-uploads/ec80388e-5881-4301-9d04-207aee8293be.png';
    }
    
    if (normalizedName.includes('goodbody')) {
      return '/lovable-uploads/545646ea-1bc4-430c-a44a-9697e2a4e391.png';
    }
    
    if (normalizedName.includes('thriva')) {
      return '/lovable-uploads/f9b8b25a-2cc4-40a8-84a3-ea739871da6b.png';
    }
    
    if (normalizedName.includes('randox')) {
      return '/lovable-uploads/472a9177-1f4a-462d-807a-4c6d479039b1.png';
    }
    
    if (normalizedName.includes('london medical laboratory')) {
      return '/lovable-uploads/4271ff87-139b-420e-b986-769a01084d1b.png';
    }
    
    if (normalizedName.includes('lola')) {
      return '/lovable-uploads/dfe1dfc6-464b-4200-9b0d-8e1ef6ec3f79.png';
    }
    
    if (normalizedName.includes('tuli')) {
      return '/lovable-uploads/11b262c6-6809-4179-be41-47c54752fd80.png';
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