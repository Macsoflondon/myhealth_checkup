import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, CheckCircle2, Search, MapPin, Bot, Loader2 } from "lucide-react";
import HeroVideoPlayer from "./HeroVideoPlayer";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { LazyImage } from "@/components/LazyImage";
const NewHero = () => {
  const { t } = useTranslation();
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
    name: "Thyroid Function Tests",
    category: "hormones"
  }, {
    name: "Hormone Health Screen",
    category: "hormones"
  }, {
    name: "Vitamin D Blood Test",
    category: "vitamins"
  }, {
    name: "Full Blood Count (FBC)",
    category: "blood-tests"
  }, {
    name: "Cholesterol Profile",
    category: "heart-health"
  }, {
    name: "Diabetes Screening",
    category: "diabetes"
  }], []);
  return <section className="hero-bg relative overflow-hidden bg-gradient-to-br from-health-primary via-health-secondary to-health-accent text-white flex items-center" style={{
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
      
      <div className="relative z-10 w-full py-16 bg-[#081129]">
        <div className="max-w-6xl mx-auto text-center px-4">
          {/* Hero Video */}
          <div className="mb-8">
            <HeroVideoPlayer />
          </div>
          
          {/* Main Headline */}
          <div className="mb-8 bg-white rounded-2xl p-6 mx-4 md:mx-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#22c0d4] leading-tight">
              Compare the UK's leading private health test providers
              <span className="block text-[#fc0173] mt-2">All in one place!</span>
            </h1>
          </div>
          
          

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-2 backdrop-blur rounded-lg py-3 px-3 bg-[#081129]">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-health-success shrink-0" aria-hidden="true" />
              <span className="text-center font-medium text-xs sm:text-sm">No GP Referral Needed</span>
            </div>
            <div className="flex items-center justify-center space-x-2 backdrop-blur rounded-lg py-3 px-3 bg-[#081129]">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-health-success shrink-0" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-center">UKAS-Accredited Laboratories</span>
            </div>
            <div className="flex items-center justify-center space-x-2 backdrop-blur rounded-lg py-3 px-3 bg-[#081129]">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-health-success shrink-0" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-center">At-Home Test or In-Clinic Blood Draw</span>
            </div>
            <div className="flex items-center justify-center space-x-2 backdrop-blur rounded-lg py-3 px-3 bg-[#081129]">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-health-success shrink-0" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-center">Fast & accurate results you can trust</span>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-12 px-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder={t('hero.searchPrompt')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} className="w-full pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-health-primary focus:outline-none text-gray-800 placeholder-gray-500" />
                </div>
                <Button onClick={handleSearch} disabled={isAnalyzing} size="lg" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-[#22c0d4] hover:bg-[#22c0d4]/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 min-h-[44px]"
                style={{ backgroundColor: '#22c0d4', color: 'white' }}>
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
                  
                  <p className="text-gray-700 mb-4">{aiResults.analysis}</p>
                  
                  {aiResults.recommendedTests?.length > 0 && <div className="mb-4">
                      <h4 className="font-medium text-green-800 mb-2">✅ Tests We Offer:</h4>
                      <div className="space-y-2">
                        {aiResults.recommendedTests.map((test: any, index: number) => <div key={index} className="bg-white p-3 rounded border border-green-200">
                            <div className="font-medium text-green-700">{test.testName}</div>
                            <div className="text-sm text-gray-600">{test.reason}</div>
                            <div className="text-xs text-blue-600 mt-1">Category: {test.category}</div>
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
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => <button key={index} onClick={() => navigate(`/tests/${search.category}`)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-health-primary hover:text-white rounded-full transition-all duration-200 text-gray-700 font-sans">
                      {search.name}
                    </button>)}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-#22C0D4 mb-2">7</div>
              <div className="text-#22C0D4/80">Trusted Providers</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-#22C0D4 mb-2">300+</div>
              <div className="text-#22C0D4/80">Available Tests</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-#22C0D4 mb-2">3-5 Days</div>
              <div className="text-#22C0D4/80">Fast Results</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-#22C0D4 mb-2">50,000+</div>
              <div className="text-#22C0D4/80">Tests Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default NewHero;