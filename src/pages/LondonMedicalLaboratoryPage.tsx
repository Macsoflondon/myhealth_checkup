import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import SimpleProviderProfile from "@/components/providers/SimpleProviderProfile";

const LondonMedicalLaboratoryPage = () => (
  <MainLayout>
    <Helmet>
      <title>London Medical Laboratory | myhealth checkup</title>
      <meta name="description" content="London Medical Laboratory — UKAS-accredited private blood testing with next-day in-store results and home test kits posted across the UK." />
    </Helmet>
    <SimpleProviderProfile
      providerId="london-medical-laboratory"
      title="London Medical Laboratory"
      logo="/lovable-uploads/provider-london-medical.png"
      website="https://londonmedicallaboratory.com"
      mission="London Medical Laboratory exists to deliver fast, accurate private blood testing without the long waits. We combine a UKAS-accredited central laboratory with a national network of in-store partners and a postal home-testing service, giving people across the UK reliable access to the diagnostics they need to take control of their health."
      about="London Medical Laboratory (LML) is a UKAS-accredited medical laboratory headquartered in central London. We process samples from thousands of partner pharmacies and clinics nationwide, as well as finger-prick home test kits sent directly to customers. Every test is analysed on hospital-grade Roche equipment by qualified biomedical scientists, with results typically available the next day for in-store tests and within 3–4 working days for home kits."
      services="Our test menu covers general health profiles, full blood counts, lipid and cholesterol panels, liver and kidney function, diabetes (HbA1c), thyroid, hormone and fertility testing, vitamin and mineral analysis, allergy and intolerance screening, sexual health, and cardiovascular risk assessment. Tests can be booked at over 1,000 partner locations including selected pharmacies, or ordered as a home finger-prick kit with prepaid return postage."
      whatsNew="We continue to expand our partner network and at-home test range, including new menopause and perimenopause profiles, advanced cardiac risk markers, and convenient subscription bundles for regular monitoring. Doctor-reviewed result reports are included with every test, written in plain English so customers can understand exactly what their numbers mean."
      categories={[
        { heading: "Wellness & General Health", items: ["General Health Profile", "Advanced Wellness Check", "Full Blood Count", "Liver & Kidney Function", "Diabetes (HbA1c)"] },
        { heading: "Hormones & Fertility", items: ["Female Hormone Profile", "Male Hormone & Testosterone", "Thyroid Function", "Menopause & Perimenopause", "Fertility (AMH) Test"] },
        { heading: "Vitamins & Minerals", items: ["Vitamin D", "Vitamin B12 & Folate", "Iron Profile", "Magnesium", "Zinc & Copper"] },
        { heading: "Cardiovascular & Sexual Health", items: ["Lipid & Cholesterol Profile", "Cardiac Risk Assessment", "Full STI Screen", "HIV & Syphilis"] },
      ]}
      closingNote="Order online, collect a kit at home or visit a partner pharmacy. Doctor-reviewed reports included with every test."
    />
  </MainLayout>
);

export default LondonMedicalLaboratoryPage;
