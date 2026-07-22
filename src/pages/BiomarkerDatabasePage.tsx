import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BiomarkerLibraryUI from "@/components/biomarker-library/BiomarkerLibraryUI";

export default function BiomarkerDatabasePage() {
  return (
    <>
      <Helmet>
        <title>Biomarker Library | myhealth checkup</title>
        <meta name="description" content="Explore our comprehensive biomarker library. 610 biomarkers across 25 categories — what each test measures, reference ranges, and clinical tips." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/biomarker-database" />
      </Helmet>
      <Header />
      <BiomarkerLibraryUI />
      <Footer />
    </>
  );
}
