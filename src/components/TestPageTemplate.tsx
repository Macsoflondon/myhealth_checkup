import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProviderComparisonSidebar from "@/components/ProviderComparisonSidebar";
import { TestPageData } from "@/types/TestPageTypes";

interface TestPageTemplateProps {
  data: TestPageData;
}

const TestPageTemplate = ({ data }: TestPageTemplateProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
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
          <span className="text-foreground">{data.breadcrumbTitle}</span>
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
                <h1 className="text-3xl font-bold" style={{ color: '#081129' }}>
                  {data.title}
                </h1>
                <Badge variant="secondary" className="text-sm">
                  {data.category}
                </Badge>
              </div>
              
              <p className="text-xl text-muted-foreground mb-6">
                {data.description}
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This comprehensive test analyzes key biomarkers that give you 
                  insight into your health status.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {data.biomarkerSections.map((section, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-semibold">{section.title}</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {section.markers.map((marker, markerIndex) => (
                          <li key={markerIndex}>• {marker}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Highlights section */}
                {data.highlights && data.highlights.map((highlight, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg mb-4 ${highlight.bgColor || 'bg-accent/10'}`}
                  >
                    <h4 className={`font-semibold mb-2 ${highlight.textColor || 'text-foreground'}`}>
                      {highlight.title}
                    </h4>
                    <ul className={`text-sm space-y-1 ${highlight.textColor || 'text-muted-foreground'}`}>
                      {highlight.items.map((item, itemIndex) => (
                        <li key={itemIndex}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <div className="grid md:grid-cols-3 gap-4">
                  {data.featureBadges.map((badge, index) => {
                    const IconComponent = badge.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>{data.whyChooseTitle || 'Why Choose This Test?'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  {data.whyChooseItems.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Provider Comparison Sidebar */}
          <div className="lg:col-span-1">
            <ProviderComparisonSidebar providers={data.providers} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestPageTemplate;