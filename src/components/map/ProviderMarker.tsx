import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { providers } from '@/data/compare/providers';

// Cast Marker to avoid TypeScript issues
const RMarker = Marker as any;

interface ProviderMarkerProps {
  position: [number, number];
  providerId?: string;
  name: string;
  address: string;
  distance?: number;
  accessNote?: string;
}

// Create custom provider icon
const createProviderIcon = (providerId?: string) => {
  const provider = providers.find(p => p.id === providerId);
  
  if (provider?.logo) {
    return L.divIcon({
      html: `
        <div class="provider-marker">
          <img src="${provider.logo}" alt="${provider.name}" class="provider-logo" />
          <div class="marker-pin"></div>
        </div>
      `,
      className: 'custom-provider-marker',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50]
    });
  }
  
  // Fallback to default marker for unknown providers
  return new L.Icon.Default();
};

// Helper function to format distance
const formatDistance = (distance?: number) => {
  if (typeof distance !== 'number') return '';
  return `${(distance / 1000).toFixed(2)} km away`;
};

export const ProviderMarker: React.FC<ProviderMarkerProps> = ({
  position,
  providerId,
  name,
  address,
  distance,
  accessNote
}) => {
  const icon = createProviderIcon(providerId);
  const provider = providers.find(p => p.id === providerId);

  return (
    <RMarker position={position} icon={icon}>
      <Popup>
        <div className="space-y-2 provider-popup">
          <div className="flex items-center gap-2">
            {provider?.logo && (
              <img 
                src={provider.logo} 
                alt={provider.name}
                className="w-6 h-6 object-contain"
              />
            )}
            <div className="font-semibold text-sm">{name}</div>
          </div>
          <div className="text-xs text-muted-foreground">{address}</div>
          {distance && (
            <div className="text-xs font-medium text-primary">
              {formatDistance(distance)}
            </div>
          )}
          {accessNote && (
            <div className="text-xs text-muted-foreground border-t pt-1">
              <strong>Services:</strong> {accessNote}
            </div>
          )}
          {provider?.website && (
            <a 
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-primary hover:underline"
            >
              Visit {provider.name} →
            </a>
          )}
        </div>
      </Popup>
    </RMarker>
  );
};