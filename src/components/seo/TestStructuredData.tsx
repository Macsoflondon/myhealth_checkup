import { Helmet } from "react-helmet-async";
import { TestPageData } from "@/types/TestPageTypes";

interface TestStructuredDataProps {
  data: TestPageData;
  url?: string;
}

const TestStructuredData = ({ data, url }: TestStructuredDataProps) => {
  const lowestPrice = data.providers.reduce((min, p) => 
    p.price < min ? p.price : min, 
    data.providers[0]?.price || 0
  );
  
  const highestPrice = data.providers.reduce((max, p) => 
    p.price > max ? p.price : max, 
    data.providers[0]?.price || 0
  );

  // Product structured data for rich search results
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.title,
    "description": data.metaDescription,
    "category": data.category,
    "brand": {
      "@type": "Brand",
      "name": "myhealth checkup"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": lowestPrice,
      "highPrice": highestPrice,
      "offerCount": data.providers.length,
      "offers": data.providers.map((provider) => ({
        "@type": "Offer",
        "name": `${data.title} - ${provider.name}`,
        "price": provider.price,
        "priceCurrency": "GBP",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": provider.name
        },
        "url": provider.bookingUrl || provider.url
      }))
    }
  };

  // MedicalTest structured data
  const medicalTestSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalTest",
    "name": data.title,
    "description": data.description,
    "usedToDiagnose": data.biomarkerSections.flatMap(section => section.markers).join(", "),
    "relevantSpecialty": {
      "@type": "MedicalSpecialty",
      "name": data.category
    }
  };

  // BreadcrumbList structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://myhealthcheckup.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Compare Tests",
        "item": "https://myhealthcheckup.com/compare"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.providers[0]?.name || "Provider",
        "item": `https://myhealthcheckup.com/${data.providers[0]?.name?.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": data.title
      }
    ]
  };

  // FAQPage structured data if we have why choose items
  const faqSchema = data.whyChooseItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What does the ${data.title} test include?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": data.biomarkerSections.map(s => `${s.title}: ${s.markers.join(", ")}`).join(". ")
        }
      },
      {
        "@type": "Question",
        "name": `Why should I choose the ${data.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": data.whyChooseItems.join(" ")
        }
      },
      {
        "@type": "Question",
        "name": `How much does the ${data.title} cost?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Prices range from £${lowestPrice} to £${highestPrice} depending on the provider. We compare ${data.providers.length} trusted UK providers.`
        }
      }
    ]
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(medicalTestSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default TestStructuredData;
