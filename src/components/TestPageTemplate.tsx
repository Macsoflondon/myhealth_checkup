import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProviderComparisonSidebar from "@/components/ProviderComparisonSidebar";
import { TestPageData } from "@/types/TestPageTypes";

interface TestPageTemplateProps {
  data: TestPageData;
}

const TestPageTemplate = ({
  data
}: TestPageTemplateProps) => {
  return <div className="min-h-screen bg-background">
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-[20px] py-0">
        {/* Breadcrumb */}
        

        {/* Back to Compare Button */}
        <Link to="/compare">
          <Button variant="ghost" className="mb-6 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Compare
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6 bg-[t] my-0 py-[20px] bg-[#081129]">
              <div className="flex items-start justify-between gap-4 mb-4 py-0 bg-[#081129]">
                <h1 style={{
                color: '#081129'
              }} className="text-3xl font-bold text-white mx-[20px]">
                  {data.title}
                </h1>
                
              </div>
              
              <p className="text-xl mb-6 text-white mx-[20px] my-0 font-normal">
                {data.description}
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-[#081129] font-normal">
                  This comprehensive test analyzes key biomarkers that give you 
                  insight into your health status.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {data.biomarkerSections.map((section, index) => <div key={index} className="space-y-2">
                      <h4 className="font-semibold">{section.title}</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {section.markers.map((marker, markerIndex) => <li key={markerIndex}>• {marker}</li>)}
                      </ul>
                    </div>)}
                </div>

                {/* Highlights section */}
                {data.highlights && data.highlights.map((highlight, index) => <div key={index} className={`p-4 rounded-lg mb-4 ${highlight.bgColor || 'bg-accent/10'}`}>
                    <h4 className={`font-semibold mb-2 ${highlight.textColor || 'text-foreground'}`}>
                      {highlight.title}
                    </h4>
                    <ul className={`text-sm space-y-1 ${highlight.textColor || 'text-muted-foreground'}`}>
                      {highlight.items.map((item, itemIndex) => <li key={itemIndex}>• {item}</li>)}
                    </ul>
                  </div>)}
                
                <div className="grid md:grid-cols-3 gap-4">
                  {data.featureBadges.map((badge, index) => {
                  const IconComponent = badge.icon;
                  return <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[#081129]">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-white">{badge.label}</span>
                      </div>;
                })}
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle className="font-medium text-[#081129]">{data.whyChooseTitle || 'Why Choose This Test?'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  {data.whyChooseItems.map((item, index) => <li key={index}>• {item}</li>)}
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
    </div>;
};
export default TestPageTemplate;