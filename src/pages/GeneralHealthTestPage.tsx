import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, Clock, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const GeneralHealthTestPage = () => {
  const providers = [
    {
      name: "Medichecks",
      price: 75,
      url: "https://medichecks.com/products/general-health-blood-test",
      features: ["24 biomarkers", "3-4 day results", "Venous collection"]
    },
    {
      name: "Randox Health", 
      price: 75,
      url: "https://randoxhealth.com/en-GB/at-home/general-health",
      features: ["24 data points", "Next day results", "At-home kit"]
    },
    {
      name: "London Medical Laboratory",
      price: 89,
      url: "https://londonmedicallaboratory.com/product-category/general-health",
      features: ["Comprehensive panel", "Same day results", "Home or clinic"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>General Health Test - Compare UK Providers | MyHealth Checkup</title>
        <meta name="description" content="Compare General Health Tests from top UK providers. Get comprehensive health screening with cholesterol, liver function, diabetes risk and more." />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <Link 
            to="/"
            className="text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">General Health Test</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold">General Health Test</h1>
                <Badge variant="secondary" className="text-sm">
                  General Health
                </Badge>
              </div>
              
              <p className="text-xl text-muted-foreground mb-6">
                Get a comprehensive overview of your health with testing for cholesterol levels, 
                liver function, iron levels, diabetes risk and more essential health markers.
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This comprehensive general health test includes analysis of key biomarkers 
                  that give you insight into your overall health status.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Blood Health</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full Blood Count (FBC)</li>
                      <li>• Iron Status</li>
                      <li>• Vitamin B12 & Folate</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Metabolic Health</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Cholesterol Profile</li>
                      <li>• Diabetes Screening (HbA1c)</li>
                      <li>• Liver Function Tests</li>
                    </ul>
                  </div>
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
                    <span className="text-sm font-medium">Health Insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose a General Health Test?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Early detection of potential health issues</li>
                  <li>• Establish baseline health measurements</li>
                  <li>• Monitor progress of lifestyle changes</li>
                  <li>• Peace of mind about your health status</li>
                  <li>• No GP referral required</li>
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
                {providers.map((provider, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{provider.name}</h4>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">£{provider.price}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {provider.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button size="sm" className="w-full" asChild>
                      <a 
                        href={provider.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Book with {provider.name}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                ))}
                
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
    </div>
  );
};

export default GeneralHealthTestPage;