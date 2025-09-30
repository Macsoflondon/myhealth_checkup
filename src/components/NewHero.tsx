import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, CheckCircle2, Search, MapPin, Bot, Loader2 } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { LazyImage } from "@/components/LazyImage";
import AccreditationLogos from "@/components/AccreditationLogos";
const NewHero = () => {
  const {
    t
  } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Hero images that will alternate
  const heroImages = ["/lovable-uploads/hero-image-1.png", "/lovable-uploads/hero-image-2.png"];

  // Alternate images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, [heroImages.length]);
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
      console.error('AI analysis error:', error);
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
      {/* Hero Image Section */}
      <section className="relative overflow-hidden bg-[#081129]">
        <div className="w-full py-0">
          <div className="w-full text-center px-4">
            {/* Hero Images Container */}
            <div className="mb-8 relative max-w-7xl mx-auto">
              <div style={{
              aspectRatio: '16/9'
            }} className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#081129]">
                {/* Hero images */}
                {heroImages.map((imageSrc, index) => <img key={imageSrc} src={imageSrc} alt="myhealth checkup - Your health is your greatest asset" className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} loading={index === 0 ? "eager" : "lazy"} />)}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Full-width Headline Banner */}
      <section className="w-full bg-white py-0">
        <div className="w-full px-4 my-0 bg-[#081129] py-[10px]">
          <h1 className="text-2xl sm:text-3xl text-[#22c0d4] text-center leading-tight md:text-5xl my-[10px] font-medium xl:text-4xl">
            Compare the UK's leading private health test providers
            <span className="block text-[#fc0173] mt-2 my-[28px] font-medium text-4xl">All in one place!</span>
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
            <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-4xl mx-auto px-4">
              <div className="backdrop-blur rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 min-w-[200px] max-w-[250px] flex items-center justify-center space-x-3 bg-white">
                <CheckCircle2 className="w-8 h-8 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center font-medium text-base text-[#081129]">No GP Referral Needed</span>
              </div>
              <div className="backdrop-blur rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 min-w-[200px] max-w-[250px] flex items-center justify-center space-x-3 bg-white py-[20px]">
                <Shield className="w-8 h-8 text-health-success shrink-0" aria-hidden="true" />
                <span className="font-medium text-center text-base text-[#081129]">UKAS-Accredited Laboratories</span>
              </div>
              <div className="backdrop-blur rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 min-w-[200px] max-w-[250px] flex items-center justify-center space-x-3 bg-white py-[4px]">
                <MapPin className="w-8 h-8 text-health-success shrink-0" aria-hidden="true" />
                <span className="font-medium text-center text-base text-[#081129]">At-Home Test or In-Clinic Blood Draw</span>
              </div>
              <div className="backdrop-blur rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 min-w-[200px] max-w-[250px] flex items-center justify-center space-x-3 bg-white py-[20px]">
                <Clock aria-hidden="true" className="w-8 h-8 text-health-success shrink-0 mx-[10px]" />
                <span className="font-medium text-center text-base my-0 px-0 mx-0 text-[#081129]">Test Results
 In 3-5 Days *</span>
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
      
      {/* Full-width Text Banner Divider */}
      <section className="w-full py-8 bg-[#081129]">
        <div className="w-full px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-center leading-tight text-white font-medium lg:text-4xl">
            Your <span className="text-[#22c0d4]">health</span>. Your <span className="text-[#fc0173]">choice</span>. One trusted platform.
          </h2>
        </div>
      </section>
    </>;
};
export default NewHero;