// Hero component - focused on speed, reassurance, and trust
import { Button } from "@/components/ui/button";
import { Shield, CreditCard, Eye, Search, Loader2, UserX } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { logger } from "@/lib/logger";
import heroBgImage from "@/assets/hero-bg-blood-tubes.jpg";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setIsAnalyzing(true);
    setAiResults(null);
    try {
      const { data, error } = await supabase.functions.invoke('health-ai-analysis', {
        body: { query: searchTerm }
      });
      if (error) throw error;
      setAiResults(data);
      if (data.hasRecommendations) {
        toast({
          title: "Analysis Complete",
          description: `Found ${data.recommendedTests?.length || 0} relevant tests.`
        });
      }
    } catch (error) {
      logger.error('AI analysis error:', error);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [searchTerm, navigate, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  }, [handleSearch]);

  const popularSearches = useMemo(() => [
    { name: "Full Blood Count", route: "/test/full-blood-count" },
    { name: "Thyroid Function", route: "/test/thyroid" },
    { name: "Vitamin D", route: "/test/vitamin-d" },
    { name: "Liver Function", route: "/test/liver-function" }
  ], []);

  // Trust signals - scannable, one line per idea
  const trustSignals = [
    { icon: Shield, text: "UKAS Accredited Laboratories Only" },
    { icon: Shield, text: "CQC Regulated Providers" },
    { icon: CreditCard, text: "No Payments Taken On This Site" },
    { icon: UserX, text: "No GP Referral Needed" },
    { icon: Eye, text: "Independent Comparison" }
  ];

  return (
    <>
      {/* Hero Video Section - Pulled up to sit behind toolbar */}
      <section 
        className="relative overflow-hidden bg-brand-navy"
        style={{ marginTop: 'calc(-1 * var(--toolbar-height, 50px))' }}
      >
        <div className="relative w-full aspect-[4/5] xs:aspect-[4/3] sm:aspect-[16/10] lg:aspect-video overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            poster="/lovable-uploads/hero-image-1.png" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="/myhealth_checkup.mp4" 
            aria-label="myhealth checkup"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
      
      {/* Main Hero Content - Clear promise, immediate action */}
      <section className="relative overflow-hidden py-6 sm:py-10 md:py-14 lg:py-20">
        {/* Background image */}
        <img
          src={heroBgImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* White overlay for readability */}
        <div className="absolute inset-0 bg-white/[0.65] z-[1]" />
        <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline - Clear promise in plain language */}
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight sm:leading-snug mb-3 sm:mb-4 md:mb-6">
              <span className="text-brand-navy block">Compare the UK's leading private health test providers - <span className="text-brand-pink">All in one place!</span></span>
            </h1>

            {/* Mission text block with turquoise left border */}
            <div className="max-w-3xl mx-auto text-left mb-4 sm:mb-6 md:mb-8">
              <div className="border-l-4 border-brand-turquoise pl-4 sm:pl-6 space-y-3 sm:space-y-4 text-brand-navy font-sans text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                <p className="font-bold">
                  At myhealth <span className="text-brand-pink">checkup</span>, we believe everyone deserves access to transparent, trustworthy health information.
                </p>
                <p>
                  Our mission is to empower you to take control of your health by making it simple to compare private health tests from accredited UK providers.
                </p>
                <p>
                  We only feature providers that meet rigorous quality standards, including UKAS accreditation and CQC regulation.
                </p>
              </div>
            </div>

            {/* Prices | Biomarkers | Turnaround Times */}
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 mb-4 sm:mb-6 md:mb-8">
              {["Prices", "Biomarkers", "Turnaround Times"].map((item, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base text-brand-navy">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-turquoise flex-shrink-0" />
                  <span className="font-sans font-semibold">{item}</span>
                </div>
              ))}
            </div>
            
            {/* Primary & Secondary CTAs - Immediate action path */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center mb-6 sm:mb-8 md:mb-10">
              <Button 
                size="default"
                onClick={() => navigate('/compare')}
                className="bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold rounded-xl shadow-md px-4 sm:px-6 md:px-8 text-sm sm:text-base h-10 sm:h-11 md:h-12 transition-colors duration-300"
              >
                Compare blood tests
              </Button>
              <Button 
                size="default"
                onClick={() => navigate('/assisted-test-finder')}
                className="bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold rounded-xl shadow-md px-4 sm:px-6 md:px-8 text-sm sm:text-base h-10 sm:h-11 md:h-12 transition-colors duration-300"
              >
                Find the right test for you
              </Button>
            </div>

            {/* Search Bar - Clean white card */}
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10">
              <div className="bg-background rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-400">
                <div className="relative">
                  <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-brand-turquoise w-5 h-5 sm:w-6 sm:h-6" />
                  <input 
                    type="text" 
                    placeholder="Search from over 200 tests"
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-4 sm:py-5 text-base sm:text-lg border border-gray-400 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-brand-turquoise focus:border-brand-turquoise focus:outline-none text-brand-navy bg-background placeholder:text-[#22c0d4]"
                  />
                  {isAnalyzing && (
                    <Loader2 className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 animate-spin text-brand-turquoise" />
                  )}
                </div>
                
                {/* AI Results */}
                {aiResults && (
                  <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
                    <p className="text-foreground mb-3">{aiResults.analysis}</p>
                    {aiResults.recommendedTests?.length > 0 && (
                      <div className="space-y-2">
                        {aiResults.recommendedTests.map((test: any, index: number) => (
                          <div key={index} className="bg-background p-3 rounded-lg border border-border">
                            <div className="font-medium text-foreground">{test.testName}</div>
                            <div className="text-sm text-muted-foreground">{test.reason}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button 
                      onClick={() => navigate('/compare')} 
                      className="w-full mt-3 bg-[#22c0d4] hover:bg-[#e70d69] text-white transition-colors duration-300"
                    >
                      View available tests
                    </Button>
                  </div>
                )}
                
                {/* Popular Searches */}
                <div className="mt-4 sm:mt-5 text-center border border-gray-400 rounded-xl p-3 sm:p-4">
                  <p className="text-sm sm:text-base font-bold text-foreground mb-3 sm:mb-4">Popular searches:</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    {popularSearches.map((search, index) => (
                      <button 
                        key={index} 
                        onClick={() => navigate(search.route)} 
                        className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base text-white bg-[#22c0d4] hover:bg-[#e70d69] rounded-full border border-gray-400 transition-colors duration-300"
                      >
                        {search.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Bar - separate band */}
      <section className="bg-[#f0fafb] py-4 sm:py-5 md:py-6">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Row 1: 3 items */}
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 mb-3">
              {trustSignals.slice(0, 3).map((signal, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base text-brand-navy"
                >
                  <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-turquoise flex-shrink-0" />
                  <span className="font-sans font-semibold">{signal.text}</span>
                </div>
              ))}
            </div>
            {/* Row 2: 2 items centred */}
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3">
              {trustSignals.slice(3).map((signal, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base text-brand-navy"
                >
                  <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-turquoise flex-shrink-0" />
                  <span className="font-sans font-semibold">{signal.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
