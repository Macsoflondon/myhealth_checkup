import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import SimpleProviderProfile from "@/components/providers/SimpleProviderProfile";

const LondonHealthCompanyPage = () => (
  <MainLayout>
    <Helmet>
      <title>London Health Company | myhealth checkup</title>
      <meta name="description" content="London Health Company — accessible private blood testing, wellness screening and hormone profiles across London with clinician-reviewed results." />
    </Helmet>
    <SimpleProviderProfile
      providerId="london-health-company"
      title="London Health Company"
      logo="/lovable-uploads/provider-london-health-company.png"
      website="https://londonhealthcompany.co.uk"
      mission="London Health Company exists to make accurate, accessible private health testing available across the capital and beyond. We focus on convenient appointments, transparent pricing and clinician-reviewed results so customers can act on their data with confidence."
      about="A London-based private healthcare provider partnering with UKAS-accredited laboratories. Our team combines high-street accessibility with hospital-grade diagnostics, supporting individuals, families and corporate clients with preventative screening and targeted blood work across London and the wider UK."
      services="We offer a broad menu of private blood tests, hormone profiles, comprehensive wellness screens, sexual health diagnostics and travel medicals. Appointments are available at clinics across London with at-home sample collection options for selected tests, and results are typically returned within 4–8 working days with a written clinician review."
      whatsNew="We are continuing to expand our central London clinic footprint and at-home phlebotomy service, plus new corporate wellness packages for small and medium-sized employers. Online booking, secure digital reports and follow-up consultations are now included as standard with every test."
      categories={[
        { heading: "Wellness Screens", items: ["Essential Health Check", "Advanced Wellness Profile", "Executive Health Screen", "Annual Health MOT"] },
        { heading: "Blood Tests", items: ["Full Blood Count", "Lipid & Cholesterol Profile", "Liver & Kidney Function", "Diabetes (HbA1c)", "Vitamin D & B12", "Iron Studies"] },
        { heading: "Hormones & Fertility", items: ["Female Hormone Panel", "Male Hormone & Testosterone", "Thyroid Function", "Menopause Profile", "Fertility (AMH) Test"] },
        { heading: "Sexual Health", items: ["Full STI Screen", "HIV & Syphilis Test", "Chlamydia & Gonorrhoea"] },
      ]}
      closingNote="Book online for an appointment at a central London clinic, or arrange at-home phlebotomy for selected tests."
    />
  </MainLayout>
);

export default LondonHealthCompanyPage;
