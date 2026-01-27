// Hero component - focused on speed, reassurance, and trust
import { Button } from "@/components/ui/button";
import { Shield, CreditCard, Eye, Search, Loader2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { logger } from "@/lib/logger";

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
    { icon: Shield, text: "UKAS accredited laboratories only" },
    { icon: Shield, text: "CQC regulated providers" },
    { icon: CreditCard, text: "No payments taken on this site" },
    { icon: Eye, text: "Independent comparison" }
  ];

  return (
    <>
      {/* Hero Video Section - Pulled up to sit behind toolbar */}
      <section 
        className="relative overflow-hidden bg-[#081129]"
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
      <section className="bg-white py-10 sm:py-14 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline - Clear promise in plain language */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#081129] leading-tight mb-4 sm:mb-6">
              Compare private blood tests from trusted UK providers
            </h1>
            
            {/* Subheading - What you get, no waffle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-sans mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Prices, biomarkers, and turnaround times in one place.
              <br className="hidden sm:block" />
              No GP referral. UK accredited labs only.
            </p>
            
            {/* Primary & Secondary CTAs - Immediate action path */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10">
              <Button 
                size="lg" 
                onClick={() => navigate('/compare')}
                className="bg-[#22c0d4] hover:bg-[#1ba8b8] text-white font-semibold rounded-xl shadow-md px-8"
              >
                Compare blood tests
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/assisted-test-finder')}
                className="border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold rounded-xl"
              >
                Find the right test for you
              </Button>
            </div>

            {/* Search Bar - Prominent navy themed section */}
            <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
              <div className="bg-[#e70d69] rounded-2xl p-6 sm:p-8 shadow-xl">
                <p className="text-center text-base sm:text-lg text-white font-medium mb-5">
                  Or search for a specific test
                </p>
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search over 200 tests..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    className="w-full pl-12 pr-4 py-4 text-base border-0 rounded-xl focus:ring-2 focus:ring-[#22c0d4] focus:outline-none text-[#081129] bg-white shadow-md" 
                  />
                  {isAnalyzing && (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-[#22c0d4]" />
                  )}
                </div>
                
                {/* Search Button */}
                <Button 
                  onClick={handleSearch}
                  disabled={!searchTerm.trim() || isAnalyzing}
                  className="w-full bg-[#22c0d4] hover:bg-white hover:text-[#081129] text-white font-semibold py-4 h-auto rounded-xl shadow-md text-base transition-colors"
                >
                  Start Your Search
                </Button>
                
                {/* AI Results */}
                {aiResults && (
                  <div className="mt-5 p-4 bg-white/10 rounded-xl border border-white/20">
                    <p className="text-white mb-3">{aiResults.analysis}</p>
                    {aiResults.recommendedTests?.length > 0 && (
                      <div className="space-y-2">
                        {aiResults.recommendedTests.map((test: any, index: number) => (
                          <div key={index} className="bg-white/10 p-3 rounded-lg border border-white/20">
                            <div className="font-medium text-white">{test.testName}</div>
                            <div className="text-sm text-white/70">{test.reason}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button 
                      onClick={() => navigate('/compare')} 
                      className="w-full mt-3 bg-[#22c0d4] hover:bg-white hover:text-[#22c0d4] transition-colors"
                    >
                      View available tests
                    </Button>
                  </div>
                )}
                
                {/* Popular Searches */}
                <div className="mt-5 text-center">
                  <p className="text-sm font-bold text-white mb-3">Popular:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularSearches.map((search, index) => (
                      <button 
                        key={index} 
                        onClick={() => navigate(search.route)} 
                        className="px-4 py-2 text-sm bg-[#22c0d4] hover:bg-white text-white hover:text-[#081129] rounded-full transition-colors border border-[#22c0d4] hover:border-white"
                      >
                        {search.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust Signals - Scannable, one line per idea, appears early */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-6 sm:mb-8">
              {trustSignals.map((signal, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 text-sm sm:text-base text-gray-700"
                >
                  <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#22c0d4] flex-shrink-0" />
                  <span className="font-sans">{signal.text}</span>
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
