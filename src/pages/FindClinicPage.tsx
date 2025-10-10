import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClinicMap from "@/components/ClinicMap";
import CookieConsent from "@/components/compliance/CookieConsent";
import { Helmet } from "react-helmet-async";

const FindClinicPage: React.FC = () => {
  const title = "Find a Clinic | myhealth checkup";
  const description = "Find nearby private health test locations and clinics in the UK. Search by postcode and view clinic details on an interactive map.";
  const canonical = "https://myhealth-checkup.example/find-clinic";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Find a Clinic",
            description,
            url: canonical,
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <h1 className="sr-only">Find a Clinic</h1>
          <ClinicMap />
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
};

export default FindClinicPage;
