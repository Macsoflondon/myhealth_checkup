import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UKASBanner from "@/components/UKASBanner";
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { fitnessHealthCategories, bodybuildingTests, athleteTests } from "@/data/fitnessHealthCategories";
import { Trophy, Activity, TrendingUp, ArrowRight, Clock, Beaker, Star, Heart, Zap, ExternalLink, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SportsTestRecommendationEngine from "@/components/SportsTestRecommendationEngine";
import HeroSection from "@/components/sections/HeroSection";
import { SectionHeading } from "@/components/ui/section-heading";
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
        <title>Fitness Health Blood Tests | Athletic & Bodybuilding Testing | myhealth checkup</title>
        <meta name="description" content="Optimise your fitness and athletic performance with comprehensive health blood tests. Monitor bodybuilding biomarkers, nutrition status, and recovery markers from trusted UK providers. Compare prices and book today." />
        <meta name="keywords" content="fitness health tests, bodybuilding blood tests, athletic blood tests, fitness biomarkers, bodybuilder profile, sports nutrition testing, endurance testing, recovery markers, athlete health screening, UK fitness tests" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/sports-performance" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Fitness Health Blood Tests | Bodybuilding & Athletic Testing" />
        <meta property="og:description" content="Monitor fitness biomarkers, nutrition, and recovery with fitness health blood tests from trusted UK providers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/sports-performance" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fitness Health Blood Tests | Bodybuilding & Athletic Testing" />
        <meta name="twitter:description" content="Optimise fitness and athletic performance with comprehensive blood tests from trusted UK providers." />
      </Helmet>
      
      <UKASBanner />
      <Header />
      
      <main className="min-h-screen bg-background">
        <PageBreadcrumb 
          segments={[{ label: "Home", href: "/" }, { label: "Fitness Health" }]} 
          backLabel="Back"
        />

        <HeroSection
          title="Fitness Health Blood Tests"
          subtitle="Optimise your athletic performance with comprehensive biomarker analysis. Monitor bodybuilding markers, nutrition, recovery, and fitness biomarkers from trusted UK laboratories."
        />

        {/* Action Buttons Bar */}
        <section className="bg-[#22C0D4] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#081129] text-white hover:bg-[#081129]/90 font-semibold" onClick={() => navigate('/compare?category=fitness-health')}>
                Compare Tests
              </Button>
              <Button size="lg" variant="outline" className="border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold" onClick={() => navigate('/cancer-biomarkers')}>
                Biomarker Guide
              </Button>
              <Button size="lg" className="bg-[#081129] text-white hover:bg-[#081129]/90 font-semibold" onClick={() => navigate('/find-clinic')}>
                Find Clinic
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Bodybuilding Profile Tests */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionHeading 
                title="Bodybuilding" 
                gradientText="Profile Tests" 
                className="mb-4"
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive blood panels designed specifically for bodybuilders, strength athletes, and fitness enthusiasts
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {bodybuildingTests.map((test) => (
                <Card key={test.id} className="border-2 hover:border-[#E70D69] transition-all duration-300 hover:shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#081129] to-[#081129]/90 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-[#E70D69] text-white mb-2">Bodybuilding</Badge>
                        <CardTitle className="text-2xl text-white">{test.name}</CardTitle>
                        <CardDescription className="text-white/80">{test.provider}</CardDescription>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-[#22C0D4]">£{test.price}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4 line-clamp-3">{test.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Beaker className="w-4 h-4 text-[#E70D69]" />
                        <span className="font-medium">{test.biomarkerCount} Biomarkers</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-[#22C0D4]" />
                        <span>{test.turnaroundTime}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Key Biomarkers:</p>
                      <div className="flex flex-wrap gap-1">
                        {test.biomarkers.slice(0, 6).map((biomarker, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {biomarker}
                          </Badge>
                        ))}
                        {test.biomarkers.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{test.biomarkers.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4 space-y-1">
                      <p className="text-sm font-medium">Ideal for:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {test.whoShouldTest.slice(0, 2).map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#22C0D4] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {test.features.phlebotomyIncluded && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Phlebotomy Included
                        </Badge>
                      )}
                      {test.features.clinicVisitAvailable && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Clinic Visit
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-[#E70D69] hover:bg-[#E70D69]/90 text-white"
                      onClick={() => window.open(test.url, '_blank')}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Athlete Performance Tests from Sports Blood Tests (Edge) */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionHeading 
                title="Athlete Performance" 
                gradientText="Blood Tests" 
                className="mb-4"
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sport-specific blood tests from Sports Blood Tests (Edge) with sports doctor review and NHS lab analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {athleteTests.map((test) => (
                <Card key={test.id} className="border-2 hover:border-[#22C0D4] transition-all duration-300 hover:shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#22C0D4] to-[#22C0D4]/90 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-white/20 text-white mb-2">{test.category.charAt(0).toUpperCase() + test.category.slice(1)}</Badge>
                        <CardTitle className="text-xl text-white">{test.name}</CardTitle>
                        <CardDescription className="text-white/80">{test.provider}</CardDescription>
                      </div>
                    </div>
                    <div className="mt-2">
                      {test.subscriptionPrice && (
                        <div className="text-sm text-white/80">Subscribe & save: <span className="font-bold text-white">£{test.subscriptionPrice}</span></div>
                      )}
                      <span className="text-2xl font-bold text-white">£{test.price}</span>
                      <span className="text-sm text-white/80 ml-1">one-time</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4 text-sm line-clamp-3">{test.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Beaker className="w-4 h-4 text-[#22C0D4]" />
                        <span className="font-medium">{test.biomarkerCount} Biomarkers</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-[#E70D69]" />
                        <span>{test.turnaroundTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {test.features.sportsDoctorReview && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                          Sports Doctor Review
                        </Badge>
                      )}
                      {test.features.nhsLabAnalysis && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          NHS Lab Analysis
                        </Badge>
                      )}
                      {test.features.homeKitAvailable && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Home Kit
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-[#22C0D4] hover:bg-[#22C0D4]/90 text-white"
                      onClick={() => window.open(test.url, '_blank')}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionHeading 
                title="Why Choose Fitness" 
                gradientText="Health Testing?" 
                className="mb-4"
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Gain the competitive edge with data-driven insights into your athletic health
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-[#e70d69] shadow-lg">
                      <benefit.icon className="w-8 h-8 text-white" />
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
              <SectionHeading 
                title="Fitness Health" 
                gradientText="Categories" 
                className="mb-4"
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore specialized testing categories designed for athletes and fitness enthusiasts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {fitnessHealthCategories.map(category => {
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
                      </Button>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>
        </section>

        {/* AI Recommendation Engine Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionHeading 
                title="Personalized Test" 
                gradientText="Recommendations" 
                className="mb-4"
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get AI-powered test suggestions tailored to your sport, training goals, and experience level
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <SportsTestRecommendationEngine />
            </div>
          </div>
        </section>

        {/* Available Tests Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionHeading 
                title="Featured Fitness" 
                gradientText="Health Tests" 
                className="mb-4"
              />
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
                      <Button className="w-full bg-[#FA6980] hover:bg-[#E70D69] text-white" onClick={() => navigate('/compare?category=fitness-health')}>
                        Compare Prices
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>)}
              </div> : <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No fitness health tests found at the moment.</p>
                <Button onClick={() => navigate('/compare')}>
                  Browse All Tests
                </Button>
              </div>}

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" onClick={() => navigate('/compare?category=fitness-health')}>
                View All Fitness Health Tests
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Performance Optimization Section */}
        <section className="py-16 bg-[#081129]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 bg-[#081129]">
              <SectionHeading 
                title="Key Biomarkers for" 
                gradientText="Athletic Performance" 
                className="mb-4"
                titleClassName="text-white"
              />
              <p className="text-lg max-w-3xl mx-auto font-normal text-white">
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
                      <p className="text-[#081129]">{marker.description}</p>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>
        </section>

        {/* Athlete Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionHeading 
                title="Trusted by Athletes" 
                gradientText="Across the UK" 
                className="mb-4"
              />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from athletes who've optimised their performance with blood test insights
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-2 hover:border-[#FA6980] transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{testimonial.image}</div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.sport}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FA6980] text-[#FA6980]" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#FA6980] to-[#FFFFFF] ext-white bg-white">
          <div className="container mx-auto px-4 text-center">
            <SectionHeading 
              title="Ready to Optimise" 
              gradientText="Your Fitness?" 
              className="mb-4"
            />
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 text-[#081129]">
              Compare fitness health tests from trusted UK providers and take control of your athletic health today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate('/compare?category=fitness-health')}>
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