import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle2, Clock, Home, ExternalLink } from 'lucide-react';

interface LolaHealthTest {
  id: string;
  test_name: string;
  description: string;
  price: number;
  category: string;
  url: string;
  is_active: boolean;
}

const LolaHealthTestDetailPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<LolaHealthTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!testId) {
        setError('No test ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('provider_tests')
          .select('*')
          .eq('provider_id', 'lola-health')
          .eq('provider_test_id', testId)
          .single();

        if (fetchError) throw fetchError;
        
        setTest(data);
      } catch (err) {
        console.error('Error fetching test:', err);
        setError('Failed to load test details');
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-[#081129] to-[#0A1628] py-24">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !test) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-[#081129] to-[#0A1628] py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Test Not Found</h1>
            <p className="text-gray-400 mb-8">{error || 'The test you are looking for could not be found.'}</p>
            <Button onClick={() => navigate('/compare')}>
              Browse All Tests
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{test.test_name} - Lola Health | myhealth checkup</title>
        <meta 
          name="description" 
          content={`${test.description} From £${test.price.toFixed(2)}. At-home phlebotomy service with doctor-reviewed results.`} 
        />
        <meta property="og:title" content={`${test.test_name} - Lola Health`} />
        <meta property="og:description" content={test.description} />
        <meta name="keywords" content={`${test.test_name}, Lola Health, ${test.category}, blood test, at-home testing`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#081129] to-[#0A1628]">
        <Header />
        
        {/* Breadcrumb */}
        <div className="bg-[#081129] border-b border-white/10 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/compare" className="hover:text-primary transition-colors">Compare Tests</Link>
              <span>/</span>
              <span className="text-white">Lola Health</span>
              <span>/</span>
              <span className="text-primary">{test.test_name}</span>
            </div>
          </div>
        </div>

        <main className="py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-6 text-white hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Header Card */}
                <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge className="mb-3">{test.category}</Badge>
                      <h1 className="text-4xl font-bold text-white mb-2">{test.test_name}</h1>
                      <div className="flex items-center gap-2 text-gray-400">
                        <img 
                          src="/lovable-uploads/provider-lola-health.png" 
                          alt="Lola Health" 
                          className="h-6 w-auto"
                        />
                        <span>Lola Health</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-primary">£{test.price.toFixed(2)}</div>
                      {!test.is_active && (
                        <Badge variant="destructive" className="mt-2">Currently Unavailable</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg">{test.description}</p>
                </Card>

                {/* Key Features */}
                <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">What's Included</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-white">At-Home Phlebotomy</div>
                        <div className="text-sm text-gray-400">Professional venous blood collection at your home</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-white">Doctor-Reviewed Results</div>
                        <div className="text-sm text-gray-400">All results reviewed by qualified doctors</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-white">2-4 Working Days</div>
                        <div className="text-sm text-gray-400">Fast turnaround time</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-white">NHS-Accredited Labs</div>
                        <div className="text-sm text-gray-400">ISO 15189 certified laboratories</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* How It Works */}
                <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Book Your Test</h3>
                        <p className="text-gray-400">Order online and schedule your at-home phlebotomy appointment</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Phlebotomist Visits</h3>
                        <p className="text-gray-400">A trained professional comes to your home to collect your blood sample</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Lab Analysis</h3>
                        <p className="text-gray-400">Your sample is analyzed at NHS-accredited laboratories</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">4</div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Receive Results</h3>
                        <p className="text-gray-400">Get doctor-reviewed results via the Lola Health app with personalized insights</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Book Now Card */}
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 sticky top-24">
                  <div className="text-center space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-white">£{test.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">At-home service included</div>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => window.open('https://referrals.lolahealth.com/myhealthcheckup', '_blank')}
                      disabled={!test.is_active}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Book with Lola Health
                    </Button>
                    <div className="text-xs text-gray-400 text-center">
                      You'll be redirected to Lola Health's website to complete your booking
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="font-semibold text-white mb-3">Why Choose Lola Health?</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Professional at-home phlebotomy (not finger-prick)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>NHS-accredited laboratory testing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Doctor-reviewed results with personalized insights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Results delivered via easy-to-use app</span>
                      </li>
                    </ul>
                  </div>
                </Card>

                {/* Compare Link */}
                <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/compare?category=${encodeURIComponent(test.category)}`)}
                  >
                    Compare Similar Tests
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LolaHealthTestDetailPage;
