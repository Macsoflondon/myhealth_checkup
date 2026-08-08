import { Helmet } from "react-helmet-async";
import { Link } from "@/lib/router-compat";
import MainLayout from "@/layouts/MainLayout";
import { StandardPageHero } from "@/components/layout/StandardPageHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { ArrowRight, Activity, Shield, Clock } from "lucide-react";
import { symptomPages } from "@/data/symptomPages";

const BENEFITS = [
  { icon: Activity, title: "Symptom-led matching", description: "Start with what you're feeling and see the tests commonly used to investigate it" },
  { icon: Shield, title: "UKAS accredited labs", description: "Every listed provider uses UKAS-accredited UK laboratories" },
  { icon: Clock, title: "Clear turnaround", description: "Typical result times shown alongside price and biomarker coverage" },
] as const;

const CompareBySymptomPage = () => {
  return (
    <MainLayout mainClassName="flex-1 bg-white">
      <Helmet>
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Compare Tests by Symptom",
            description: "Find the right blood test based on your symptoms.",
            url: "https://myhealthcheckup.co.uk/compare/symptoms",
          })}
        </script>
      </Helmet>

      <StandardPageHero
        title="Compare by symptom"
        strapline="Start with what you're experiencing and see the tests and biomarkers commonly used to investigate it."
        stats={[`${symptomPages.length} symptoms covered`, "UKAS accredited labs"]}
      />

      <section className="py-9 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-white min-h-[60vh]">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {symptomPages.map((symptom) => (
              <Link key={symptom.slug} to={`/compare/symptoms/${symptom.slug}`} className="group block h-full">
                <div className="h-full rounded-2xl border border-[#081129]/10 bg-white shadow-[0_2px_12px_rgba(8,17,41,0.06)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#22c0d4]/60 hover:shadow-[0_8px_24px_rgba(8,17,41,0.10)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-[#081129]/10"
                      style={{ backgroundColor: `${symptom.colorHex}22` }}
                    >
                      {symptom.icon}
                    </div>
                    <h3 className="text-lg font-heading font-bold text-[#081129] group-hover:text-[#22c0d4] transition-colors">
                      {symptom.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[#081129]/80 mb-4">{symptom.shortDescription}</p>
                  <span className="flex items-center text-sm font-semibold text-[#22c0d4] group-hover:text-[#e70d69] transition-colors">
                    View recommended tests
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategoryPageBottom
        benefitsTitle="Why compare by symptom?"
        benefits={[BENEFITS[0], BENEFITS[1], BENEFITS[2]]}
      />
    </MainLayout>
  );
};

export default CompareBySymptomPage;
