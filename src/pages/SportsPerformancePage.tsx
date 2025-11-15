import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UKASBanner from "@/components/UKASBanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { sportsPerformanceCategories } from "@/data/sportsPerformanceCategories";
import { Trophy, Activity, TrendingUp, ArrowRight, Clock, Beaker, Star, Heart, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
interface TestData {
  id: string;
  test_name: string;
  provider_id: string;
  price: number | null;
  category: string;
  biomarkers: any;
}
const SportsPerformancePage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSportsTests = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('tests_master').select('id, test_name, category, biomarkers').or('category.ilike.%sport%,category.ilike.%performance%,category.ilike.%fitness%').eq('is_active', true).limit(6);
        if (error) throw error;

        // Fetch provider mapping for these tests
        if (data) {
          const testIds = data.map(t => t.id);
          const {
            data: mappings
          } = await supabase.from('provider_test_mapping').select('test_master_id, provider_id, current_price').in('test_master_id', testIds).eq('availability_status', 'available');
          const testsWithProviders = data.map(test => {
            const mapping = mappings?.find(m => m.test_master_id === test.id);
            return {
              ...test,
              provider_id: mapping?.provider_id || 'Unknown',
              price: mapping?.current_price || null
            };
          });
          setTests(testsWithProviders);
        }
      } catch (error) {
        console.error('Error fetching sports tests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSportsTests();
  }, []);
  const benefits = [{
    icon: Trophy,
    title: "Peak Performance",
    description: "Monitor biomarkers crucial for athletic excellence and competitive advantage",
    color: "#FA6980"
  }, {
    icon: Activity,
    title: "Recovery Optimization",
    description: "Track markers that impact recovery, injury prevention, and training adaptation",
    color: "#22C0D4"
  }, {
    icon: TrendingUp,
    title: "Competitive Edge",
    description: "Data-driven insights to optimize training, nutrition, and performance outcomes",
    color: "#E70D69"
  }];
  const testimonials = [{
    name: "James Patterson",
    sport: "Marathon Runner",
    rating: 5,
    quote: "The vitamin D and iron deficiency results explained why my training had plateaued. Within 8 weeks of supplementation, I knocked 12 minutes off my personal best.",
    image: "👤"
  }, {
    name: "Sarah Chen",
    sport: "CrossFit Athlete",
    rating: 5,
    quote: "Discovering my testosterone levels were low was a game-changer. My recovery improved dramatically, and I'm now competing at a national level.",
    image: "👤"
  }, {
    name: "Marcus Thompson",
    sport: "Professional Cyclist",
    rating: 5,
    quote: "Regular performance testing has become essential to my training regime. The insights help me optimise nutrition and avoid overtraining.",
    image: "👤"
  }];
  const performanceMarkers = [{
    icon: Heart,
    title: "Cardiovascular Markers",
    biomarkers: ["Haemoglobin", "Ferritin", "Cholesterol"],
    description: "Essential for oxygen transport, endurance capacity, and cardiovascular health during intense training."
  }, {
    icon: Zap,
    title: "Energy & Metabolism",
    biomarkers: ["Vitamin B12", "Vitamin D", "Thyroid (TSH, T3, T4)"],
    description: "Critical for energy production, metabolic efficiency, and optimal recovery between training sessions."
  }, {
    icon: Activity,
    title: "Recovery & Inflammation",
    biomarkers: ["CRP", "Cortisol", "Testosterone"],
    description: "Monitor inflammation levels, stress response, and hormonal balance for optimal recovery and muscle adaptation."
  }, {
    icon: TrendingUp,
    title: "Performance Optimisation",
    biomarkers: ["Magnesium", "Calcium", "Creatine Kinase"],
    description: "Track electrolyte balance and muscle damage markers to prevent injury and enhance athletic performance."
  }];
  return <>
      <Helmet>
        <title>Sports Performance Blood Tests | Athletic Optimization | myhealth checkup</title>
        <meta name="description" content="Optimise your athletic performance with comprehensive sports blood tests. Monitor fitness biomarkers, nutrition status, and recovery markers from trusted UK providers. Compare prices and book today." />
        <meta name="keywords" content="sports performance tests, athletic blood tests, fitness biomarkers, sports nutrition testing, endurance testing, recovery markers, athlete health screening, UK sports tests" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/sports-performance" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Sports Performance Blood Tests | Athletic Optimization" />
        <meta property="og:description" content="Monitor fitness biomarkers, nutrition, and recovery with sports performance blood tests from trusted UK providers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/sports-performance" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sports Performance Blood Tests | Athletic Optimization" />
        <meta name="twitter:description" content="Optimise athletic performance with comprehensive sports blood tests from trusted UK providers." />
      </Helmet>
      
      <UKASBanner />
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#081129] via-[#1a1b34] to-[#081129] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              
              <h1 className="text-4xl md:text-5xl mb-6 font-semibold lg:text-5xl">
                Sports Performance Blood Tests
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Optimise your athletic performance with comprehensive biomarker analysis. 
                Monitor nutrition, recovery, and fitness markers from trusted UK laboratories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-[#FA6980] hover:bg-[#E70D69] text-white" onClick={() => navigate('/compare?category=sports-performance')}>
                  Browse All Tests
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate('/find-clinic')}>
                  Find a Clinic
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Sports Performance Testing?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Gain the competitive edge with data-driven insights into your athletic health
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{
                  backgroundColor: `${benefit.color}20`
                }}>
                      <benefit.icon className="w-8 h-8" style={{
                    color: benefit.color
                  }} />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sports Performance Categories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore specialized testing categories designed for athletes and fitness enthusiasts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {sportsPerformanceCategories.map(category => {
              const IconComponent = category.icon;
              return <Card key={category.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#FA6980] group" onClick={() => navigate(category.link)}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{
                    backgroundColor: `${category.color}20`
                  }}>
                        <IconComponent className="w-6 h-6" style={{
                      color: category.color
                    }} />
                      </div>
                      <CardTitle className="text-lg group-hover:text-[#FA6980] transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="mb-4">
                        {category.testCount} Tests Available
                      </Badge>
                      <Button variant="ghost" className="w-full group-hover:bg-[#FA6980] group-hover:text-white transition-colors">
                        View Tests
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>
        </section>

        {/* Available Tests Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Sports Performance Tests
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Compare prices from trusted UK providers and book your test today
              </p>
            </div>
            
            {loading ? <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FA6980] mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading available tests...</p>
              </div> : tests.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {tests.map(test => <Card key={test.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#FA6980]">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">{test.category}</Badge>
                        {test.price && <span className="text-2xl font-bold text-[#FA6980]">
                            £{test.price}
                          </span>}
                      </div>
                      <CardTitle className="text-xl">{test.test_name}</CardTitle>
                      <CardDescription className="capitalize">{test.provider_id.replace(/-/g, ' ')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Beaker className="w-4 h-4" />
                          <span>
                            {test.biomarkers && typeof test.biomarkers === 'object' ? Object.keys(test.biomarkers).length : 'Multiple'} Biomarkers
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>2-5 working days</span>
                        </div>
                      </div>
                      <Button className="w-full bg-[#FA6980] hover:bg-[#E70D69] text-white" onClick={() => navigate('/compare?category=sports-performance')}>
                        Compare Prices
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>)}
              </div> : <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No sports performance tests found at the moment.</p>
                <Button onClick={() => navigate('/compare')}>
                  Browse All Tests
                </Button>
              </div>}

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" onClick={() => navigate('/compare?category=sports-performance')}>
                View All Sports Performance Tests
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Performance Optimization Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Key Biomarkers for Athletic Performance
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Understanding your biomarkers enables data-driven decisions to enhance training, recovery, and competitive performance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {performanceMarkers.map((marker, index) => {
              const IconComponent = marker.icon;
              return <Card key={index} className="border-2 hover:border-[#FA6980] transition-all duration-300 hover:shadow-xl">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-[#FA6980]/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-7 h-7 text-[#FA6980]" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{marker.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {marker.biomarkers.map((biomarker, i) => <Badge key={i} variant="secondary" className="text-xs">
                                {biomarker}
                              </Badge>)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{marker.description}</p>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>
        </section>

        {/* Athlete Testimonials Section */}
        <section className="py-16 bg-muted/30">
          
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#FA6980] to-[#E70D69] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Optimise Your Performance?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Compare sports performance tests from trusted UK providers and take control of your athletic health today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate('/compare?category=sports-performance')}>
                Compare Tests Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" onClick={() => navigate('/contact')}>
                Get Expert Advice
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>;
};
export default SportsPerformancePage;