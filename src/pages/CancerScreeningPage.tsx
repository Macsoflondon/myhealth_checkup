import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, Heart, Target, Activity, AlertTriangle, Microscope } from "lucide-react";
const cancerScreeningTests = [
  {
    id: "bowel-cancer",
    name: "Bowel Cancer Screening",
    description: "Advanced FIT test for early detection of colorectal cancer markers",
    icon: Target,
    category: "Digestive Health",
    price: "£89",
    biomarkers: ["Faecal Immunochemical Test", "Blood in stool detection", "Hemoglobin"],
    suitableFor: ["Adults 45+", "Family history", "Digestive symptoms", "Screening programme"],
    turnaround: "5-7 days"
  },
  {
    id: "prostate-cancer",
    name: "Prostate Cancer Panel",
    description: "Comprehensive PSA testing for men's prostate health assessment",
    icon: Shield,
    category: "Men's Health",
    price: "£125",
    biomarkers: ["PSA Total", "PSA Free", "PSA Ratio", "PSA Density"],
    suitableFor: ["Men 40+", "Urinary symptoms", "Family history", "Regular monitoring"],
    turnaround: "3-5 days"
  },
  {
    id: "cervical-cancer",
    name: "Cervical Cancer Screening",
    description: "HPV testing and cytology for cervical cancer prevention",
    icon: Heart,
    category: "Women's Health",
    price: "£149",
    biomarkers: ["HPV DNA", "Cytology", "High-risk HPV types", "Cell abnormalities"],
    suitableFor: ["Women 25-65", "Irregular smears", "HPV concerns", "Prevention"],
    turnaround: "7-10 days"
  },
  {
    id: "multi-cancer",
    name: "Multi-Cancer Detection",
    description: "Blood-based early detection panel screening for multiple cancer types",
    icon: Microscope,
    category: "Comprehensive",
    price: "£399",
    biomarkers: ["Circulating tumor DNA", "Protein biomarkers", "50+ cancer types"],
    suitableFor: ["High-risk individuals", "Comprehensive screening", "Early detection", "Peace of mind"],
    turnaround: "10-14 days"
  },
  {
    id: "breast-cancer",
    name: "Breast Cancer Markers",
    description: "Blood markers and genetic testing for breast cancer risk assessment",
    icon: Heart,
    category: "Women's Health",
    price: "£189",
    biomarkers: ["CA 15-3", "CA 27.29", "CEA", "BRCA gene variants"],
    suitableFor: ["Family history", "BRCA testing", "Risk assessment", "Women 40+"],
    turnaround: "7-10 days"
  },
  {
    id: "lung-cancer",
    name: "Lung Cancer Screening",
    description: "Biomarker testing for lung cancer risk and early detection",
    icon: Activity,
    category: "Respiratory Health",
    price: "£169",
    biomarkers: ["CEA", "CYFRA 21-1", "NSE", "SCC Antigen"],
    suitableFor: ["Smokers", "Ex-smokers", "Respiratory symptoms", "High-risk occupations"],
    turnaround: "5-7 days"
  }
];

const cancerCategories = [
  {
    name: "Gender-Specific Cancers",
    description: "Screening tests tailored for men's and women's specific cancer risks",
    tests: ["Prostate Cancer", "Cervical Cancer", "Breast Cancer"],
    icon: Heart
  },
  {
    name: "Common Cancers",
    description: "Screening for the most prevalent cancer types in the UK population",
    tests: ["Bowel Cancer", "Lung Cancer", "Breast Cancer"],
    icon: Shield
  },
  {
    name: "Comprehensive Screening",
    description: "Multi-cancer detection panels for broad early detection coverage",
    tests: ["Multi-Cancer Panel", "Tumor Markers", "Genetic Testing"],
    icon: Microscope
  },
  {
    name: "Risk Assessment",
    description: "Tests to evaluate your personal cancer risk factors and genetics",
    tests: ["BRCA Testing", "Lynch Syndrome", "Family History Panel"],
    icon: AlertTriangle
  }
];

const CancerScreeningPage = () => {
  return (
    <>
      <Helmet>
        <title>Cancer Screening Tests | Early Detection & Prevention | Compare UK Providers</title>
        <meta name="description" content="Compare cancer screening tests from leading UK providers. Prostate, bowel, breast, cervical cancer testing and early detection from top clinics." />
        <meta name="keywords" content="cancer screening, prostate cancer test, bowel cancer screening, cervical cancer test, breast cancer markers, multi-cancer detection" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/cancer-screening" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Cancer Screening Tests | My Health Checkup" />
        <meta property="og:description" content="Comprehensive cancer screening for early detection and prevention" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/cancer-screening" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cancer Screening Tests | My Health Checkup" />
        <meta name="twitter:description" content="Professional cancer screening with fast results" />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-health-heading mb-6">
                Cancer Screening Tests
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Comprehensive cancer screening tests for early detection and peace of mind. 
                Regular screening saves lives - start your prevention journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Browse Screening Tests
                </Button>
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/find-a-clinic">Find a Clinic</Link>
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
                  Available Cancer Screening Tests
                </h2>
                <p className="text-lg text-muted-foreground">
                  Comprehensive screening tests for early cancer detection
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancerScreeningTests.map((test) => {
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
                        <CardTitle className="text-lg leading-tight mb-2">{test.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Key Markers:</h4>
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

        {/* Cancer Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Types of Cancer Screening
                </h2>
                <p className="text-lg text-muted-foreground">
                  Understanding the different cancer screening categories available
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cancerCategories.map((category, index) => {
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
                Why Choose Cancer Screening?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Catch cancer early when treatment is most effective
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Peace of Mind</h3>
                  <p className="text-muted-foreground">
                    Regular screening provides reassurance about your health
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
                  <p className="text-muted-foreground">
                    All results reviewed by qualified healthcare professionals
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
export default CancerScreeningPage;