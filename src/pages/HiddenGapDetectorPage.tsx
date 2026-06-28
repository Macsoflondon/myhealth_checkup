import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HiddenGapDetector from '@/components/ai/HiddenGapDetector';

const HiddenGapDetectorPage = () => {
  return (
    <>
      <Helmet>
        <title>Hidden Gap Detector | myhealth checkup</title>
        <meta
          name="description"
          content="Discover which preventive health screenings you may be missing. Our AI-powered Hidden Gap Detector analyses your profile against NHS and NICE guidelines to identify health testing gaps."
        />
        <meta name="keywords" content="preventive health screening, health gap detector, missing health tests, NHS screening guidelines, UK health checks, preventive healthcare" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/hidden-gap-detector" />

        <meta property="og:title" content="Hidden Gap Detector | myhealth checkup" />
        <meta property="og:description" content="Discover which preventive health screenings you may be missing based on your age, gender, and lifestyle." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/hidden-gap-detector" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hidden Gap Detector | myhealth checkup" />
        <meta name="twitter:description" content="AI-powered tool that identifies gaps in your preventive health coverage based on NHS guidelines." />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Hidden Gap Detector',
            description: 'AI-powered preventive health gap analysis tool based on NHS and NICE screening guidelines',
            url: 'https://myhealthcheckup.co.uk/hidden-gap-detector',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'GBP',
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 py-10">
          <HiddenGapDetector />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HiddenGapDetectorPage;
