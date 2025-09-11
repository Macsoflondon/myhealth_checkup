import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, Clock, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const MaleHormoneTestPage = () => {
  const providers = [
    {
      name: "Randox Health",
      price: 33,
      url: "https://randoxhealth.com/en-GB/at-home/male-health",
      features: ["8 male hormones", "At-home collection", "Next day results"]
    },
    {
      name: "Medichecks", 
      price: 69,
      url: "https://medichecks.com/products/male-hormone-blood-test",
      features: ["Testosterone panel", "3-4 day results", "Finger-prick or venous"]
    },
    {
      name: "Thriva",
      price: 79,
      url: "https://thriva.co/products/testosterone-test",
      features: ["Comprehensive hormones", "App tracking", "Doctor review"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Male Hormone Test - Compare UK Providers | MyHealth Checkup</title>
        <meta name="description" content="Compare Male Hormone Tests from top UK providers. Test testosterone, DHEA, cortisol and other key male hormones affecting energy, mood and performance." />
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
          <span className="text-foreground">Male Hormone Test</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold" style={{ color: '#081129' }}>Male Hormone Test</h1>
                <Badge variant="secondary" className="text-sm">
                  Hormones
                </Badge>
              </div>
              
              <p className="text-xl text-muted-foreground mb-6">
                Measure testosterone, prolactin levels and other key male hormones to detect 
                imbalances that may be impacting mood, libido, energy levels and overall wellbeing.
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This comprehensive male hormone test analyzes key hormones that affect men's 
                  health, energy, mood, and physical performance.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Primary Hormones</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Total Testosterone</li>
                      <li>• Free Testosterone</li>
                      <li>• DHEA Sulphate</li>
                      <li>• Cortisol</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Supporting Markers</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sex Hormone Binding Globulin (SHBG)</li>
                      <li>• Luteinising Hormone (LH)</li>
                      <li>• Follicle Stimulating Hormone (FSH)</li>
                      <li>• Prolactin</li>
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
                    <span className="text-sm font-medium">Actionable Insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>Why Test Male Hormones?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Identify causes of low energy and fatigue</li>
                  <li>• Assess factors affecting mood and motivation</li>
                  <li>• Understand impacts on physical performance</li>
                  <li>• Monitor testosterone levels as you age</li>
                  <li>• Guide lifestyle and treatment decisions</li>
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

export default MaleHormoneTestPage;