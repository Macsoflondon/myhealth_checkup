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
      logo="/lovable-uploads/provider-clinilabs.png"
      website="https://www.clinilabs.co.uk"
      mission="Clinilabs exists to give people in the UK direct access to high-quality clinical laboratory testing without the long waits. Our focus is on accurate diagnostics, fast turnaround and clear reporting so you can make informed decisions about your health alongside your GP or specialist."
      about="Clinilabs is a private diagnostics provider operating from UKAS-accredited facilities, covering a wide spectrum of pathology from routine blood profiles to specialist diagnostics. Samples are processed by qualified biomedical scientists using validated assays on hospital-grade analysers, with results typically available within 3–6 working days and reviewed before release."
      services="Our test menu includes general health screens, hormone profiles, thyroid panels, vitamin and mineral analysis, sexual health diagnostics, cardiovascular markers and specialist pathology requests. Tests are available via in-clinic phlebotomy at partner sites or via postal sample kits where appropriate, with clear written reports included as standard."
      whatsNew="We continue to expand our specialist diagnostic menu and partner clinic network, with new advanced cardiac, inflammation and metabolic profiles available. Online ordering, transparent pricing and clinician-reviewed reports are included with every test."
      categories={[
        { heading: "Blood Testing", items: ["General Health Profile", "Full Blood Count", "Lipid Profile", "Liver Function", "Kidney Function", "HbA1c & Diabetes"] },
        { heading: "Hormones & Wellness", items: ["Thyroid Panel", "Male Hormone Profile", "Female Hormone Profile", "Vitamin D", "Vitamin B12 & Folate", "Iron Profile"] },
        { heading: "Specialist Diagnostics", items: ["Cardiac Risk Assessment", "Inflammation Markers", "Sexual Health Screening", "Allergy Testing", "Coeliac Screening"] },
      ]}
      closingNote="Book in-clinic phlebotomy at a partner site or order a postal kit online. Doctor-reviewed reports are included with every test."
    />
  </MainLayout>
);

export default ClinilabsPage;
