import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, CheckCircle2, Search, MapPin, Bot, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
const NewHero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSearch = async () => {
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
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const popularSearches = [{
    name: "Thyroid Function",
    category: "hormones"
  }, {
    name: "Hormone Health",
    category: "hormones"
  }, {
    name: "Vitamin D",
    category: "vitamins"
  }, {
    name: "Full Blood Count",
    category: "blood-tests"
  }, {
    name: "Cholesterol",
    category: "heart-health"
  }, {
    name: "Diabetes Check",
    category: "diabetes"
  }, {
    name: "Iron Levels",
    category: "blood-tests"
  }, {
    name: "B12 & Folate",
    category: "vitamins"
  }];
  return <section className="relative overflow-hidden bg-gradient-to-br from-health-primary via-health-secondary to-health-accent text-white min-h-screen flex items-center -mt-[72px] pt-[72px]" style={{
    backgroundImage: `linear-gradient(rgba(8, 17, 41, 0.8), rgba(8, 17, 41, 0.8)), url('/lovable-uploads/11b262c6-6809-4179-be41-47c54752fd80.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="wave-pattern h-full w-full bg-[t] rounded bg-[#f6f7f9] mx-0"></div>
      </div>
      
      <div className="relative z-10 w-full py-0 bg-[#081129]">
        <div className="max-w-6xl mx-auto text-center py-[20px] my-[20px]">
          {/* Full Logo */}
          <div className="mb-8">
            <img src="/lovable-uploads/dab4e6be-6163-40c2-9fe0-67192f056388.png" alt="myhealth checkup - Your health is your greatest asset" className="mx-auto w-full h-auto transform scale-125" />
          </div>
          {/* Main Headline */}
          <h1 className="text-4xl lg:text-6xl mb-6 leading-tight text-center font-semibold text-zinc-50 md:text-5xl my-[10px]">
            <span className="block font-semibold relative z-20 mt-8 bg-white w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] text-5xl text-center py-[12px]">
              <span className="block text-2xl my-[10px] leading-tight text-center md:text-4xl font-semibold text-[#22c0d4] lg:text-4xl">
                Compare the UK's leading private health test providers
                <span className="text-health-highlight ml-2">- All in one place!</span>
              </span>
              
            </span>
          </h1>
          
          

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 backdrop-blur rounded-lg py-3 px-4 bg-[#081129] text-4xl">
              <CheckCircle2 className="w-8 h-8 text-health-success shrink-0" aria-hidden="true" />
              <span className="text-center font-medium text-sm mx-[10px]">No GP Referral Needed</span>
            </div>
            <div className="flex items-center justify-center space-x-2 backdrop-blur rounded-lg py-3 px-4 bg-[#081129]">
              <Shield className="w-8 h-8 text-health-success shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">UKAS-Accredited Laboratories</span>
            </div>
            <div className="flex items-center justify-center space-x-2 backdrop-blur rounded-lg py-3 px-4 bg-[#081129]">
              <MapPin className="w-8 h-8 text-health-success shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">At-Home Test or In-Clinic Blood Draw</span>
            </div>
            <div className="flex items-center justify-center space-x-2 backdrop-blur rounded-lg py-3 px-4 bg-[#081129]">
              <Clock className="w-8 h-8 text-health-success shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">Fast & accurate results you can trust</span>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Describe your health concerns or symptoms for AI-powered test recommendations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-health-primary focus:outline-none text-gray-800 placeholder-gray-500" />
                </div>
                <Button onClick={handleSearch} disabled={isAnalyzing} size="lg" className="px-8 py-4 text-lg bg-health-accent hover:bg-health-accent/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
                  {isAnalyzing ? <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </> : <>
                      <Bot className="w-5 h-5 mr-2" />
                      AI Analysis
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
                  {popularSearches.map((search, index) => <button key={index} onClick={() => navigate(`/tests/${search.category}`)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-health-primary hover:text-white rounded-full transition-all duration-200 text-gray-700">
                      {search.name}
                    </button>)}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-#22C0D4 mb-2"> 5+</div>
              <div className="text-#22C0D4/80">Trusted Providers</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-#22C0D4 mb-2">30+</div>
              <div className="text-#22C0D4/80">Available Tests</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-#22C0D4 mb-2">48-72hrs</div>
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