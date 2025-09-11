import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, Clock, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const LipidProfileTestPage = () => {
  const providers = [
    {
      name: "Medichecks",
      price: 49,
      url: "https://medichecks.com/products/cholesterol-blood-test",
      features: ["Full lipid panel", "3-4 day results", "Home collection"]
    },
    {
      name: "Thriva", 
      price: 59,
      url: "https://thriva.co/products/cholesterol-test",
      features: ["Heart health insights", "App tracking", "Doctor review"]
    },
    {
      name: "London Medical Laboratory",
      price: 55,
      url: "https://londonmedicallaboratory.com/product/lipid-profile-test",
      features: ["Comprehensive lipids", "Same day results", "Clinic or home"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Lipid Profile Test - Compare UK Providers | MyHealth Checkup</title>
        <meta name="description" content="Compare Lipid Profile Tests from top UK providers. Check cholesterol levels, heart disease risk and cardiovascular health." />
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
          <span className="text-foreground">Lipid Profile Test</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold">Lipid Profile Test</h1>
                <Badge variant="secondary" className="text-sm">
                  Heart Health
                </Badge>
              </div>
              
              <p className="text-xl text-muted-foreground mb-6">
                Comprehensive cholesterol testing to assess your cardiovascular risk and 
                heart health. Essential for monitoring and preventing heart disease.
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This comprehensive lipid profile analyzes all the key cholesterol markers 
                  that affect your cardiovascular health and heart disease risk.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Cholesterol Markers</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Total Cholesterol</li>
                      <li>• LDL Cholesterol (bad)</li>
                      <li>• HDL Cholesterol (good)</li>
                      <li>• Triglycerides</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Risk Assessment</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Cholesterol ratios</li>
                      <li>• Cardiovascular risk scoring</li>
                      <li>• Heart disease indicators</li>
                      <li>• Treatment recommendations</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Optimal Cholesterol Levels</h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Total Cholesterol: &lt;5.0 mmol/L (&lt;193 mg/dL)</li>
                    <li>• LDL Cholesterol: &lt;3.0 mmol/L (&lt;116 mg/dL)</li>
                    <li>• HDL Cholesterol: &gt;1.0 mmol/L (&gt;39 mg/dL) men, &gt;1.2 mmol/L (&gt;46 mg/dL) women</li>
                    <li>• Triglycerides: &lt;1.7 mmol/L (&lt;150 mg/dL)</li>
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
                    <span className="text-sm font-medium">Heart Health</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>Why Test Cholesterol Levels?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• High cholesterol is a major risk factor for heart disease</li>
                  <li>• Often has no symptoms until it's too late</li>
                  <li>• Family history of heart disease increases risk</li>
                  <li>• Diet and lifestyle changes can improve levels</li>
                  <li>• Regular monitoring is recommended for adults</li>
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

export default LipidProfileTestPage;