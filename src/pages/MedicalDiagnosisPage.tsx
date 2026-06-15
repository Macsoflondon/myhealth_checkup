import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import SimpleProviderProfile from "@/components/providers/SimpleProviderProfile";

const MedicalDiagnosisPage = () => (
  <MainLayout>
    <Helmet>
      <title>Medical Diagnosis | myhealth checkup</title>
      <meta name="description" content="Medical Diagnosis — specialist private diagnostics with fast turnaround blood testing and health screening across the UK." />
    </Helmet>
    <SimpleProviderProfile
      providerId="medical-diagnosis"
      title="Medical Diagnosis"
      logo="/lovable-uploads/provider-medical-diagnosis.png"
      website="https://www.medical-diagnosis.co.uk"
      mission="Medical Diagnosis was built around a simple idea: people deserve faster, clearer answers about their health. We focus on specialist diagnostics and rapid blood testing, partnering with accredited UK laboratories to deliver dependable, consultant-reviewed results that customers can act on."
      about="Medical Diagnosis is a UK-wide private diagnostics provider offering venous blood collection, specialist pathology and consultant-reviewed reporting. Our service is designed for customers who want quick clarity on symptoms, monitoring needs or pre-treatment workups, with samples processed by accredited laboratory partners and reported through a secure online portal."
      services="We provide a comprehensive range of blood tests covering general health, hormones, cardiovascular risk, autoimmune markers, allergy testing and specialist pathology. Typical turnaround is 3–6 working days, with selected tests reported faster. Phlebotomy is available at partner clinics across the UK and selected tests can be arranged as home visits."
      whatsNew="We are expanding our menu of advanced cardiac, autoimmune and tumour marker panels, plus new bundled health checks designed for monitoring chronic conditions. Online booking and digital report delivery are now standard across all tests."
      categories={[
        { heading: "Fast Blood Tests", items: ["Full Blood Count", "Cholesterol & Lipids", "Liver Function", "Kidney Function", "Glucose & HbA1c", "Thyroid Profile"] },
        { heading: "Hormones & Wellness", items: ["Male Hormone Profile", "Female Hormone Profile", "Vitamin D", "Vitamin B12 & Folate", "Iron Studies", "Cortisol"] },
        { heading: "Specialist Diagnostics", items: ["Cardiac Risk Markers", "Autoimmune & Rheumatology", "Allergy & Intolerance Panels", "Coeliac Screening", "Tumour Markers (PSA, CA-125)"] },
      ]}
      closingNote="Book a partner-clinic appointment or home visit online. Consultant-reviewed digital reports are included with every test."
    />
  </MainLayout>
);

export default MedicalDiagnosisPage;
