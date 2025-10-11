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
    category: "Women's Wellness",
    price: "£79",
    biomarkers: ["Oestradiol", "Progesterone", "LH", "FSH", "Testosterone", "SHBG", "Prolactin"],
    suitableFor: ["Irregular cycles", "PMS symptoms", "Fertility planning", "Hormone imbalances"],
    turnaround: "2 working days"
  },
  {
    id: "male-hormones",
    name: "Male Hormones Blood Test", 
    description: "Comprehensive hormone panel including testosterone, SHBG, and reproductive health markers",
    icon: Zap,
    category: "Male Hormones",
    price: "£43",
    biomarkers: ["Total Testosterone", "Free Testosterone", "SHBG", "LH", "FSH", "Prolactin"],
    suitableFor: ["Low energy/libido", "Muscle building", "Weight management", "Fertility concerns"],
    turnaround: "2-5 working days"
  },
  {
    id: "testosterone-test",
    name: "Testosterone Blood Test",
    description: "Essential testosterone testing to assess male hormone levels and hormonal health",
    icon: Target,
    category: "Male Hormones",
    price: "£29",
    biomarkers: ["Total Testosterone"],
    suitableFor: ["Low energy", "Decreased libido", "Muscle loss", "Mood changes"],
    turnaround: "2 working days"
  },
  {
    id: "thyroid-hormones",
    name: "Advanced Thyroid Function Test",
    description: "Complete thyroid hormone assessment including TSH, T3, T4, and thyroid antibodies",
    icon: Shield,
    category: "Thyroid Hormones",
    price: "£89",
    biomarkers: ["TSH", "Free T3", "Free T4", "Anti-TPO"],
    suitableFor: ["Fatigue", "Weight changes", "Temperature sensitivity", "Hair loss"],
    turnaround: "2 working days"
  },
  {
    id: "menopause-hormones",
    name: "Menopause Hormone Test",
    description: "Specialized testing to assess menopausal status and hormone levels during transition",
    icon: Moon,
    category: "Women's Wellness",
    price: "£69",
    biomarkers: ["FSH", "LH", "Oestradiol", "Testosterone", "SHBG"],
    suitableFor: ["Irregular periods", "Hot flashes", "Sleep issues", "Mood changes"],
    turnaround: "2 working days"
  },
  {
    id: "fertility-hormones",
    name: "Fertility Hormone Panel",
    description: "Comprehensive fertility assessment including AMH and reproductive hormones",
    icon: Baby,
    category: "Fertility",
    price: "£79",
    biomarkers: ["AMH", "FSH", "LH", "Oestradiol", "Testosterone", "Prolactin"],
    suitableFor: ["Family planning", "Fertility assessment", "IVF preparation", "PCOS screening"],
    turnaround: "2 working days"
  },
  {
    id: "cortisol-stress",
    name: "Cortisol Stress Test",
    description: "Measure stress hormone levels to assess adrenal function and stress impact",
    icon: Activity,
    category: "Stress Hormones",
    price: "£45",
    biomarkers: ["Morning Cortisol"],
    suitableFor: ["Chronic stress", "Fatigue", "Sleep issues", "Mood disorders"],
    turnaround: "2 working days"
  },
  {
    id: "insulin-diabetes",
    name: "Insulin & Diabetes Hormones",
    description: "Comprehensive diabetes and metabolic hormone testing including insulin resistance",
    icon: Heart,
    category: "Metabolic Hormones",
    price: "£79",
    biomarkers: ["Fasting Insulin", "HbA1c", "Glucose", "C-Peptide"],
    suitableFor: ["Weight management", "PCOS", "Diabetes risk", "Metabolic syndrome"],
    turnaround: "2 working days"
  }
];

const healthConcerns = [
  {
    name: "Low Energy & Fatigue",
    description: "Persistent tiredness and lack of energy",
    symptoms: ["Chronic fatigue", "Low motivation", "Sleep issues", "Brain fog"],
    recommendedTest: "Thyroid Function Test"
  },
  {
    name: "Weight Changes",
    description: "Unexplained weight gain or difficulty losing weight",
    symptoms: ["Slow metabolism", "Weight gain", "Belly fat", "Food cravings"],
    recommendedTest: "Insulin & Diabetes Hormones"
  },
  {
    name: "Mood & Mental Health",
    description: "Hormonal impact on mood and mental wellbeing",
    symptoms: ["Depression", "Anxiety", "Mood swings", "Irritability"],
    recommendedTest: "Cortisol Stress Test"
  },
  {
    name: "Reproductive Health",
    description: "Fertility and reproductive hormone concerns",
    symptoms: ["Irregular cycles", "Low libido", "Fertility issues", "PMS"],
    recommendedTest: "Female Hormones Blood Test"
  }
];

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    "Women's Wellness": "bg-pink-500 text-white",
    "Male Hormones": "bg-[#081129] text-white",
    "Thyroid Hormones": "bg-green-500 text-white",
    "Fertility": "bg-rose-500 text-white",
    "Stress Hormones": "bg-orange-500 text-white",
    "Metabolic Hormones": "bg-red-500 text-white"
  };
  return colorMap[category] || "bg-gray-500 text-white";
};

const getCategoryBorderColor = (category: string) => {
  const borderColorMap: { [key: string]: string } = {
    "Women's Wellness": "border-pink-500",
    "Male Hormones": "border-blue-500",
    "Thyroid Hormones": "border-green-500",
    "Fertility": "border-rose-500",
    "Stress Hormones": "border-orange-500",
    "Metabolic Hormones": "border-red-500"
  };
  return borderColorMap[category] || "border-gray-500";
};

const getCategoryButtonColor = (category: string) => {
  const buttonColorMap: { [key: string]: string } = {
    "Women's Wellness": "bg-pink-500 hover:bg-pink-600",
    "Male Hormones": "bg-[#081129] hover:bg-[#081129]/90",
    "Thyroid Hormones": "bg-green-500 hover:bg-green-600",
    "Fertility": "bg-rose-500 hover:bg-rose-600",
    "Stress Hormones": "bg-orange-500 hover:bg-orange-600",
    "Metabolic Hormones": "bg-red-500 hover:bg-red-600"
  };
  return buttonColorMap[category] || "bg-gray-500 hover:bg-gray-600";
};

const HormonesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Hormone Blood Tests | Comprehensive Hormone Testing | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Complete hormone testing including thyroid, reproductive, stress, and metabolic hormones. Professional hormone analysis from £45." />
        <meta name="keywords" content="hormone blood tests, testosterone test, female hormones, thyroid hormones, cortisol test, fertility hormones, menopause test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/hormones" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Hormone Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Comprehensive hormone testing for optimal health and wellness" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/hormones" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hormone Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Professional hormone testing with fast results" />
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              
              <h1 className="text-4xl md:text-5xl font-bold text-health-heading mb-6">
                Hormone Blood Tests
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto tracking-wide" style={{color: '#081129'}}>
                Comprehensive hormone testing including reproductive, thyroid, stress, and metabolic hormones. 
                Optimize your health with professional hormone analysis and personalized insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-health-heading">
                  Browse Hormone Tests
                </Button>
                <Button size="lg" className="bg-[#22C0D4] hover:bg-[#E70D69] text-white transition-colors">
                  Find a Clinic
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-[#e70d69]">
                Why Test Your Hormones?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Optimize Energy</h3>
                  <p className="text-muted-foreground">
                    Balance hormones to boost energy levels and reduce fatigue
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Improve Mood</h3>
                  <p className="text-muted-foreground">
                    Stabilize mood and reduce anxiety through hormone optimization
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Prevent Disease</h3>
                  <p className="text-muted-foreground">
                    Early detection of hormonal imbalances prevents health issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Tests */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hormoneTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className={`group hover:shadow-lg transition-all duration-300 ${getCategoryBorderColor(test.category)} border-2 hover:border-opacity-80 h-full flex flex-col`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Badge className={`text-xs whitespace-nowrap ${getCategoryColor(test.category)}`}>
                              {test.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Results in {test.turnaround}</p>
                            <span className="text-2xl font-bold text-health-heading">{test.price}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight mb-3 h-12 flex items-start" style={{color: '#081129'}}>{test.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground h-16 leading-relaxed">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 flex-1 flex flex-col space-y-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Biomarkers Tested: {test.biomarkers.length}
                              <br />
                              Key Biomarkers:
                            </h4>
                            <div className="flex flex-wrap gap-1 min-h-[2.5rem]">
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
                            <ul className="text-xs text-muted-foreground space-y-1 min-h-[2.5rem]">
                              {test.suitableFor.slice(0, 2).map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-auto pt-4">
                          <Button className={`w-full text-white ${getCategoryButtonColor(test.category)}`}>
                            Compare Providers
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Health Concerns */}
        <section className="py-16 bg-[#081129]">
          <div className="container mx-auto px-4 shadow-2xl shadow-white/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Common Hormone Health Concerns
                </h2>
                <p className="text-lg text-gray-300">
                  Find the right hormone test for your specific health concerns
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthConcerns.map((concern, index) => (
                  <Card key={index} className="border-border bg-white shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">{concern.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {concern.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-foreground">Common Symptoms:</h4>
                        <div className="flex flex-wrap gap-1">
                          {concern.symptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-foreground">Recommended Test:</h4>
                        <p className="text-sm text-[#e70d69] font-medium">{concern.recommendedTest}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HormonesPage;