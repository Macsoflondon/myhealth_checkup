import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BrandTypography from "@/components/BrandTypography";

const TypographyShowcasePage = () => {
  return (
    <>
      <Helmet>
        <title>Brand Typography System | myhealth checkup</title>
        <meta 
          name="description" 
          content="Typography guidelines and component library for myhealth checkup brand. View Montserrat, Lato, and EB Garamond font examples and usage guidelines." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <BrandTypography />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TypographyShowcasePage;