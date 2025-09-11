import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, Clock, Shield, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const IronProfileTestPage = () => {
  const navigate = useNavigate();
  
  const providers = [
    {
      name: "Medichecks",
      price: 39,
      url: "https://medichecks.com/products/iron-status-blood-test",
      features: ["Full iron panel", "3-4 day results", "Finger-prick option"]
    },
    {
      name: "Thriva", 
      price: 49,
      url: "https://thriva.co/products/iron-test",
      features: ["Iron status markers", "App tracking", "Doctor review"]
    },
    {
      name: "London Medical Laboratory",
      price: 45,
      url: "https://londonmedicallaboratory.com/product/iron-profile-test",
      features: ["Comprehensive iron", "Same day results", "Home or clinic"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Iron Profile Test - Compare UK Providers | MyHealth Checkup</title>
        <meta name="description" content="Compare Iron Profile Tests from top UK providers. Check for iron deficiency, anaemia and iron overload with comprehensive iron status testing." />
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
          <span className="text-foreground">Iron Profile Test</span>
        </nav>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold" style={{ color: '#081129' }}>Iron Profile Test</h1>
                <Badge variant="secondary" className="text-sm">
                  Blood Tests
                </Badge>
              </div>
              
              <p className="text-xl text-muted-foreground mb-6">
                Comprehensive iron status testing to check for iron deficiency, anaemia, 
                or iron overload. Essential for energy levels and overall health assessment.
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This comprehensive iron profile analyzes multiple markers to give you 
                  a complete picture of your iron status and storage levels.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Iron Markers</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Serum Iron</li>
                      <li>• Ferritin (iron stores)</li>
                      <li>• Total Iron Binding Capacity (TIBC)</li>
                      <li>• Transferrin Saturation</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Related Tests</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Haemoglobin levels</li>
                      <li>• Red blood cell count</li>
                      <li>• Mean cell volume (MCV)</li>
                      <li>• Vitamin B12 & Folate</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Signs of Iron Deficiency</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Fatigue and weakness</li>
                    <li>• Pale skin, nails or inner eyelids</li>
                    <li>• Shortness of breath</li>
                    <li>• Cold hands and feet</li>
                    <li>• Restless leg syndrome</li>
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
                    <span className="text-sm font-medium">Energy Insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>Why Test Iron Levels?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Iron deficiency is one of the most common nutritional deficiencies</li>
                  <li>• Essential for oxygen transport and energy production</li>
                  <li>• Women are at higher risk due to menstruation</li>
                  <li>• Vegetarians and vegans may have lower iron levels</li>
                  <li>• Can identify both deficiency and excess iron</li>
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

export default IronProfileTestPage;