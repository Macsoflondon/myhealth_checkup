import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/sections/PageBanner";
import ExpertQuotes from "@/components/sections/ExpertQuotes";

const ExpertGuidancePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Expert Guidance | myhealth checkup</title>
        <meta
          name="description"
          content="Our platform standards are informed by the UK's leading health authorities, including NHS, NICE and UKAS."
        />
        <link rel="canonical" href="https://www.myhealthcheckup.co.uk/expert-guidance" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Backed by"
          accent="Expert Guidance"
          subtitle="Our platform standards are informed by the UK's leading health authorities."
        />
        <ExpertQuotes />
      </main>
      <Footer />
    </div>
  );
};

export default ExpertGuidancePage;
