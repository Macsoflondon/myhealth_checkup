import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, Clock, Shield, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const WellWomanTestPage = () => {
  const navigate = useNavigate();
  const providers = [{
    name: "Medichecks",
    price: 159,
    url: "https://medichecks.com/products/well-woman-advanced-blood-test",
    features: ["47 biomarkers", "3-4 day results", "Hormone analysis"]
  }, {
    name: "Thriva",
    price: 149,
    url: "https://thriva.co/products/womens-health-test",
    features: ["Female health focus", "App tracking", "Doctor review"]
  }, {
    name: "London Medical Laboratory",
    price: 169,
    url: "https://londonmedicallaboratory.com/product-category/female-health",
    features: ["Comprehensive panel", "Same day results", "Hormone insights"]
  }];
  return <div className="min-h-screen bg-background">
      <Helmet>
        <title>Well Woman Blood Test - Compare UK Providers | MyHealth Checkup</title>
        <meta name="description" content="Compare Well Woman Tests from top UK providers. Comprehensive female health screening including hormones, fertility, and general health markers." />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Well Woman Test</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 bg-[#22c0d4] text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold" style={{
                color: '#081129'
              }}>Well Woman Blood Test</h1>
                <Badge variant="secondary" className="text-sm">
                  Women's Health
                </Badge>
              </div>
              
              <p className="text-xl text-muted-foreground mb-6">
                Comprehensive female health screening including hormone analysis, fertility markers, 
                general health indicators and nutritional status tailored specifically for women.
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This comprehensive well woman test analyzes key health markers that are 
                  particularly important for women's health and wellbeing at every life stage.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Female Hormones</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Oestradiol (Estrogen)</li>
                      <li>• Progesterone</li>
                      <li>• Testosterone</li>
                      <li>• Luteinising Hormone (LH)</li>
                      <li>• Follicle Stimulating Hormone (FSH)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">General Health</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full Blood Count</li>
                      <li>• Iron Status & Ferritin</li>
                      <li>• Thyroid Function (TSH, T3, T4)</li>
                      <li>• Cholesterol Profile</li>
                      <li>• Diabetes Screening (HbA1c)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">Key Areas Covered</h4>
                  <ul className="text-sm text-pink-700 dark:text-pink-300 space-y-1">
                    <li>• Menstrual cycle health and regularity</li>
                    <li>• Fertility and reproductive health</li>
                    <li>• Menopause transition markers</li>
                    <li>• Energy levels and fatigue assessment</li>
                    <li>• Bone health and osteoporosis risk</li>
                  </ul>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">UKAS Accredited</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Fast Results</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Female Focus</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Well Woman Testing?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Tailored specifically for women's unique health needs</li>
                  <li>• Comprehensive hormone analysis for all life stages</li>
                  <li>• Early detection of common female health issues</li>
                  <li>• Monitor fertility and reproductive health</li>
                  <li>• Track menopause transition and symptoms</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Provider Comparison Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">Compare Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {providers.map((provider, index) => <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{provider.name}</h4>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">£{provider.price}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {provider.features.map((feature, fIndex) => <div key={fIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{feature}</span>
                        </div>)}
                    </div>
                    
                    <Button size="sm" className="w-full" asChild>
                      <a href={provider.url} target="_blank" rel="noopener noreferrer">
                        Book with {provider.name}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>)}
                
                <div className="pt-4 border-t">
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/compare">
                      Compare All Tests
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default WellWomanTestPage;