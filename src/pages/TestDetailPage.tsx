import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { logger } from "@/lib/logger";

interface TestDetail {
  id: string;
  test_name: string;
  description: string;
  price: number;
  category: string;
  url: string;
  image_url?: string;
  provider_id: string;
}

const TestDetailPage = () => {
  const { providerId, testId } = useParams();
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const provider = detailedProviders.find(p => p.id.toLowerCase() === providerId?.toLowerCase());

  useEffect(() => {
    if (testId) {
      fetchTestDetail();
    }
  }, [testId]);

  const fetchTestDetail = async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('provider_tests')
        .select('*')
        .eq('id', testId)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setTest(data);
    } catch (error) {
      logger.error('Error fetching test detail:', error);
      setError('Failed to load test details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#081129]">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Provider Not Found</h1>
            <p className="text-gray-300">The provider you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#081129]">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-300">Loading test details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-[#081129]">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Test Not Found</h1>
            <p className="text-gray-300 mb-4">
              {error || "The test you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link to={`/provider/${providerId}/tests`}>Back to Tests</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081129]">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <Link 
            to="/#providers"
            className="text-gray-300 hover:text-white"
          >
            All Providers
          </Link>
          <span className="text-gray-300">/</span>
          <Link 
            to={`/provider/${providerId}`}
            className="text-gray-300 hover:text-white"
          >
            {provider.name}
          </Link>
          <span className="text-gray-300">/</span>
          <Link 
            to={`/provider/${providerId}/tests`}
            className="text-gray-300 hover:text-white"
          >
            Available Tests
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-white">{test.test_name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-white">{test.test_name}</h1>
                <Badge variant="secondary" className="text-sm">
                  {test.category}
                </Badge>
              </div>
              
              <p className="text-xl text-gray-300 mb-6">
                {test.description}
              </p>
            </div>

            {/* Test Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This comprehensive {test.test_name.toLowerCase()} includes detailed analysis 
                  and professional interpretation of your results.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Professional Analysis</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Fast Results</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Health Insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose This Test */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose This Test?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Accurate and reliable results from {provider.name}</li>
                  <li>• Professional medical interpretation included</li>
                  <li>• Convenient sample collection options</li>
                  <li>• Secure online results portal</li>
                  <li>• Expert customer support available</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">Book This Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    £{test.price?.toFixed(2) || 'Price on request'}
                  </div>
                  <p className="text-sm text-gray-600">
                    Includes all fees and analysis
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button size="lg" className="w-full" asChild>
                    <a 
                      href={test.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Book with {provider.name}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to={`/provider/${providerId}/tests`}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      View All Tests
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Provider Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Provider:</strong> {provider.name}</p>
                    {provider.accreditation && (
                      <p><strong>Accreditation:</strong> {provider.accreditation}</p>
                    )}
                    {provider.phone && (
                      <p><strong>Phone:</strong> {provider.phone}</p>
                    )}
                  </div>
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

export default TestDetailPage;