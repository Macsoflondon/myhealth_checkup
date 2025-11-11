import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Shield, TrendingUp } from 'lucide-react';

const heartTests = [
  {
    id: "basic-heart-health",
    name: "Basic Heart Health Test",
    description: "Essential cardiovascular markers to assess your heart health risk",
    icon: Heart,
    category: "Basic Cardiac",
    price: "£79",
    biomarkers: ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides"],
    suitableFor: ["General screening", "Family history", "Routine monitoring", "Preventive care"],
    turnaround: "24-48 hours"
  },
  {
    id: "advanced-lipid-profile",
    name: "Advanced Lipid Profile",
    description: "Comprehensive cholesterol analysis with detailed risk assessment",
    icon: TrendingUp,
    category: "Advanced Cardiac",
    price: "£129",
    biomarkers: ["Total Cholesterol", "HDL", "LDL", "Non-HDL", "Triglycerides", "Cholesterol Ratios", "ApoA1", "ApoB"],
    suitableFor: ["High cholesterol", "Diabetes", "Heart disease risk", "Medication monitoring"],
    turnaround: "24-48 hours"
  },
  {
    id: "cardiac-risk-assessment",
    name: "Cardiac Risk Assessment",
    description: "Complete cardiovascular screening including inflammatory markers",
    icon: Shield,
    category: "Comprehensive",
    price: "£199",
    biomarkers: ["Lipid Profile", "CRP", "Homocysteine", "Lipoprotein(a)", "Troponin"],
    suitableFor: ["High risk patients", "Pre-surgery screening", "Comprehensive assessment", "Family history"],
    turnaround: "24-48 hours"
  },
  {
    id: "heart-disease-prevention",
    name: "Heart Disease Prevention Panel",
    description: "Comprehensive prevention panel for optimal cardiovascular health",
    icon: Activity,
    category: "Prevention",
    price: "£299",
    biomarkers: ["Full Lipid Panel", "Inflammatory Markers", "Cardiac Enzymes", "Risk Calculators", "Vitamin D", "B12"],
    suitableFor: ["Prevention focused", "Lifestyle optimization", "Long-term monitoring", "Health optimization"],
    turnaround: "24-48 hours"
  }
];

const healthConcerns = [
  {
    name: "High Cholesterol",
    description: "Elevated cholesterol levels increasing heart disease risk",
    symptoms: ["No symptoms", "Family history", "High-fat diet", "Sedentary lifestyle"],
    recommendedTest: "Advanced Lipid Profile"
  },
  {
    name: "Heart Disease Risk",
    description: "Multiple risk factors for cardiovascular disease",
    symptoms: ["High blood pressure", "Diabetes", "Smoking", "Family history"],
    recommendedTest: "Cardiac Risk Assessment"
  },
  {
    name: "Chest Discomfort",
    description: "Chest pain or discomfort during activity",
    symptoms: ["Chest tightness", "Shortness of breath", "Arm pain", "Fatigue during exercise"],
    recommendedTest: "Cardiac Risk Assessment"
  },
  {
    name: "Prevention & Wellness",
    description: "Proactive cardiovascular health monitoring",
    symptoms: ["Healthy lifestyle", "Preventive care", "Family history", "Age-related screening"],
    recommendedTest: "Heart Disease Prevention Panel"
  }
];

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    "Basic Cardiac": "bg-red-500 text-white",
    "Advanced Cardiac": "bg-rose-600 text-white",
    "Comprehensive": "bg-red-700 text-white",
    "Prevention": "bg-pink-500 text-white"
  };
  return colorMap[category] || "bg-gray-500 text-white";
};

const getCategoryButtonColor = (category: string) => {
  const buttonColorMap: { [key: string]: string } = {
    "Basic Cardiac": "bg-red-500 hover:bg-red-600",
    "Advanced Cardiac": "bg-rose-600 hover:bg-rose-700",
    "Comprehensive": "bg-red-700 hover:bg-red-800",
    "Prevention": "bg-pink-500 hover:bg-pink-600"
  };
  return buttonColorMap[category] || "bg-gray-500 hover:bg-gray-600";
};

const HeartHealthPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Heart Health Blood Tests | Cholesterol & Cardiac Risk Testing | myhealth checkup - Your health. Your choice. One trusted platform!</title>
        <meta name="description" content="Comprehensive heart health testing including cholesterol, lipid profiles, and cardiac risk assessment. Professional cardiovascular screening from £79." />
        <meta name="keywords" content="heart health tests, cholesterol test, lipid profile, cardiac risk assessment, cardiovascular screening, heart disease prevention" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/heart-health" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Heart Health Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta property="og:description" content="Comprehensive cardiovascular screening and heart health testing" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/heart-health" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Heart Health Blood Tests | myhealth checkup - Your health. Your choice. One trusted platform!" />
        <meta name="twitter:description" content="Professional heart health testing with fast results" />
      </Helmet>
      
      <Header />
      <main className="flex-grow bg-background">
        {/* Hero Section */}
        <section className="bg-[#081129] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Cardiovascular Health Testing
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto tracking-wide text-white">
                Comprehensive heart health screening for UK adults aged 30-60. 
                Monitor your cardiovascular risk and take proactive steps towards a healthier heart.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-health-heading">
                  Check Your Heart
                </Button>
                <Button size="lg" className="bg-[#22C0D4] hover:bg-[#E70D69] text-white transition-colors">
                  Risk Calculator
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-[#081129] my-[20px]">
                Why Test Your Heart Health?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Identify risk factors before symptoms appear
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Prevention</h3>
                  <p className="text-muted-foreground">
                    Take action to prevent heart disease
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-[#e70d69]">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Monitor Progress</h3>
                  <p className="text-muted-foreground">
                    Track improvements over time
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heartTests.map((test) => {
                  const IconComponent = test.icon;
                  return (
                    <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 bg-white shadow-md border-2 hover:border-opacity-80 h-full flex flex-col">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Badge className={`text-xs whitespace-nowrap ${getCategoryColor(test.category)}`}>
                              {test.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Results in {test.turnaround}</p>
                            <span className="text-2xl font-bold text-health-heading">{test.price}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight mb-3 h-12 flex items-start" style={{color: '#081129'}}>{test.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground h-16 leading-relaxed">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 flex-1 flex flex-col space-y-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Biomarkers Tested: {test.biomarkers.length}
                              <br />
                              What's Tested:
                            </h4>
                            <div className="flex flex-wrap gap-1 min-h-[2.5rem]">
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
                            <ul className="text-xs text-muted-foreground space-y-1 min-h-[2.5rem]">
                              {test.suitableFor.slice(0, 2).map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-auto pt-4">
                          <Button className={`w-full text-white ${getCategoryButtonColor(test.category)}`}>
                            Compare Providers
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Health Concerns */}
        <section className="py-16 bg-[#081129]">
          <div className="container mx-auto px-4 shadow-2xl shadow-white/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Heart Disease Risk Factors
                </h2>
                <p className="text-lg text-gray-300">
                  Find the right test for your cardiovascular health concerns
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthConcerns.map((concern, index) => (
                  <Card key={index} className="border-border bg-white shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">{concern.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {concern.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-foreground">Risk Factors:</h4>
                        <div className="flex flex-wrap gap-1">
                          {concern.symptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-foreground">Recommended Test:</h4>
                        <p className="text-sm text-[#e70d69] font-medium">{concern.recommendedTest}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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