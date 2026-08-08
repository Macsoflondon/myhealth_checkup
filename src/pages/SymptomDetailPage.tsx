import { useParams, Link } from "@/lib/router-compat";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import { StandardPageHero } from "@/components/layout/StandardPageHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, Search, Activity, Shield, Clock } from "lucide-react";
import { symptomPages } from "@/data/symptomPages";
import NotFound from "@/pages/NotFound";

const BENEFITS = [
  { icon: Activity, title: "Symptom-led matching", description: "See the tests commonly used to investigate this symptom" },
  { icon: Shield, title: "UKAS accredited labs", description: "Every listed provider uses UKAS-accredited UK laboratories" },
  { icon: Clock, title: "Clear turnaround", description: "Typical result times shown alongside price and biomarker coverage" },
] as const;

const SymptomDetailPage = () => {
  const { symptomSlug } = useParams<{ symptomSlug: string }>();
  const symptom = symptomPages.find((s) => s.slug === symptomSlug);

  // Render a real 404 (with noindex + prerender-status-code) instead of a
  // silent 200 redirect to /compare/symptoms — that pattern is a classic
  // soft-404 and dilutes crawl budget.
  if (!symptom) return <NotFound />;

  const pageUrl = `https://myhealthcheckup.co.uk/compare/symptoms/${symptom.slug}`;

  return (
    <MainLayout mainClassName="flex-1 bg-white">
      {/* Title, description, canonical and Open Graph live in the route head
          (src/routes/compare.symptoms.$symptomSlug.tsx) so every compare page
          ships the same metadata shape. Only structured data is emitted here. */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: `Blood Tests for ${symptom.name}`,
            description: symptom.clinicalExplanation,
            url: pageUrl,
          })}
        </script>
      </Helmet>

      <StandardPageHero
        title={`Tests for ${symptom.name}`}
        strapline={symptom.shortDescription}
      />

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-white min-h-[60vh]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 border border-[#081129]/10"
              style={{ backgroundColor: `${symptom.colorHex}22` }}
            >
              {symptom.icon}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#081129] mb-3">
                Why test for {symptom.name.toLowerCase()}?
              </h2>
              <p className="text-[#081129]/80 leading-relaxed">{symptom.clinicalExplanation}</p>
            </div>
          </div>

          {/* Recommended tests */}
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#081129] mb-5">
            Recommended tests
          </h2>
          <div className="space-y-4 mb-10">
            {symptom.recommendedTests.map((test, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#081129]/10 bg-white shadow-[0_2px_12px_rgba(8,17,41,0.06)] p-5"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <h3 className="text-lg font-heading font-bold text-[#081129]">{test.name}</h3>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#22c0d4] hover:bg-[#e70d69] text-white rounded-full text-xs"
                  >
                    <Link to={`/compare?search=${test.searchQuery}`}>
                      <Search className="w-3.5 h-3.5 mr-1" />
                      Compare prices
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-[#081129]/80 mb-3">{test.why}</p>
                <div className="flex flex-wrap gap-1.5">
                  {test.keyBiomarkers.map((b) => (
                    <Badge
                      key={b}
                      variant="secondary"
                      className="text-xs font-normal bg-[#081129]/5 text-[#081129]/80 border border-[#081129]/10 hover:bg-[#081129]/10"
                    >
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* When to see GP */}
          <div className="rounded-xl border border-[#e70d69]/30 bg-[#e70d69]/10 p-5 mb-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#e70d69] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading font-semibold text-[#081129] mb-1">When to see your GP</h3>
                <p className="text-sm text-[#081129]/75">{symptom.whenToSeeGP}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#22c0d4] hover:bg-[#e70d69] text-white rounded-xl"
            >
              <Link to={`/compare?search=${symptom.recommendedTests[0]?.searchQuery || ""}`}>
                Compare all {symptom.name.toLowerCase()} tests
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl border-[#081129]/20 bg-transparent text-[#081129] hover:bg-[#081129]/5 hover:text-[#081129]"
            >
              <Link to="/compare/symptoms">View all symptoms</Link>
            </Button>
          </div>
        </div>
      </section>

      <CategoryPageBottom
        benefitsTitle={`Why test for ${symptom.name.toLowerCase()}?`}
        benefits={[BENEFITS[0], BENEFITS[1], BENEFITS[2]]}
      />
    </MainLayout>
  );
};

export default SymptomDetailPage;
