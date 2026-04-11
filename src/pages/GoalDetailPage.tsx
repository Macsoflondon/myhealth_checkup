import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import PageBanner from "@/components/sections/PageBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lightbulb, Search } from "lucide-react";
import { goalPages } from "@/data/goalPages";

const GoalDetailPage = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  const goal = goalPages.find((g) => g.slug === goalSlug);

  if (!goal) return <Navigate to="/compare/goals" replace />;

  const pageTitle = `${goal.name} Blood Tests | myhealth checkup`;
  const pageUrl = `https://myhealthcheckup.co.uk/compare/goals/${goal.slug}`;

  return (
    <MainLayout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Compare blood tests for ${goal.name.toLowerCase()}. ${goal.shortDescription}. See recommended panels, key biomarkers, and prices from accredited UK providers.`}
        />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={`Compare blood tests for ${goal.name.toLowerCase()}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
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

      <PageBanner
        title={`Tests for`}
        accent={goal.name}
        subtitle={goal.shortDescription}
      />

      {/* Explanation */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ backgroundColor: `${goal.colorHex}15` }}
              >
                {goal.icon}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy mb-3">
                  Why test for {goal.name.toLowerCase()}?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {goal.explanation}
                </p>
              </div>
            </div>

            {/* Recommended tests */}
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy mb-5">
              Recommended test panels
            </h2>
            <div className="space-y-4 mb-10">
              {goal.recommendedTests.map((test, i) => (
                <Card key={i} className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-lg font-heading text-brand-navy">
                        {test.name}
                      </CardTitle>
                      <Button
                        asChild
                        size="sm"
                        className="bg-brand-turquoise hover:bg-brand-pink text-white rounded-full text-xs"
                      >
                        <Link to={`/compare?search=${test.searchQuery}`}>
                          <Search className="w-3.5 h-3.5 mr-1" />
                          Compare prices
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">{test.why}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {test.keyBiomarkers.map((b) => (
                        <Badge key={b} variant="secondary" className="text-xs font-normal">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Top tip */}
            <div className="bg-brand-turquoise/5 border border-brand-turquoise/20 rounded-xl p-5 mb-10">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-brand-turquoise flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-semibold text-brand-navy mb-1">Top tip</h3>
                  <p className="text-sm text-muted-foreground">{goal.topTip}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-turquoise hover:bg-brand-pink text-white rounded-xl"
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
                className="rounded-xl"
              >
                <Link to="/compare/goals">View all goals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default GoalDetailPage;
