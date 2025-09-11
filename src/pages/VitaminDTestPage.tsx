import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, Clock, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const VitaminDTestPage = () => {
  const providers = [
    {
      name: "Thriva",
      price: 29,
      url: "https://thriva.co/products/vitamin-d-test",
      features: ["25-OH Vitamin D", "Finger-prick test", "App tracking"]
    },
    {
      name: "Medichecks", 
      price: 29,
      url: "https://medichecks.com/products/vitamin-d-blood-test",
      features: ["Vitamin D3 level", "3-4 day results", "Home collection"]
    },
    {
      name: "London Medical Laboratory",
      price: 39,
      url: "https://londonmedicallaboratory.com/product/vitamin-d-test",
      features: ["25-hydroxyvitamin D", "Same day results", "Clinic or home"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Vitamin D Test - Compare UK Providers | MyHealth Checkup</title>
        <meta name="description" content="Compare Vitamin D Tests from top UK providers. Check your vitamin D levels for bone health, immune function and overall wellbeing." />
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
          <span className="text-foreground">Vitamin D Test</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold">Vitamin D Blood Test</h1>
                <Badge variant="secondary" className="text-sm">
                  Vitamins
                </Badge>
              </div>
              
              <p className="text-xl text-muted-foreground mb-6">
                Check your vitamin D levels to assess bone health, immune function, 
                and overall wellbeing. Essential for those with limited sun exposure or dietary intake.
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This test measures 25-hydroxyvitamin D [25(OH)D], the best indicator 
                  of your vitamin D status and stores in your body.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">What We Measure</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 25-Hydroxyvitamin D</li>
                      <li>• Total vitamin D status</li>
                      <li>• Deficiency assessment</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Health Benefits</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Bone health support</li>
                      <li>• Immune system function</li>
                      <li>• Muscle strength</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Vitamin D Reference Ranges</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Deficient: &lt;30 nmol/L (&lt;12 ng/mL)</li>
                    <li>• Insufficient: 30-50 nmol/L (12-20 ng/mL)</li>
                    <li>• Sufficient: 50-125 nmol/L (20-50 ng/mL)</li>
                    <li>• Optimal: 75-125 nmol/L (30-50 ng/mL)</li>
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
                    <span className="text-sm font-medium">Easy Collection</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>Why Test Vitamin D?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Many UK residents have insufficient vitamin D levels</li>
                  <li>• Essential for bone health and calcium absorption</li>
                  <li>• Supports immune system function</li>
                  <li>• May help with mood and energy levels</li>
                  <li>• Simple finger-prick test available</li>
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

export default VitaminDTestPage;