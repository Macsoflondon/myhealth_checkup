import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Activity, Users } from 'lucide-react';

const WomensHealthPage = () => {
  const keyTests = [
    {
      name: "Cervical Screening",
      description: "Regular cervical cancer screening for early detection",
      ageGroup: "25-64 years",
      frequency: "Every 3-5 years",
      icon: <Shield className="h-6 w-6" />
    },
    {
      name: "Hormone Panel",
      description: "Comprehensive hormone testing including estrogen, progesterone",
      ageGroup: "30+ years",
      frequency: "As needed",
      icon: <Activity className="h-6 w-6" />
    },
    {
      name: "Breast Health Check",
      description: "Mammography and breast cancer risk assessment",
      ageGroup: "40+ years",
      frequency: "Every 2-3 years",
      icon: <Heart className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Women's Health Tests | Female Health Screening | My Health Checkup</title>
        <meta name="description" content="Comprehensive women's health testing including hormones, cervical screening, breast health, and more. Compare UK providers for female-specific health screenings." />
      </Helmet>
      
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Women's Health</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Women's Health Testing
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Comprehensive health screening designed for women's unique health needs throughout all life stages.
              </p>
              <Button size="lg" className="mr-4">Compare Tests</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
        </section>

        {/* Key Tests Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Essential Women's Health Tests</h2>
              <p className="text-xl text-muted-foreground">Key screenings every woman should consider for optimal health</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {keyTests.map((test, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      {test.icon}
                    </div>
                    <CardTitle>{test.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{test.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Recommended Age:</span>
                        <span className="text-sm">{test.ageGroup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Frequency:</span>
                        <span className="text-sm">{test.frequency}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Your Women's Health Journey</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Compare providers and find the right tests for your age and health goals.
            </p>
            <Button size="lg">View All Women's Health Tests</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WomensHealthPage;