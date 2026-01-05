import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Shield, TrendingUp } from 'lucide-react';

const HeartHealthPage = () => {
  const heartTests = [
    {
      name: "Basic Heart Health",
      description: "Essential cardiovascular markers",
      price: "From £79",
      markers: ["Cholesterol", "HDL/LDL", "Triglycerides", "Blood pressure markers"]
    },
    {
      name: "Advanced Lipid Profile",
      description: "Comprehensive cholesterol analysis",
      price: "From £129",
      markers: ["Total cholesterol", "HDL", "LDL", "Non-HDL", "Triglycerides", "Cholesterol ratios"]
    },
    {
      name: "Cardiac Risk Assessment",
      description: "Complete cardiovascular screening",
      price: "From £199",
      markers: ["Lipid profile", "CRP", "Homocysteine", "Lipoprotein(a)", "ApoB/ApoA1"]
    },
    {
      name: "Heart Disease Prevention",
      description: "Comprehensive prevention panel",
      price: "From £299",
      markers: ["Full lipid panel", "Inflammatory markers", "Cardiac enzymes", "Risk calculators"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-50 to-pink-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-red-100 text-red-800">Heart Health</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Cardiovascular Health Testing
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Comprehensive heart health screening for UK adults aged 30-60. 
                Monitor your cardiovascular risk and take proactive steps towards a healthier heart.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <Heart className="h-5 w-5" />
                  Check Your Heart
                </Button>
                <Button variant="outline" size="lg">
                  Risk Calculator
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Factors */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Heart Disease Risk Factors</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Activity, title: "High Blood Pressure", desc: "Silent killer affecting 1 in 4 adults" },
                  { icon: TrendingUp, title: "High Cholesterol", desc: "Major cause of heart attacks" },
                  { icon: Heart, title: "Family History", desc: "Genetic predisposition matters" },
                  { icon: Shield, title: "Diabetes", desc: "Doubles heart disease risk" },
                  { icon: Activity, title: "Smoking", desc: "Damages blood vessels" },
                  { icon: TrendingUp, title: "Obesity", desc: "Increases cardiovascular strain" }
                ].map((factor, index) => (
                  <Card key={index} className="text-center p-6">
                    <factor.icon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{factor.title}</h3>
                    <p className="text-sm text-muted-foreground">{factor.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Available Tests */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Heart Health Tests</h2>
              <p className="text-xl text-muted-foreground">Choose your cardiovascular screening level</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {heartTests.map((test, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{test.name}</CardTitle>
                      <Badge variant="secondary">{test.price}</Badge>
                    </div>
                    <p className="text-muted-foreground">{test.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">What's Tested:</h4>
                        <div className="flex flex-wrap gap-1">
                          {test.markers.map((marker, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {marker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full">Compare Providers</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Test Your Heart */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Why Test Your Heart Health?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Early Detection</h3>
                  <p className="text-muted-foreground">Identify risk factors before symptoms appear</p>
                </div>
                <div>
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Prevention</h3>
                  <p className="text-muted-foreground">Take action to prevent heart disease</p>
                </div>
                <div>
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Monitor Progress</h3>
                  <p className="text-muted-foreground">Track improvements over time</p>
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

export default HeartHealthPage;