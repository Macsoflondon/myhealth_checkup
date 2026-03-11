import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import { Mail, Phone } from "lucide-react";

const GOODBODY_LOGO = "/lovable-uploads/provider-goodbody-new-v4.png";

const GoodbodyClinicPage = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Goodbody Clinic | Private Blood Tests & Cancer Screening UK</title>
        <meta name="description" content="Explore Goodbody Clinic's range of private blood tests, hormone panels, and cancer screening. UKAS accredited, CQC regulated. Results in 3-5 working days." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 pt-10 pb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#081129] mb-1">
            Goodbody Clinic
          </h1>
          <div className="h-px bg-gray-200 w-full max-w-2xl mb-6" />
        </div>

        <AboutSection />
      </div>
    </MainLayout>
  );
};

const AboutSection = () => (
  <div className="container mx-auto px-4 py-12 max-w-6xl">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
      <div className="md:col-span-2 space-y-10">
        <section>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#3d3529] mb-4">Our Mission</h2>
          <p className="text-[#4a443b] font-sans leading-relaxed">
            You know your body better than anyone. When something doesn't feel right or you simply want to stay ahead of potential health issues, waiting months for answers isn't good enough. Goodbody Clinic exists to give you fast, reliable health insights without the long NHS waiting times. Whether you've got a family history that concerns you, symptoms your GP hasn't been able to explain, or you simply want a comprehensive health MOT, we make it straightforward to get tested, get answers, and take control of your health.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#3d3529] mb-4">Who We Are</h2>
          <p className="text-[#4a443b] font-sans leading-relaxed">
            Goodbody Clinic is a trusted private health testing provider, helping thousands of people across the UK to monitor, check, and improve their health. We offer testing at our clinic in Bath, through over 250 partner clinics nationwide, or in the comfort of your own home with nurse visits and easy-to-use home test kits. Rated Excellent on Trustpilot with over 3,400 reviews. We're part of Goodbody Wellness Group, a recognised distributor and retailer of accredited wellness products and diagnostic services across the UK and Europe. Every test is carried out by qualified healthcare professionals using accredited laboratory analysis, with results typically back within 3–5 working days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#3d3529] mb-4">Our Services</h2>
          <p className="text-[#4a443b] font-sans leading-relaxed">
            We offer one of the most comprehensive ranges of private health tests available in the UK. From our Advanced Well Man and Well Woman blood tests (covering 48–51 biomarkers) to the Premium Complete Blood Test analysing 62 key biomarkers — including liver, kidney, thyroid, cholesterol, diabetes, hormones, vitamins, and minerals. For cancer screening, our TruCheck™ Early Cancer Screening blood test can detect markers for over 70 types of solid cancer tumours, or the EpiSwitch® PSE test detects prostate cancer with 94% accuracy. We also offer Full Body MRI Scans, Guardant Reveal™ liquid biopsy monitoring, hormone and fertility panels, food intolerance testing, cardiac risk assessments, and much more. No GP referral is needed for most tests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#3d3529] mb-4">What's New</h2>
          <p className="text-[#4a443b] font-sans leading-relaxed">
            We're making advanced diagnostics more accessible than ever. Our Guardant360® and Guardant Reveal™ liquid biopsy tests provide cutting-edge cancer monitoring for patients in remission. We've also partnered with Splitit, Dopple, and Clearpay so you can spread the cost of your tests with interest-free instalments, because we believe health testing should be available to everyone. With home testing kits, nationwide clinic appointments, or nurse home visits, there's no reason to put off getting the answers you need.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#3d3529] mb-6">Our Tests</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-3">Cancer Screening</h3>
              <ul className="space-y-1.5 text-[#6b6459] font-sans">
                <li>• TruCheck™ Early Cancer Screening (70 cancer types)</li>
                <li>• EpiSwitch® PSE Prostate Cancer Test (94% accuracy)</li>
                <li>• Guardant Reveal™ Liquid Biopsy Monitoring</li>
                <li>• Bowel Cancer Screening Test</li>
                <li>• Full Body MRI Scan</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-3">Women's Health</h3>
              <ul className="space-y-1.5 text-[#6b6459] font-sans">
                <li>• Advanced Well Woman Blood Test (51 biomarkers)</li>
                <li>• Female Hormone & Fertility Panel</li>
                <li>• Anti-Mullerian Hormone (AMH) Fertility Test</li>
                <li>• HPV & Cervical Cancer Screening</li>
                <li>• Menopause Blood Test</li>
                <li>• Non-Invasive Prenatal Testing (NIPT)</li>
                <li>• Early Baby Gender Blood Test</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-[#3d3529] mb-3">Men's Health</h3>
              <ul className="space-y-1.5 text-[#6b6459] font-sans">
                <li>• Advanced Well Man Blood Test (48 biomarkers)</li>
                <li>• Prostate PSA Blood Test</li>
                <li>• EpiSwitch® PSE Prostate Advanced Test</li>
                <li>• Male Hormone Blood Test</li>
                <li>• Sports & Fitness Blood Test</li>
                <li>• Cardiac Risk Blood Test</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#3d3529] mb-4">Get in Touch</h2>
          <div className="space-y-3">
            <a href="mailto:clinic@goodbodywellness.co.uk" className="flex items-center gap-3 text-[#4a443b] hover:text-[#3d3529] transition-colors font-sans">
              <Mail className="h-5 w-5 text-[#9b958a]" />
              clinic@goodbodywellness.co.uk
            </a>
            <a href="tel:01225444144" className="flex items-center gap-3 text-[#4a443b] hover:text-[#3d3529] transition-colors font-sans">
              <Phone className="h-5 w-5 text-[#9b958a]" />
              01225 444 144
            </a>
          </div>
          <p className="mt-4 text-[#6b6459] font-sans leading-relaxed">
            Test at home, at one of 200+ nationwide clinics, or with a nurse visit. No GP referral needed for most tests.
          </p>
        </section>
      </div>

      <div className="flex items-start justify-center">
        <div className="bg-[#f0ede8] rounded-lg p-10 flex items-center justify-center sticky top-32">
          <img
            src={GOODBODY_LOGO}
            alt="Goodbody Clinic logo"
            className="w-auto max-w-[200px] object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
);

export default GoodbodyClinicPage;
