import { Helmet } from "react-helmet-async";
import QuizCTABanner from "@/components/sections/QuizCTABanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BiomarkerLibraryUI from "@/components/biomarker-library/BiomarkerLibraryUI";

export default function BiomarkerDatabasePage() {
  return (
    <>
      <Helmet>
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
