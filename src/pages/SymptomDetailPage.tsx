import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import PageBanner from "@/components/sections/PageBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, Search } from "lucide-react";
import { symptomPages } from "@/data/symptomPages";

const SymptomDetailPage = () => {
  const { symptomSlug } = useParams<{ symptomSlug: string }>();
  const symptom = symptomPages.find((s) => s.slug === symptomSlug);

  if (!symptom) return <Navigate to="/compare/symptoms" replace />;

  const pageTitle = `${symptom.name} Blood Tests | myhealth checkup`;
  const pageUrl = `https://myhealthcheckup.co.uk/compare/symptoms/${symptom.slug}`;

  return (
    <MainLayout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Compare blood tests for ${symptom.name.toLowerCase()}. ${symptom.shortDescription}. See recommended tests, key biomarkers, and prices from accredited UK providers.`}
        />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={`Compare blood tests for ${symptom.name.toLowerCase()}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
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

      <PageBanner
        title={`Tests for`}
        accent={symptom.name}
        subtitle={symptom.shortDescription}
      />

      {/* Clinical explanation */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ backgroundColor: `${symptom.colorHex}15` }}
              >
                {symptom.icon}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy mb-3">
                  Why test for {symptom.name.toLowerCase()}?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {symptom.clinicalExplanation}
                </p>
              </div>
            </div>

            {/* Recommended tests */}
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy mb-5">
              Recommended tests
            </h2>
            <div className="space-y-4 mb-10">
              {symptom.recommendedTests.map((test, i) => (
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

            {/* When to see GP */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-semibold text-amber-900 mb-1">When to see your GP</h3>
                  <p className="text-sm text-amber-800">{symptom.whenToSeeGP}</p>
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
                <Link to={`/compare?search=${symptom.recommendedTests[0]?.searchQuery || ""}`}>
                  Compare all {symptom.name.toLowerCase()} tests
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl"
              >
                <Link to="/compare/symptoms">View all symptoms</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SymptomDetailPage;
