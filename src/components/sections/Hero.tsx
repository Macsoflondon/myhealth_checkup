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
      <section className="bg-background py-6 sm:py-10 md:py-14 lg:py-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline - Clear promise in plain language, mobile-first sizing */}
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight sm:leading-snug mb-3 sm:mb-4 md:mb-6">
              <span className="text-brand-navy block">Compare the UK's leading private health test providers -</span>
              <span className="text-brand-pink block mt-1 sm:mt-2">All in one place!</span>
            </h1>
            
            {/* Subheading - What you get, no waffle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-sans mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Prices, biomarkers, and turnaround times in one place.
              <br className="hidden sm:block" />
              No GP referral. UK accredited labs only.
            </p>
            
            {/* Primary & Secondary CTAs - Immediate action path */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center mb-6 sm:mb-8 md:mb-10">
              <Button 
                size="default"
                onClick={() => navigate('/compare')}
                className="bg-brand-turquoise hover:bg-brand-turquoise/80 text-white font-semibold rounded-xl shadow-md px-4 sm:px-6 md:px-8 text-sm sm:text-base h-10 sm:h-11 md:h-12"
              >
                Compare blood tests
              </Button>
              <Button 
                size="default"
                variant="outline"
                onClick={() => navigate('/assisted-test-finder')}
                className="border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-semibold rounded-xl px-4 sm:px-6 md:px-8 text-sm sm:text-base h-10 sm:h-11 md:h-12"
              >
                Find the right test for you
              </Button>
            </div>

            {/* Search Bar - Clean white card */}
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10">
              <div className="bg-background rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
                <div className="relative">
                  <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-brand-turquoise w-5 h-5 sm:w-6 sm:h-6" />
                  <input 
                    type="text" 
                    placeholder="Search from over 200 tests" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-4 sm:py-5 text-base sm:text-lg border border-border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-brand-turquoise focus:border-brand-turquoise focus:outline-none text-brand-navy bg-background" 
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
                      className="w-full mt-3 bg-brand-turquoise hover:bg-brand-turquoise/80 text-white transition-colors"
                    >
                      View available tests
                    </Button>
                  </div>
                )}
                
                {/* Popular Searches */}
                <div className="mt-4 sm:mt-5 text-center">
                  <p className="text-sm sm:text-base font-bold text-foreground mb-3 sm:mb-4">Popular searches:</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    {popularSearches.map((search, index) => (
                      <button 
                        key={index} 
                        onClick={() => navigate(search.route)} 
                        className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base text-foreground bg-muted hover:bg-brand-turquoise hover:text-white rounded-full transition-colors border border-border hover:border-brand-turquoise"
                      >
                        {search.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust Signals - Scannable, one line per idea, appears early */}
            <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-2 sm:gap-y-3 mb-4 sm:mb-6 md:mb-8">
              {trustSignals.map((signal, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base text-muted-foreground"
                >
                  <signal.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-turquoise flex-shrink-0" />
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
