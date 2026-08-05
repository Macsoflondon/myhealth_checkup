import { Helmet } from "react-helmet-async";
import QuizCTABanner from "@/components/sections/QuizCTABanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BiomarkerLibraryUI from "@/components/biomarker-library/BiomarkerLibraryUI";

export default function BiomarkerDatabasePage() {
  return (
    <>
      <Helmet>
        <title>Biomarker Library | myhealth checkup</title>
        <meta name="description" content="Explore our biomarker library — what each blood test marker measures, reference ranges, and clinical tips written in plain English." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/biomarker-database" />
      </Helmet>
      <Header />
      <BiomarkerLibraryUI />
      <section className="bg-white py-12 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <QuizCTABanner />
        </div>
      </section>
      <Footer />
    </>
  );
}
