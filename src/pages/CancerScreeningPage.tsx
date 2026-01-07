import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UKASBanner from "@/components/UKASBanner";
import HeroSection from "@/components/sections/HeroSection";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
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
    turnaround: "5-7 days",
    cancerType: "bowel"
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
    turnaround: "3-5 days",
    cancerType: "prostate"
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
    turnaround: "7-10 days",
    cancerType: "ovarian"
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
    turnaround: "10-14 days",
    cancerType: "multi"
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
    turnaround: "7-10 days",
    cancerType: "breast"
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
    turnaround: "5-7 days",
    cancerType: "liver"
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
        <meta property="og:title" content="Cancer Screening Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Comprehensive cancer screening for early detection and prevention" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/cancer-screening" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cancer Screening Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Professional cancer screening with fast results" />
      </Helmet>
      
      <UKASBanner />
      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb 
            segments={[
              { label: "Home", href: "/" },
              { label: "Compare Tests", href: "/compare" },
              { label: "Cancer Screening" }
            ]}
            backLabel="Back to Compare"
          />
        </div>
        <HeroSection
          title="Cancer Screening Tests"
          subtitle="Comprehensive cancer screening tests for early detection and peace of mind. Regular screening saves lives."
        />

        {/* Action Buttons Bar */}
        <section className="bg-[#22C0D4] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/cancer-screening-compare">
                <Button size="lg" className="bg-[#081129] text-white hover:bg-[#081129]/90 font-semibold">
                  Compare Tests
                </Button>
              </Link>
              <Link to="/cancer-biomarkers-reference">
                <Button size="lg" variant="outline" className="border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold">
                  Biomarker Guide
                </Button>
              </Link>
              <Link to="/find-clinic">
                <Button size="lg" className="bg-[#081129] text-white hover:bg-[#081129]/90 font-semibold">
                  Find Clinic
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-12 text-[#081129] my-[20px]">
                Why Choose Cancer Screening?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Catch cancer early when treatment is most effective
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Peace of Mind</h3>
                  <p className="text-muted-foreground">
                    Regular screening provides reassurance about your health
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Expert Care</h3>
                  <p className="text-muted-foreground">
                    All results reviewed by qualified healthcare professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Tests */}
        <section className="py-16 bg-white/[0.31]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-[#081129] my-[20px]">
                  Available Cancer Screening Tests
                </h2>
                <p className="text-lg text-muted-foreground">
                  Comprehensive screening tests for early cancer detection
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cancerScreeningTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 touch-manipulation">
                      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-health-heading/10 text-health-heading group-hover:bg-health-heading group-hover:text-white transition-colors">
                              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs">
                              {test.category}
                            </Badge>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xl sm:text-2xl font-bold text-health-heading">{test.price}</span>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{test.turnaround}</p>
                          </div>
                        </div>
                        <CardTitle className="text-base sm:text-lg leading-tight mb-1.5 sm:mb-2 text-health-heading">{test.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm mb-1.5 sm:mb-2">
                            {test.biomarkers.length} Biomarkers:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {test.biomarkers.slice(0, 2).map((biomarker) => (
                              <Badge key={biomarker} variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                                {biomarker}
                              </Badge>
                            ))}
                            {test.biomarkers.length > 2 && (
                              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                                +{test.biomarkers.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">Suitable For:</h4>
                          <ul className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5 sm:space-y-1">
                            {test.suitableFor.slice(0, 2).map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <Button className="w-full text-xs sm:text-sm py-2 sm:py-2.5 bg-secondary hover:bg-secondary/90" asChild>
                          <Link to={`/cancer-screening-compare?type=${test.cancerType}`}>Compare Providers</Link>
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
      </main>
      
      <Footer />
    </>
  );
};
export default CancerScreeningPage;