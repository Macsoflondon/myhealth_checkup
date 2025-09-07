import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Activity, Users, Baby, Flower2, Stethoscope, Target, Moon } from 'lucide-react';

const womensHealthTests = [
  {
    id: "premium-complete-blood-women",
    name: "Premium Complete Blood Test",
    description: "Comprehensive health analysis including full blood count, organ function, vitamins, and cardiovascular markers",
    icon: Stethoscope,
    category: "Complete Health",
    price: "£199",
    biomarkers: ["Full Blood Count", "Liver Function", "Kidney Function", "Lipid Profile", "Diabetes Markers", "Vitamins", "Iron Studies"],
    suitableFor: ["Complete health overview", "Annual health check", "Health optimization", "Preventive screening"],
    turnaround: "24-48 hours"
  },
  {
    id: "advanced-well-woman",
    name: "Advanced Well Woman Test",
    description: "Comprehensive women's health screening including hormones, reproductive health, and cardiovascular markers",
    icon: Shield,
    category: "Women's Wellness",
    price: "£149",
    biomarkers: ["Female Hormones", "Thyroid Function", "Cholesterol Panel", "Blood Sugar", "Liver Function", "Iron Studies"],
    suitableFor: ["Women 30+", "Routine health screening", "Hormone assessment", "Reproductive health"],
    turnaround: "24-48 hours"
  },
  {
    id: "menopause-blood-test",
    name: "Menopause Blood Test",
    description: "Specialized testing to assess menopausal status and hormone levels during perimenopause and menopause",
    icon: Moon,
    category: "Menopause Health",
    price: "£89",
    biomarkers: ["FSH", "LH", "Oestradiol", "Testosterone", "SHBG", "Thyroid Function"],
    suitableFor: ["Irregular periods", "Hot flashes", "Sleep issues", "Mood changes", "Women 45+"],
    turnaround: "24-48 hours"
  },
  {
    id: "female-hormones",
    name: "Female Hormones Blood Test",
    description: "Comprehensive hormone panel including reproductive hormones and cycle regulation markers",
    icon: Flower2,
    category: "Hormone Health",
    price: "£99",
    biomarkers: ["Oestradiol", "Progesterone", "LH", "FSH", "Testosterone", "SHBG", "Prolactin"],
    suitableFor: ["Irregular cycles", "PMS symptoms", "Fertility planning", "Hormone imbalances"],
    turnaround: "24-48 hours"
  },
  {
    id: "amh-fertility",
    name: "AMH Fertility Blood Test",
    description: "Anti-Müllerian Hormone testing to assess ovarian reserve and fertility potential",
    icon: Baby,
    category: "Fertility Health",
    price: "£69",
    biomarkers: ["AMH", "FSH", "LH", "Oestradiol"],
    suitableFor: ["Family planning", "Fertility assessment", "IVF preparation", "Egg freezing consideration"],
    turnaround: "24-48 hours"
  },
  {
    id: "pregnancy-blood-test",
    name: "Pregnancy Blood Test",
    description: "Accurate pregnancy testing and early pregnancy health monitoring including key nutrients",
    icon: Heart,
    category: "Pregnancy Health",
    price: "£55",
    biomarkers: ["hCG", "Progesterone", "Thyroid Function", "Iron Studies", "Vitamin D", "Folate"],
    suitableFor: ["Pregnancy confirmation", "Early pregnancy monitoring", "Nutritional assessment", "Prenatal health"],
    turnaround: "24-48 hours"
  },
  {
    id: "pcos-blood-test",
    name: "PCOS Blood Test",
    description: "Specialized testing for Polycystic Ovary Syndrome including hormones and metabolic markers",
    icon: Target,
    category: "PCOS Health",
    price: "£125",
    biomarkers: ["Testosterone", "SHBG", "LH", "FSH", "Insulin", "HbA1c", "Lipid Profile"],
    suitableFor: ["Irregular periods", "Weight gain", "Acne", "Hair loss", "Fertility issues"],
    turnaround: "24-48 hours"
  }
];

const healthConcerns = [
  {
    name: "Irregular Periods",
    description: "Menstrual cycle irregularities and hormonal imbalances",
    symptoms: ["Missed periods", "Heavy bleeding", "Painful periods", "Unpredictable cycles"],
    recommendedTest: "Female Hormones Blood Test"
  },
  {
    name: "Menopause Symptoms",
    description: "Perimenopause and menopause transition symptoms",
    symptoms: ["Hot flashes", "Night sweats", "Mood changes", "Sleep disturbances"],
    recommendedTest: "Menopause Blood Test"
  },
  {
    name: "PCOS Symptoms",
    description: "Polycystic Ovary Syndrome related concerns",
    symptoms: ["Weight gain", "Acne", "Hair loss", "Irregular periods"],
    recommendedTest: "PCOS Blood Test"
  },
  {
    name: "Fertility Planning",
    description: "Family planning and reproductive health assessment",
    symptoms: ["Planning pregnancy", "Fertility concerns", "Egg freezing", "IVF preparation"],
    recommendedTest: "AMH Fertility Blood Test"
  }
];

const WomensHealthPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Women's Health Blood Tests | Female Hormone & Fertility Testing | My Health Checkup</title>
        <meta name="description" content="Comprehensive women's health testing including female hormones, menopause, PCOS, fertility AMH, and pregnancy testing from £55." />
        <meta name="keywords" content="women's health tests, female hormones, menopause test, PCOS test, AMH fertility test, pregnancy test, well woman test" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/womens-health" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Women's Health Blood Tests | My Health Checkup" />
        <meta property="og:description" content="Professional women's health testing including hormones, fertility, and wellness screening" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/womens-health" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Women's Health Blood Tests | My Health Checkup" />
        <meta name="twitter:description" content="Comprehensive women's health testing with fast results" />
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Women's Health</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-health-heading mb-6">
                Women's Health Blood Tests
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Comprehensive female health screening including hormones, fertility, menopause, PCOS, 
                and complete wellness testing designed for women's unique health needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Browse All Tests
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
                  Available Women's Health Tests
                </h2>
                <p className="text-lg text-muted-foreground">
                  Comprehensive testing options for female health and wellness
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {womensHealthTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-health-heading/10 text-health-heading group-hover:bg-health-heading group-hover:text-white transition-colors">
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
                        <CardTitle className="text-lg leading-tight mb-2 text-health-heading">{test.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Key Biomarkers:</h4>
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
                        <Button className="w-full bg-primary hover:bg-primary/90">
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

        {/* Health Concerns */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Common Women's Health Concerns
                </h2>
                <p className="text-lg text-muted-foreground">
                  Find the right test for your specific health concerns
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthConcerns.map((concern, index) => (
                  <Card key={index} className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{concern.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {concern.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Common Symptoms:</h4>
                        <div className="flex flex-wrap gap-1">
                          {concern.symptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Recommended Test:</h4>
                        <p className="text-sm text-primary font-medium">{concern.recommendedTest}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-12">
                Why Women's Health Testing Matters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hormone Balance</h3>
                  <p className="text-muted-foreground">
                    Monitor and optimize hormone levels throughout life stages
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Baby className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fertility & Family Planning</h3>
                  <p className="text-muted-foreground">
                    Assess fertility potential and optimize reproductive health
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Preventive Care</h3>
                  <p className="text-muted-foreground">
                    Early detection and prevention of women's health conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WomensHealthPage;