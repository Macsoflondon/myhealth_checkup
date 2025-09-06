import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EnhancedClinicMap } from "@/components/map/EnhancedClinicMap";
import CookieConsent from "@/components/compliance/CookieConsent";
import { Helmet } from "react-helmet-async";
import "@/components/EnhancedClinicMap.css";

const FindClinicPage: React.FC = () => {
  const title = "Find a Clinic Near You | myhealth checkup";
  const description = "Find nearby private health test locations from top providers like Medichecks, London Medical Laboratory, and more. Search by postcode for instant results.";
  const canonical = "https://myhealth-checkup.example/find-a-clinic";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="private health tests, clinic finder, blood tests, health screening, medical testing near me, UK health tests" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.placename" content="United Kingdom" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="myhealth checkup" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="@myhealthcheckup" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Find a Clinic Near You",
            description,
            url: canonical,
            mainEntity: {
              "@type": "Service",
              name: "Health Test Clinic Locator",
              description: "Find nearby private health testing clinics and laboratories",
              areaServed: "United Kingdom",
              serviceType: "Medical Testing",
              provider: {
                "@type": "Organization",
                name: "myhealth checkup"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <EnhancedClinicMap />
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
};

export default FindClinicPage;
