import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/sections/PageBanner";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Us | myhealth checkup</title>
        <meta
          name="description"
          content="myhealth checkup is the UK's first fully independent comparison platform for private health testing. Learn about our mission, our AI diagnostic integration engine, and what we are building."
        />
      </Helmet>

      <Header />

      <PageBanner
        title="About myhealth checkup"
        subtitle="Decision infrastructure for UK private diagnostics."
      />

      <main className="flex-1 bg-white">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Mission Statement */}
          <section className="mb-16">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[#081129] mb-6">
              Our Mission Statement
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#22c0d4] to-[#e70d69] mb-8 rounded-full" />
            <div className="font-['DM_Sans'] text-[#081129]/85 text-lg leading-relaxed space-y-5">
              <p className="text-xl font-medium text-[#081129]">
                Your health is your greatest asset. It deserves clarity, not confusion.
              </p>
              <p>
                At myhealth checkup, we exist to fix a broken market. The UK private diagnostics sector is growing fast, but it remains fragmented, opaque, and genuinely difficult for consumers to navigate. Dozens of providers, inconsistent terminology, hidden costs, and no way to compare what you are actually buying. We built myhealth checkup to change that.
              </p>
              <p>
                We are the UK's first fully independent comparison platform for private health testing. No paid rankings. No in-house lab promotions. No financial incentive to push you towards any particular provider. Just transparent, biomarker-level comparison across blood tests, cancer screening, wellness panels, hormone testing, and longevity diagnostics, all from UKAS-accredited laboratories, CQC-regulated clinics, and ISO 15189-certified facilities.
              </p>
              <p>
                Our platform connects health-conscious consumers with the UK's most trusted private diagnostic providers. You can compare tests not just by price, but by the specific biomarkers included, turnaround time, sample method, and location options. Everything you need to make an informed decision, in one place, for free.
              </p>
              <p className="text-xl font-semibold text-[#081129]">
                We are not a marketplace. We are decision infrastructure.
              </p>
            </div>
          </section>

          {/* Our Core Mission */}
          <section className="mb-16">
            <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-[#081129] mb-4">
              Our Core Mission
            </h3>
            <div className="h-0.5 w-16 bg-[#22c0d4] mb-6 rounded-full" />
            <div className="font-['DM_Sans'] text-[#081129]/85 text-base md:text-lg leading-relaxed space-y-4">
              <p>
                Too many people wait until symptoms appear before taking action on their health. Long NHS waiting lists, complex referral pathways, and a lack of accessible information make that worse. The NHS waiting list stood at 7.3 million patients in late 2025. Median waits for consultant-led referrals are running at over 13 weeks. People are being left behind, and they are increasingly turning to private diagnostics to take back control.
              </p>
              <p>
                myhealth checkup puts that control in your hands. No GP referral required. No opaque pricing. No confusion. Just clear, clinically credible information that helps you make the right decision for your health, on your terms.
              </p>
            </div>
          </section>

          {/* AI Diagnostic Integration Engine */}
          <section className="mb-16">
            <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-[#081129] mb-4">
              Our AI Diagnostic Integration Engine
            </h3>
            <div className="h-0.5 w-16 bg-[#e70d69] mb-6 rounded-full" />
            <div className="font-['DM_Sans'] text-[#081129]/85 text-base md:text-lg leading-relaxed space-y-4">
              <p>
                The next phase of myhealth checkup goes beyond comparison. We are building something that does not yet exist in the UK private diagnostics market.
              </p>
              <p>
                Our AI Diagnostic Integration Engine converts private test results into NHS-compatible structured data format using HL7 FHIR R4 standards and, with your explicit consent, feeds them directly into your NHS health record. Your private diagnostic history becomes part of your NHS file. No silos. No duplication. No results lost between appointments.
              </p>
              <p>
                The AI layer then reviews your integrated results for clinical inconsistencies or trends that may require follow-up, and alerts your GP automatically. This is not a wellness chatbot. It is a genuine clinical data bridge between the private and public healthcare systems, designed to improve continuity of care and patient safety.
              </p>
              <p>
                This capability is a UK first. Nothing equivalent exists in the private diagnostics market today. It is built to align with the NHS Long Term Plan, the 2024 Elective Reform Plan, and the UK Government's Major Conditions Strategy, all of which prioritise early detection, prevention, and private-public diagnostic integration.
              </p>
            </div>
          </section>

          {/* Why Accreditation Matters */}
          <section className="mb-16">
            <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-[#081129] mb-4">
              Why Accreditation Matters
            </h3>
            <div className="h-0.5 w-16 bg-[#22c0d4] mb-6 rounded-full" />
            <div className="font-['DM_Sans'] text-[#081129]/85 text-base md:text-lg leading-relaxed space-y-4">
              <p>
                Every provider featured on myhealth checkup is screened against the highest standards before inclusion. We only list providers operating from UKAS-accredited laboratories, CQC-regulated facilities, and ISO 15189-certified environments. If a provider does not meet those standards, they are not on our platform. It is that straightforward.
              </p>
              <p>
                We believe accreditation is not a nice-to-have. It is the minimum standard your health decisions deserve.
              </p>
            </div>
          </section>

          {/* What We Are Building Towards */}
          <section className="mb-16">
            <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-[#081129] mb-4">
              What We Are Building Towards
            </h3>
            <div className="h-0.5 w-16 bg-[#e70d69] mb-6 rounded-full" />
            <div className="font-['DM_Sans'] text-[#081129]/85 text-base md:text-lg leading-relaxed space-y-4">
              <p>
                myhealth checkup launched in 2025 and is currently in late-stage platform development, with public launch targeted for July 2026. We have onboarded six trusted UK provider partners including Medichecks, Randox Health, London Medical Laboratory, and Goodbody Clinic, with further integrations in progress.
              </p>
              <p>
                Stage 2 of the platform introduces a centralised, secure health data hub where your private results can be stored and shared, with your consent, directly with NHS GPs and specialists. This addresses one of the most persistent failures in UK healthcare: private diagnostic results sitting in silos, never informing the NHS pathway that follows.
              </p>
              <p>
                We are backed by a team combining clinical expertise, technology development, and consumer healthcare experience, and we are currently seeking grant funding to complete platform development, scale our marketing acquisition, and build the regulatory compliance infrastructure our NHS integration roadmap requires.
              </p>
              <p>
                The private diagnostics market in the UK is worth over £500 million and growing at 10 to 15 per cent annually. No independent aggregator has owned it yet. We intend to.
              </p>
            </div>
          </section>

          {/* Closing tagline */}
          <section className="mt-20 rounded-2xl bg-[#081129] px-6 py-12 md:px-12 md:py-16 text-center">
            <p className="font-montserrat font-bold text-2xl md:text-4xl bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent leading-tight">
              "Your Health. Your Choice. One Trusted Platform."
            </p>
            <p className="mt-6 font-['DM_Sans'] text-white/80 text-base md:text-lg">
              To find out more or discuss partnership opportunities, visit{" "}
              <a
                href="https://www.myhealthcheckup.co.uk"
                className="text-[#22c0d4] hover:text-[#e70d69] underline underline-offset-4 transition-colors"
              >
                www.myhealthcheckup.co.uk
              </a>{" "}
              or get in touch directly.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
