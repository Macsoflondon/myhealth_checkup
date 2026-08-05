import { Helmet } from "react-helmet-async";
import { Link } from "@/lib/router-compat";
import MainLayout from "@/layouts/MainLayout";
import { CategoryStandardHero } from "@/components/category/CategoryStandardHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { ArrowRight, Target, Shield, Clock } from "lucide-react";
import { goalPages } from "@/data/goalPages";

const BENEFITS = [
  { icon: Target, title: "Outcome-led matching", description: "Start with the goal you're working towards and see the panels that support it" },
  { icon: Shield, title: "UKAS accredited labs", description: "Every listed provider uses UKAS-accredited UK laboratories" },
  { icon: Clock, title: "Clear turnaround", description: "Typical result times shown alongside price and biomarker coverage" },
] as const;

const CompareByGoalPage = () => {
  return (
    <MainLayout mainClassName="flex-1 bg-white">
      <Helmet>
        <title>Compare Tests by Goal | myhealth checkup</title>
        <meta
          name="description"
          content="Choose blood tests based on your health goals. Compare tests for longevity, performance, weight loss, and preventative health from accredited UK providers."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/compare/goals" />
        <meta property="og:title" content="Compare Tests by Goal | myhealth checkup" />
        <meta property="og:description" content="Choose blood tests based on your health goals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/compare/goals" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Compare Tests by Goal",
            description: "Choose blood tests based on your health goals.",
            url: "https://myhealthcheckup.co.uk/compare/goals",
          })}
        </script>
      </Helmet>

      <CategoryStandardHero pillLabel="Compare by Goal" />

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-[#08122b] min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
              What's your health goal?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Select a goal to see the recommended test panels, key biomarkers, and compare options from trusted providers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {goalPages.map((goal) => (
              <Link key={goal.slug} to={`/compare/goals/${goal.slug}`} className="group block h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#22c0d4]/60 hover:bg-white/[0.08]">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                      style={{ backgroundColor: `${goal.colorHex}22` }}
                    >
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#22c0d4] transition-colors">
                        {goal.name}
                      </h3>
                      <p className="text-xs text-white/78 mt-0.5">{goal.shortDescription}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 mb-4 line-clamp-2">
                    {goal.explanation.slice(0, 120)}…
                  </p>
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
        benefitsTitle="Why compare by goal?"
        benefits={[BENEFITS[0], BENEFITS[1], BENEFITS[2]]}
      />
    </MainLayout>
  );
};

export default CompareByGoalPage;
