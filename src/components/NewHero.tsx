// Hero component with fullscreen video - v2.0
import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, CheckCircle2, Search, MapPin, Bot, Loader2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import AccreditationLogos from "@/components/AccreditationLogos";
import { logger } from "@/lib/logger";
import { providers } from "@/data/compare/providers";
const NewHero = () => {
  const {
    t
  } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setIsAnalyzing(true);
    setAiResults(null);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('health-ai-analysis', {
        body: {
          query: searchTerm
        }
      });
      if (error) throw error;
      setAiResults(data);
      if (data.hasRecommendations) {
        toast({
          title: "AI Analysis Complete",
          description: `Found ${data.recommendedTests?.length || 0} relevant tests for your query.`
        });
      }
    } catch (error) {
      logger.error('AI analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "Unable to analyze your query. Proceeding with regular search.",
        variant: "destructive"
      });
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [searchTerm, navigate, toast]);
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  const popularSearches = useMemo(() => [{
    name: "General Health Test",
    route: "/test/general-health"
  }, {
    name: "Male Hormone Test",
    route: "/test/male-hormones"
  }, {
    name: "Vitamin D Test",
    route: "/test/vitamin-d"
  }, {
    name: "Iron Profile",
    route: "/test/iron-profile"
  }, {
    name: "Well Woman Test",
    route: "/test/well-woman"
  }], []);
  return <>
      {/* Hero Video Section */}
      <section className="relative overflow-hidden bg-[#081129]">
        <div className="w-full py-0">
          <div className="w-full text-center px-0">
            {/* Hero Video Container - Responsive */}
            <div className="relative mx-auto w-full">
              <div className="relative w-[90vw] sm:w-[95vw] md:w-full h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[70vh] xl:h-screen overflow-hidden mx-auto rounded-lg">
                <video autoPlay loop muted playsInline preload="metadata" poster="/lovable-uploads/hero-image-1.png" className="absolute inset-0 w-full h-full object-contain object-center" src="/hero-video-new.mp4" aria-label="myhealth checkup - Your health is your greatest asset">
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Full-width Headline Banner */}
      <section className="w-full bg-[#081129] py-0">
      <div className="w-full px-4 bg-[#081129]">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight font-medium text-center whitespace-nowrap">
          <span className="text-[#22c0d4]">Compare the UK's leading private health test providers - </span>
          <span className="text-[#fc0173]">All in one place!</span>
        </h1>
        </div>
      </section>
      
      {/* Trust Indicators and Search Section */}
      <section className="hero-bg relative overflow-hidden bg-gradient-to-br from-health-primary via-health-secondary to-health-accent text-white" style={{
      backgroundImage: `linear-gradient(rgba(8, 17, 41, 0.8), rgba(8, 17, 41, 0.8)), url('/lovable-uploads/11b262c6-6809-4179-be41-47c54752fd80.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      willChange: 'transform'
    }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="wave-pattern h-full w-full"></div>
        </div>
        
        <div className="relative z-10 w-full my-0 py-[20px] bg-[#081129]">
          <div className="w-full text-center px-4">
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 max-w-5xl mx-auto px-4">
              <div className="rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 bg-white flex flex-col sm:flex-row items-center justify-center gap-3 min-h-[100px]">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center sm:text-left text-sm sm:text-base font-medium text-[#081129] leading-tight">No GP Referral Needed</span>
              </div>
              <div className="rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 bg-white flex flex-col sm:flex-row items-center justify-center gap-3 min-h-[100px]">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center sm:text-left text-sm sm:text-base font-medium text-[#081129] leading-tight">UKAS-Accredited Laboratories</span>
              </div>
              <div className="rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 bg-white flex flex-col sm:flex-row items-center justify-center gap-3 min-h-[100px]">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center sm:text-left text-sm sm:text-base font-medium text-[#081129] leading-tight">At-Home Test or In-Clinic Blood Draw</span>
              </div>
              <div className="rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all duration-300 bg-white flex flex-col sm:flex-row items-center justify-center gap-3 min-h-[100px]">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center sm:text-left text-sm sm:text-base font-medium text-[#081129] leading-tight">Test Results In 3-5 Days *</span>
              </div>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-12 px-2 shadow-lime-400 rounded">
              <div className="rounded-2xl p-4 sm:p-6 shadow-2xl py-[14px] bg-white">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-health-success w-5 h-5" />
                    <input type="text" placeholder={t('hero.searchPrompt')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} className="w-full pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-health-primary focus:outline-none text-[#081129] w-full " />
                  </div>
                  <Button onClick={handleSearch} disabled={isAnalyzing} size="lg" style={{
                  backgroundColor: '#22c0d4',
                  color: 'white'
                }} className="px-6 sm:px-8 py-3 text-base text-white rounded-xl transition-all duration-300 transform hover:scale-105 min-h-[44px] bg-[#22c0d4] sm:py-[16px] font-medium sm:text-sm text-center my-[10px]">
                    {isAnalyzing ? <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </> : <>
                        <Bot className="w-5 h-5 mr-2" />
                        Start Your Search
                      </>}
                  </Button>
                </div>
                
                {/* AI Results */}
                {aiResults && <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">AI Analysis Results</h3>
                    </div>
                    
                    <p className="text-[#081129] mb-4">{aiResults.analysis}</p>
                    
                    {aiResults.recommendedTests?.length > 0 && <div className="mb-4">
                        <h4 className="font-medium text-green-800 mb-2">✅ Tests We Offer:</h4>
                        <div className="space-y-2">
                          {aiResults.recommendedTests.map((test: any, index: number) => <div key={index} className="bg-white p-3 rounded border border-green-200">
                              <div className="font-medium text-green-700">{test.testName}</div>
                              <div className="text-sm text-gray-600">{test.reason}</div>
                              <div className="text-xs mt-1 text-white bg-[#22c0d4]">Category: {test.category}</div>
                            </div>)}
                        </div>
                      </div>}
                    
                    {aiResults.alternativeProviders?.length > 0 && <div className="mb-4">
                        <h4 className="font-medium text-orange-800 mb-2">⚠️ Tests Not Available - Alternative Providers:</h4>
                        <div className="space-y-2">
                          {aiResults.alternativeProviders.map((alt: any, index: number) => <div key={index} className="bg-orange-50 p-3 rounded border border-orange-200">
                              <div className="font-medium text-orange-700">{alt.testName}</div>
                              <div className="text-sm text-gray-600">Suggested: {alt.suggestedProvider}</div>
                              <div className="text-xs text-red-600 mt-1 italic">{alt.disclaimer}</div>
                            </div>)}
                        </div>
                      </div>}
                    
                    <Button onClick={() => navigate('/compare-tests')} className="w-full mt-3 bg-health-primary hover:bg-health-primary/90">
                      Compare Available Tests
                    </Button>
                  </div>}
                
                {/* Popular Searches */}
                <div className="mt-6 my-[10px]">
                  <p className="text-sm text-[#081129] mb-3">Popular searches:</p>
                  <div className="space-y-2">
                    {/* Top row - 3 tests */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularSearches.slice(0, 3).map((search, index) => <button key={index} onClick={() => navigate(search.route)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-health-primary hover:text-white rounded-full transition-all duration-200 text-[#081129] font-sans">
                          {search.name}
                        </button>)}
                    </div>
                    {/* Bottom row - 2 tests evenly spaced */}
                    <div className="flex gap-2 justify-center">
                      {popularSearches.slice(3, 5).map((search, index) => <button key={index + 3} onClick={() => navigate(search.route)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-health-primary hover:text-white rounded-full transition-all duration-200 text-[#081129] font-sans">
                          {search.name}
                        </button>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-4xl mx-auto px-4">
              <div className="backdrop-blur rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 min-w-[200px] max-w-[250px] flex items-center justify-center space-x-3 backdrop-blur bg-white">
                <span className="text-[#22c0d4] text-center text-lg font-bold">7 Trusted Providers</span>
              </div>
              <div className="backdrop-blur rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 min-w-[200px] max-w-[250px] flex items-center justify-center space-x-3 bg-white">
                <span className="text-center text-lg font-semibold text-[#e70d69]">300+ Available Tests</span>
              </div>
              
              <div className="backdrop-blur rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 min-w-[200px] max-w-[250px] flex items-center justify-center space-x-3 bg-white py-0">
                <span className="text-center text-[#22c0d4] text-lg font-bold">150 + Nationwide Clinics</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Accreditation Logos */}
      <AccreditationLogos />
      
      {/* Our Partners Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#081129] mb-12">
            Our Partners
          </h2>
          {/* Top Row - 4 providers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {providers.slice(0, 4).map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <img
                  src={provider.logo}
                  alt={`${provider.name} logo`}
                  className="h-36 md:h-48 w-auto object-contain mx-auto"
                />
              </div>
            ))}
          </div>

          {/* Bottom Row - 3 providers (centered) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {providers.slice(4, 7).map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <img
                  src={provider.logo}
                  alt={`${provider.name} logo`}
                  className="h-36 md:h-48 w-auto object-contain mx-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Full-width Text Banner Divider */}
      <section className="w-full py-8 bg-[#081129]">
        <div className="w-full px-4">
          <h2 className="text-xl sm:text-2xl text-center leading-tight font-medium lg:text-4xl md:text-4xl text-white">
            Your <span className="text-[#22c0d4]">health</span> is your greatest <span className="text-[#e70d69]">asset!</span>
          </h2>
        </div>
      </section>
    </>;
};
export default NewHero;