import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const DiabetesTestingPage = () => {
  const diabetesTests = [
    {
      name: "HbA1c Test",
      description: "3-month average blood sugar levels",
      price: "From £45",
      turnaround: "2-3 days",
      ideal: "Diabetes monitoring & screening"
    },
    {
      name: "Glucose Tolerance Test",
      description: "Comprehensive diabetes assessment",
      price: "From £89",
      turnaround: "3-5 days",
      ideal: "Pre-diabetes detection"
    },
    {
      name: "Diabetes Risk Panel",
      description: "Complete metabolic screening",
      price: "From £149",
      turnaround: "5-7 days",
      ideal: "Family history concerns"
    },
    {
      name: "Advanced Diabetes Monitor",
      description: "HbA1c, insulin, C-peptide analysis",
      price: "From £199",
      turnaround: "7-10 days",
      ideal: "Comprehensive assessment"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-800">Early Detection</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Diabetes Testing & Monitoring
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Comprehensive diabetes screening and monitoring tests. Perfect for health-conscious UK adults 
                aged 30-60 looking to manage their metabolic health proactively.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <Activity className="h-5 w-5" />
                  Find Your Test
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Early Warning Signs</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "Increased thirst",
                  "Frequent urination",
                  "Unexplained weight loss",
                  "Fatigue & weakness",
                  "Blurred vision",
                  "Slow healing wounds",
                  "Tingling in hands/feet",
                  "Recurring infections"
                ].map((symptom, index) => (
                  <Card key={index} className="text-center p-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">{symptom}</p>
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
              <h2 className="text-3xl font-bold mb-4">Diabetes Testing Options</h2>
              <p className="text-xl text-muted-foreground">Choose the right test for your needs</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {diabetesTests.map((test, index) => (
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
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Results in {test.turnaround}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Ideal for: {test.ideal}</span>
                      </div>
                      <Button className="w-full">Compare Providers</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Understanding Results */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Understanding Your Results</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Normal Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-2">HbA1c: Below 5.7%</p>
                    <p className="text-sm text-green-600">Continue healthy lifestyle habits</p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-800">Pre-diabetes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-700 mb-2">HbA1c: 5.7% - 6.4%</p>
                    <p className="text-sm text-amber-600">Lifestyle changes recommended</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-800">Diabetes Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700 mb-2">HbA1c: 6.5% or higher</p>
                    <p className="text-sm text-red-600">Medical consultation advised</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DiabetesTestingPage;