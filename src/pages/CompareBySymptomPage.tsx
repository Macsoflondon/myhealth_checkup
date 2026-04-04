import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import PageBanner from "@/components/sections/PageBanner";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { symptomPages } from "@/data/symptomPages";

const CompareBySymptomPage = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Compare Tests by Symptom | myhealth checkup</title>
        <meta
          name="description"
          content="Find the right blood test based on your symptoms. Compare tests for fatigue, low mood, hair loss, weight gain, low libido and more from accredited UK providers."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/compare/symptoms" />
        <meta property="og:title" content="Compare Tests by Symptom | myhealth checkup" />
        <meta property="og:description" content="Find the right blood test based on your symptoms." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/compare/symptoms" />
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

      <PageBanner
        title="Compare by"
        accent="Symptom"
        subtitle="Not sure what's wrong? Start with what you're feeling. We'll match you to the right tests."
      />

      <div className="container mx-auto px-4 pt-4">
        <PageBreadcrumb />
      </div>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-navy mb-3">
                What are you experiencing?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select a symptom to see which blood tests are recommended, what biomarkers to check, and compare prices across providers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {symptomPages.map((symptom) => (
                <Link key={symptom.slug} to={`/compare/symptoms/${symptom.slug}`}>
                  <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-brand-turquoise/40 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${symptom.colorHex}15` }}
                        >
                          {symptom.icon}
                        </div>
                        <CardTitle className="text-lg font-heading text-brand-navy group-hover:text-brand-turquoise transition-colors">
                          {symptom.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">
                        {symptom.shortDescription}
                      </p>
                      <div className="flex items-center text-sm font-medium text-brand-turquoise group-hover:text-brand-pink transition-colors">
                        View recommended tests
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-brand-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Our guided questionnaire matches you to the right test in under 2 minutes.
          </p>
          <Button asChild size="lg" className="bg-brand-turquoise hover:bg-brand-pink text-white rounded-xl">
            <Link to="/assisted-test-finder">Take the health quiz</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default CompareBySymptomPage;
