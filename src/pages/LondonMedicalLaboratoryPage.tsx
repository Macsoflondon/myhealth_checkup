import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import SimpleProviderProfile from "@/components/providers/SimpleProviderProfile";

const LondonMedicalLaboratoryPage = () => (
  <MainLayout>
    <Helmet>
      <title>London Health Company | myhealth checkup</title>
      <meta name="description" content="London Health Company — London-based private health testing and wellness screening, including blood tests, hormone profiles and full body health checks." />
    </Helmet>
    <SimpleProviderProfile
      providerId="london-medical-laboratory"
      title="London Health Company"
      tagline="Your Local Health Expert"
      logo="/lovable-uploads/provider-london-health-company.png"
      website="https://londonhealthcompany.co.uk"
      mission="London Health Company exists to make accurate, accessible private health testing available across the capital and beyond. We focus on convenient appointments, transparent pricing, and clinician-reviewed results so customers can act on their data with confidence."
      about="A London-based private healthcare provider partnering with UKAS-accredited laboratories. Our team combines high street accessibility with hospital-grade diagnostics, supporting individuals, families and corporate clients with preventative screening and targeted blood work."
      services="We offer a broad menu of private blood tests, hormone profiles, comprehensive wellness screens, sexual health diagnostics and travel medicals. Appointments are available across London with at-home sample collection options for selected tests."
      categories={[
        { heading: "Wellness Screens", items: ["Essential Health Check", "Advanced Wellness Profile", "Executive Health Screen", "Annual Health MOT"] },
        { heading: "Blood Tests", items: ["Full Blood Count", "Lipid & Cholesterol Profile", "Liver & Kidney Function", "Diabetes (HbA1c)", "Vitamin D & B12", "Iron Studies"] },
        { heading: "Hormones & Fertility", items: ["Female Hormone Panel", "Male Hormone & Testosterone", "Thyroid Function", "Menopause Profile", "Fertility (AMH) Test"] },
        { heading: "Sexual Health", items: ["Full STI Screen", "HIV & Syphilis Test", "Chlamydia & Gonorrhoea"] },
      ]}
    />
  </MainLayout>
);

export default LondonMedicalLaboratoryPage;
