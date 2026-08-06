import { Helmet } from "react-helmet-async";
import { Link } from "@/lib/router-compat";
import MainLayout from "@/layouts/MainLayout";
import { CategoryStandardHero } from "@/components/category/CategoryStandardHero";
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

      <CategoryStandardHero pillLabel="Compare by Symptom" />

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-[#08122b] min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
              What are you experiencing?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Select a symptom to see which blood tests are recommended, what biomarkers to check, and compare prices across providers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {symptomPages.map((symptom) => (
              <Link key={symptom.slug} to={`/compare/symptoms/${symptom.slug}`} className="group block h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#22c0d4]/60 hover:bg-white/[0.08]">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                      style={{ backgroundColor: `${symptom.colorHex}22` }}
                    >
                      {symptom.icon}
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#22c0d4] transition-colors">
                      {symptom.name}
                    </h3>
                  </div>
                  <p className="text-sm text-white/90 mb-4">{symptom.shortDescription}</p>
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
