import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import PageBanner from "@/components/sections/PageBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { goalPages } from "@/data/goalPages";

const CompareByGoalPage = () => {
  return (
    <MainLayout>
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

      <PageBanner
        title="Compare by"
        accent="Goal"
        subtitle="Know what you want to achieve? We'll show you which tests get you there."
      />

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-navy mb-3">
                What's your health goal?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select a goal to see the recommended test panels, key biomarkers, and compare options from trusted providers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {goalPages.map((goal) => (
                <Link key={goal.slug} to={`/compare/goals/${goal.slug}`}>
                  <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-brand-turquoise/40 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${goal.colorHex}15` }}
                        >
                          {goal.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-heading text-brand-navy group-hover:text-brand-turquoise transition-colors">
                            {goal.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">{goal.shortDescription}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {goal.explanation.slice(0, 120)}…
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
            Need help choosing?
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

export default CompareByGoalPage;
