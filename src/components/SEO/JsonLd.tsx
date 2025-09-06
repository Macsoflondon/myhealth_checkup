import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

// Common structured data templates
export const LocalBusinessJsonLd = (business: {
  name: string;
  address: string;
  telephone?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: business.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address,
    addressCountry: "GB"
  },
  ...(business.telephone && { telephone: business.telephone }),
  ...(business.latitude && business.longitude && {
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.latitude,
      longitude: business.longitude
    }
  }),
  ...(business.openingHours && { openingHours: business.openingHours })
});

export const MedicalOrganizationJsonLd = (org: {
  name: string;
  address: string;
  services: string[];
  areaServed?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: org.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: org.address,
    addressCountry: "GB"
  },
  medicalSpecialty: org.services,
  ...(org.areaServed && { areaServed: org.areaServed })
});