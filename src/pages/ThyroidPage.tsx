import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Shield, Zap, TestTube2, Users } from "lucide-react";

const thyroidTests = [
  {
    id: "thyroid-blood-test",
    name: "Thyroid Blood Test",
    description: "Essential thyroid function screening including TSH, T3, and T4 to assess thyroid hormone levels and overall thyroid health",
    icon: Heart,
    category: "Basic Thyroid",
    price: "£69",
    biomarkers: ["TSH", "Free T3", "Free T4"],
    suitableFor: ["Fatigue concerns", "Weight changes", "Temperature sensitivity", "General screening"],
    turnaround: "24-48 hours"
  },
  {
    id: "thyroid-function-antibodies",
    name: "Thyroid Function with Antibodies Test",
    description: "Comprehensive thyroid assessment including hormone levels plus antibody testing for autoimmune thyroid conditions",
    icon: Shield,
    category: "Advanced Thyroid",
    price: "£125", 
    biomarkers: ["TSH", "Free T3", "Free T4", "Anti-TPO", "Anti-Thyroglobulin"],
    suitableFor: ["Family history of thyroid disease", "Suspected autoimmune conditions", "Comprehensive screening", "Previous abnormal results"],
    turnaround: "24-48 hours"
  }
];

const thyroidConditions = [
  {
    name: "Hyperthyroidism",
    description: "Overactive thyroid producing too much hormone",
    symptoms: ["Weight loss", "Rapid heartbeat", "Anxiety", "Heat intolerance"]
  },
  {
    name: "Hypothyroidism", 
    description: "Underactive thyroid producing too little hormone",
    symptoms: ["Weight gain", "Fatigue", "Cold intolerance", "Hair loss"]
  },
  {
    name: "Hashimoto's Disease",
    description: "Autoimmune condition causing thyroid inflammation",
    symptoms: ["Gradual thyroid failure", "Fatigue", "Depression", "Memory problems"]
  },
  {
    name: "Graves' Disease",
    description: "Autoimmune condition causing thyroid overactivity", 
    symptoms: ["Bulging eyes", "Weight loss", "Tremors", "Anxiety"]
  }
];

const ThyroidPage = () => {
  return (
    <>
      <Helmet>
        <title>Thyroid Blood Tests | TSH, T3, T4 & Antibody Testing | My Health Checkup</title>
        <meta name="description" content="Comprehensive thyroid function tests including TSH, T3, T4, and thyroid antibodies. Professional thyroid screening from £69 with fast results." />
        <meta name="keywords" content="thyroid blood test, TSH test, T3 T4 test, thyroid antibodies, hypothyroid, hyperthyroid, thyroid function test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/thyroid" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Thyroid Blood Tests | My Health Checkup" />
        <meta property="og:description" content="Comprehensive thyroid function testing including hormones and antibodies" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/thyroid" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Thyroid Blood Tests | My Health Checkup" />
        <meta name="twitter:description" content="Professional thyroid function testing with fast results" />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-health-heading mb-6">
                Thyroid Function Tests
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Monitor your thyroid health with comprehensive hormone testing including TSH, T3, T4, and thyroid antibodies. 
                Essential for detecting thyroid disorders and optimizing treatment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Compare Thyroid Tests
                </Button>
                <Button size="lg" variant="outline">
                  Find a Clinic
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Available Tests */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Available Thyroid Tests
                </h2>
                <p className="text-lg text-muted-foreground">
                  Choose the right thyroid test for your needs
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {thyroidTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {test.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-primary">{test.price}</span>
                            <p className="text-xs text-muted-foreground">Results in {test.turnaround}</p>
                          </div>
                        </div>
                        <CardTitle className="text-xl leading-tight mb-2">{test.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Biomarkers Tested:</h4>
                          <div className="flex flex-wrap gap-1">
                            {test.biomarkers.map((biomarker) => (
                              <Badge key={biomarker} variant="outline" className="text-xs">
                                {biomarker}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Suitable For:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {test.suitableFor.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <Button className="w-full" variant="outline">
                          Compare Providers
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Thyroid Conditions */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Common Thyroid Conditions
                </h2>
                <p className="text-lg text-muted-foreground">
                  Understanding what thyroid tests can detect
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {thyroidConditions.map((condition, index) => (
                  <Card key={index} className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{condition.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {condition.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-medium text-sm mb-2">Common Symptoms:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {condition.symptoms.map((symptom, idx) => (
                          <li key={idx}>• {symptom}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Test Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-12">
                Why Test Your Thyroid?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Energy & Metabolism</h3>
                  <p className="text-muted-foreground">
                    Thyroid hormones regulate metabolism, energy levels, and weight
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TestTube2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Identify thyroid disorders before symptoms become severe
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Treatment Monitoring</h3>
                  <p className="text-muted-foreground">
                    Track treatment effectiveness and optimize thyroid medication
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ThyroidPage;