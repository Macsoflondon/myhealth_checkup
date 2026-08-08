import { useParams, Link } from "@/lib/router-compat";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import { StandardPageHero } from "@/components/layout/StandardPageHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lightbulb, Search, Target, Shield, Clock } from "lucide-react";
import { goalPages } from "@/data/goalPages";
import NotFound from "@/pages/NotFound";

const BENEFITS = [
  { icon: Target, title: "Outcome-led matching", description: "See the panels that support this goal" },
  { icon: Shield, title: "UKAS accredited labs", description: "Every listed provider uses UKAS-accredited UK laboratories" },
  { icon: Clock, title: "Clear turnaround", description: "Typical result times shown alongside price and biomarker coverage" },
] as const;

const GoalDetailPage = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  const goal = goalPages.find((g) => g.slug === goalSlug);

  // Render a real 404 (with noindex + prerender-status-code) instead of a
  // silent 200 redirect to /compare/goals — that pattern is a classic
  // soft-404 and dilutes crawl budget.
  if (!goal) return <NotFound />;

  const pageUrl = `https://myhealthcheckup.co.uk/compare/goals/${goal.slug}`;

  return (
    <MainLayout mainClassName="flex-1 bg-white">
      {/* Title, description, canonical and Open Graph live in the route head
          (src/routes/compare.goals.$goalSlug.tsx) so every compare page ships
          the same metadata shape. Only structured data is emitted here. */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: `Blood Tests for ${goal.name}`,
            description: goal.explanation,
            url: pageUrl,
          })}
        </script>
      </Helmet>

      <StandardPageHero
        title={`Tests for ${goal.name}`}
        strapline={goal.shortDescription}
      />

      <section className="py-9 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-white min-h-[60vh]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3 sm:gap-4 mb-8">
            <div
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 border border-[#081129]/10"
              style={{ backgroundColor: `${goal.colorHex}22` }}
            >
              {goal.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#081129] mb-3">
                Why test for {goal.name.toLowerCase()}?
              </h2>
              <p className="text-[#081129]/80 leading-relaxed">{goal.explanation}</p>
            </div>
          </div>

          {/* Recommended tests */}
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#081129] mb-5">
            Recommended test panels
          </h2>
          <div className="space-y-4 mb-10">
            {goal.recommendedTests.map((test, i) => (
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

          {/* Top tip */}
          <div className="rounded-xl border border-[#22c0d4]/30 bg-[#22c0d4]/10 p-5 mb-10">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#22c0d4] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading font-semibold text-[#081129] mb-1">Top tip</h3>
                <p className="text-sm text-[#081129]/75">{goal.topTip}</p>
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
              <Link to={`/compare?search=${goal.recommendedTests[0]?.searchQuery || ""}`}>
                Compare {goal.name.toLowerCase()} tests
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl border-[#081129]/20 bg-transparent text-[#081129] hover:bg-[#081129]/5 hover:text-[#081129]"
            >
              <Link to="/compare/goals">View all goals</Link>
            </Button>
          </div>
        </div>
      </section>

      <CategoryPageBottom
        benefitsTitle={`Why test for ${goal.name.toLowerCase()}?`}
        benefits={[BENEFITS[0], BENEFITS[1], BENEFITS[2]]}
      />
    </MainLayout>
  );
};

export default GoalDetailPage;
