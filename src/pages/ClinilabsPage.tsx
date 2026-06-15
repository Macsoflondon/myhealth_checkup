import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import SimpleProviderProfile from "@/components/providers/SimpleProviderProfile";

const ClinilabsPage = () => (
  <MainLayout>
    <Helmet>
      <title>Clinilabs | myhealth checkup</title>
      <meta name="description" content="Explore Clinilabs — a UKAS-accredited clinical laboratory offering a wide range of private blood tests and diagnostic services across the UK." />
    </Helmet>
    <SimpleProviderProfile
      providerId="clinilabs"
      title="Clinilabs"
      tagline="Clinical Precision, Trusted Results"
      logo="/lovable-uploads/provider-clinilabs.png"
      website="https://www.clinilabs.co.uk"
      mission="Clinilabs delivers rigorous clinical laboratory analysis to consumers and clinicians across the UK. Our focus is on accurate diagnostics, fast turnaround, and clear reporting so you can make informed decisions about your health."
      about="Operating from UKAS-accredited facilities, Clinilabs covers a wide spectrum of pathology — from routine blood profiles to specialist diagnostics. Samples are processed by qualified scientists using validated assays, with results typically available within 3–6 working days."
      services="Our test menu includes general health screens, hormone profiles, thyroid panels, vitamin and mineral analysis, sexual health diagnostics, cardiovascular markers, and specialist pathology requests. Tests are available via in-clinic phlebotomy or postal sample kits where appropriate."
      categories={[
        { heading: "Blood Testing", items: ["General Health Profile", "Full Blood Count", "Lipid Profile", "Liver Function", "Kidney Function", "HbA1c & Diabetes"] },
        { heading: "Hormones & Wellness", items: ["Thyroid Panel", "Male Hormone Profile", "Female Hormone Profile", "Vitamin D", "Vitamin B12 & Folate", "Iron Profile"] },
        { heading: "Specialist Diagnostics", items: ["Cardiac Risk Assessment", "Inflammation Markers", "Sexual Health Screening", "Allergy Testing", "Coeliac Screening"] },
      ]}
    />
  </MainLayout>
);

export default ClinilabsPage;
