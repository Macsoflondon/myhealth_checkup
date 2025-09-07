import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Shield, Zap, Moon, Baby, Target, Flower2 } from "lucide-react";

const hormoneTests = [
  {
    id: "female-hormones",
    name: "Female Hormones Blood Test",
    description: "Comprehensive female hormone panel including reproductive hormones and cycle regulation markers",
    icon: Flower2,
    category: "Female Hormones",
    price: "£99",
    biomarkers: ["Oestradiol", "Progesterone", "LH", "FSH", "Testosterone", "SHBG", "Prolactin"],
    suitableFor: ["Irregular cycles", "PMS symptoms", "Fertility planning", "Hormone imbalances"],
    turnaround: "24-48 hours"
  },
  {
    id: "male-hormones",
    name: "Male Hormones Blood Test", 
    description: "Comprehensive hormone panel including testosterone, SHBG, and reproductive health markers",
    icon: Zap,
    category: "Male Hormones",
    price: "£89",
    biomarkers: ["Total Testosterone", "Free Testosterone", "SHBG", "LH", "FSH", "Prolactin"],
    suitableFor: ["Low energy/libido", "Muscle building", "Weight management", "Fertility concerns"],
    turnaround: "24-48 hours"
  },
  {
    id: "testosterone-test",
    name: "Testosterone Blood Test",
    description: "Essential testosterone testing to assess male hormone levels and hormonal health",
    icon: Target,
    category: "Male Hormones",
    price: "£45",
    biomarkers: ["Total Testosterone", "Free Testosterone", "SHBG"],
    suitableFor: ["Low energy", "Decreased libido", "Muscle loss", "Mood changes"],
    turnaround: "24-48 hours"
  },
  {
    id: "thyroid-hormones",
    name: "Thyroid Function Test",
    description: "Complete thyroid hormone assessment including TSH, T3, T4, and thyroid antibodies",
    icon: Shield,
    category: "Thyroid Hormones",
    price: "£69",
    biomarkers: ["TSH", "Free T3", "Free T4", "Anti-TPO"],
    suitableFor: ["Fatigue", "Weight changes", "Temperature sensitivity", "Hair loss"],
    turnaround: "24-48 hours"
  },
  {
    id: "menopause-hormones",
    name: "Menopause Hormone Test",
    description: "Specialized testing to assess menopausal status and hormone levels during transition",
    icon: Moon,
    category: "Menopause",
    price: "£89",
    biomarkers: ["FSH", "LH", "Oestradiol", "Testosterone", "SHBG"],
    suitableFor: ["Irregular periods", "Hot flashes", "Sleep issues", "Mood changes"],
    turnaround: "24-48 hours"
  },
  {
    id: "fertility-hormones",
    name: "Fertility Hormone Panel",
    description: "Comprehensive fertility assessment including AMH and reproductive hormones",
    icon: Baby,
    category: "Fertility",
    price: "£125",
    biomarkers: ["AMH", "FSH", "LH", "Oestradiol", "Testosterone", "Prolactin"],
    suitableFor: ["Family planning", "Fertility assessment", "IVF preparation", "PCOS screening"],
    turnaround: "24-48 hours"
  },
  {
    id: "cortisol-stress",
    name: "Cortisol Stress Test",
    description: "Measure stress hormone levels to assess adrenal function and stress impact",
    icon: Activity,
    category: "Stress Hormones",
    price: "£65",
    biomarkers: ["Morning Cortisol", "DHEA-S", "Cortisol/DHEA Ratio"],
    suitableFor: ["Chronic stress", "Fatigue", "Sleep issues", "Mood disorders"],
    turnaround: "24-48 hours"
  },
  {
    id: "insulin-diabetes",
    name: "Insulin & Diabetes Hormones",
    description: "Comprehensive diabetes and metabolic hormone testing including insulin resistance",
    icon: Heart,
    category: "Metabolic Hormones",
    price: "£85",
    biomarkers: ["Fasting Insulin", "HbA1c", "Glucose", "C-Peptide"],
    suitableFor: ["Weight management", "PCOS", "Diabetes risk", "Metabolic syndrome"],
    turnaround: "24-48 hours"
  }
];

const hormoneCategories = [
  {
    name: "Reproductive Hormones",
    description: "Hormones that control fertility and sexual health",
    tests: ["Female Hormones", "Male Hormones", "Fertility Panel"],
    icon: Baby
  },
  {
    name: "Thyroid Hormones",
    description: "Hormones that regulate metabolism and energy",
    tests: ["TSH", "T3", "T4", "Thyroid Antibodies"],
    icon: Shield
  },
  {
    name: "Stress Hormones",
    description: "Hormones that respond to stress and regulate mood",
    tests: ["Cortisol", "DHEA-S", "Adrenaline"],
    icon: Activity
  },
  {
    name: "Metabolic Hormones",
    description: "Hormones that control blood sugar and metabolism",
    tests: ["Insulin", "Growth Hormone", "Leptin"],
    icon: Heart
  }
];

const HormonesPage = () => {
  return (
    <>
      <Helmet>
        <title>Hormone Blood Tests | Comprehensive Hormone Testing | My Health Checkup</title>
        <meta name="description" content="Complete hormone testing including thyroid, reproductive, stress, and metabolic hormones. Professional hormone analysis from £45." />
        <meta name="keywords" content="hormone blood tests, testosterone test, female hormones, thyroid hormones, cortisol test, fertility hormones, menopause test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/hormones" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Hormone Blood Tests | My Health Checkup" />
        <meta property="og:description" content="Comprehensive hormone testing for optimal health and wellness" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/hormones" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hormone Blood Tests | My Health Checkup" />
        <meta name="twitter:description" content="Professional hormone testing with fast results" />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-health-heading mb-6">
                Hormone Blood Tests
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Comprehensive hormone testing including reproductive, thyroid, stress, and metabolic hormones. 
                Optimize your health with professional hormone analysis and personalized insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Browse Hormone Tests
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
                  Available Hormone Tests
                </h2>
                <p className="text-lg text-muted-foreground">
                  Comprehensive hormone testing for every health need
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hormoneTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-health-icon/10 text-health-icon group-hover:bg-health-icon group-hover:text-white transition-colors">
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {test.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-health-heading">{test.price}</span>
                            <p className="text-xs text-muted-foreground">Results in {test.turnaround}</p>
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight mb-2">{test.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Key Hormones:</h4>
                          <div className="flex flex-wrap gap-1">
                            {test.biomarkers.slice(0, 3).map((biomarker) => (
                              <Badge key={biomarker} variant="outline" className="text-xs">
                                {biomarker}
                              </Badge>
                            ))}
                            {test.biomarkers.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{test.biomarkers.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Suitable For:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {test.suitableFor.slice(0, 2).map((item, index) => (
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

        {/* Hormone Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Types of Hormones We Test
                </h2>
                <p className="text-lg text-muted-foreground">
                  Understanding the different hormone systems in your body
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hormoneCategories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Card key={index} className="border-border/50">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-medium text-sm mb-2">Common Tests Include:</h4>
                        <div className="flex flex-wrap gap-1">
                          {category.tests.map((test, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-12">
                Why Test Your Hormones?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Optimize Energy</h3>
                  <p className="text-muted-foreground">
                    Balance hormones to boost energy levels and reduce fatigue
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Improve Mood</h3>
                  <p className="text-muted-foreground">
                    Stabilize mood and reduce anxiety through hormone optimization
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Prevent Disease</h3>
                  <p className="text-muted-foreground">
                    Early detection of hormonal imbalances prevents health issues
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

export default HormonesPage;