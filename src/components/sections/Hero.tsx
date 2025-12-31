// Hero component with fullscreen video
import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, CheckCircle2, Search, MapPin, Bot, Loader2 } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import AccreditationLogos from "@/components/sections/AccreditationLogos";
import { logger } from "@/lib/logger";
import { providers } from "@/constants/providers";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ScrollFadeIn from "@/components/common/ScrollFadeIn";
const Hero = () => {
  const {
    t
  } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  
  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
    name: t('hero.generalHealthTest'),
    route: "/test/general-health"
  }, {
    name: t('hero.maleHormoneTest'),
    route: "/test/male-hormones"
  }, {
    name: t('hero.vitaminDTest'),
    route: "/test/vitamin-d"
  }, {
    name: t('hero.ironProfile'),
    route: "/test/iron-profile"
  }, {
    name: t('hero.wellWomanTest'),
    route: "/test/well-woman"
  }], [t]);
  return <>
      {/* Hero Video Section */}
      <section className="relative overflow-hidden bg-[#081129]">
        <div className="w-full">
          {/* Hero Video Container - Optimized for mobile */}
          <div className="relative w-full aspect-[4/5] xs:aspect-[4/3] sm:aspect-[16/10] lg:aspect-video overflow-hidden bg-[#081129]">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              poster="/lovable-uploads/hero-image-1.png" 
              className="absolute inset-0 w-full h-full object-cover" 
              src="/myhealth_checkup.mp4" 
              aria-label="myhealth checkup - Your health is your greatest asset"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
      
      {/* Mission Section - Clean white background */}
      <section className="w-full bg-white py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <ScrollFadeIn delay={100}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl leading-tight font-heading font-bold text-left mb-6">
              <span className="text-[#081129]">Your health is your </span>
              <span className="text-[#22c0d4]">greatest asset</span>
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn delay={200}>
            <div className="text-base sm:text-lg text-[#081129] font-sans leading-relaxed space-y-4">
              <p>
                At myhealth checkup, we believe everyone deserves access to transparent, trustworthy health information. Our mission is to empower you to take control of your health by making it simple to compare private health tests from accredited UK providers.
              </p>
              <p>
                We only feature providers that meet rigorous quality standards, including UKAS accreditation and CQC regulation.
              </p>
              <p className="font-medium">
                Our recommendations are based on clinical evidence and reviewed by registered healthcare professionals.
              </p>
            </div>
          </ScrollFadeIn>
          
          {/* Trust Indicator Cards - Horizontal scroll */}
          <ScrollFadeIn delay={300}>
            <div className="mt-8 flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex-shrink-0 bg-gray-50 rounded-xl p-4 flex items-center gap-3 min-w-[180px] shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-[#22c0d4]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#22c0d4]" />
                </div>
                <div>
                  <p className="font-semibold text-[#081129] text-sm">UKAS Accredited</p>
                  <p className="text-xs text-gray-500">Labs</p>
                </div>
              </div>
              <div className="flex-shrink-0 bg-gray-50 rounded-xl p-4 flex items-center gap-3 min-w-[180px] shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-[#22c0d4]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#22c0d4]" />
                </div>
                <div>
                  <p className="font-semibold text-[#081129] text-sm">CQC Regulated</p>
                  <p className="text-xs text-gray-500">Providers</p>
                </div>
              </div>
              <div className="flex-shrink-0 bg-gray-50 rounded-xl p-4 flex items-center gap-3 min-w-[180px] shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-[#22c0d4]/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#22c0d4]" />
                </div>
                <div>
                  <p className="font-semibold text-[#081129] text-sm">ISO 15189</p>
                  <p className="text-xs text-gray-500">Certified</p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>
      
      {/* Background wrapper for pink tubes image - extends through search section */}
      <div className="relative w-full overflow-hidden">
        {/* Pink tubes background with parallax effect */}
        <div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <picture>
            <source srcSet="/lovable-uploads/hero-bg-pink-tubes.webp" type="image/webp" />
            <img 
              src="/lovable-uploads/hero-bg-pink-tubes.jpeg"
              alt=""
              className="w-full h-[120%] object-cover"
              loading="lazy"
            />
          </picture>
        </div>
        
        {/* Lighter overlay for better background visibility */}
        <div className="absolute inset-0 bg-[#081129]/55 z-[1]" />
        
        {/* Trust Indicators and Search Section */}
        <section className="relative overflow-hidden text-white w-full">
          <div className="relative z-10 w-full py-3 sm:py-6">
          <div className="w-full text-center px-3 sm:px-4">
            {/* Trust Indicators - Mobile optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 max-w-4xl mx-auto">
              <div className="rounded-lg p-2 sm:p-3 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col items-center justify-center gap-1.5 sm:gap-2 min-h-[60px] sm:min-h-[80px] hover-glow-turquoise cursor-pointer">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center text-[10px] sm:text-sm font-medium text-[#081129] leading-tight">{t('hero.noGPReferral')}</span>
              </div>
              <div className="rounded-lg p-2 sm:p-3 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col items-center justify-center gap-1.5 sm:gap-2 min-h-[60px] sm:min-h-[80px] hover-glow-turquoise cursor-pointer">
                <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center text-[10px] sm:text-sm font-medium text-[#081129] leading-tight">{t('hero.ukasAccredited')}</span>
              </div>
              <div className="rounded-lg p-2 sm:p-3 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col items-center justify-center gap-1.5 sm:gap-2 min-h-[60px] sm:min-h-[80px] hover-glow-pink cursor-pointer">
                <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center text-[10px] sm:text-sm font-medium text-[#081129] leading-tight">{t('hero.atHomeTest')}</span>
              </div>
              <div className="rounded-lg p-2 sm:p-3 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col items-center justify-center gap-1.5 sm:gap-2 min-h-[60px] sm:min-h-[80px] hover-glow-pink cursor-pointer">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-health-success shrink-0" aria-hidden="true" />
                <span className="text-center text-[10px] sm:text-sm font-medium text-[#081129] leading-tight">{t('hero.resultsTime')}</span>
              </div>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
              <div className="rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl bg-white">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-success w-4 h-4 sm:w-5 sm:h-5" />
                    <input type="text" placeholder="Search from over 200 tests" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} className="w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-health-primary focus:outline-none text-[#081129]" />
                  </div>
                  <Button onClick={handleSearch} disabled={isAnalyzing} size="lg" className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white rounded-lg sm:rounded-xl transition-all duration-200 active:scale-95 min-h-[44px] bg-[#22c0d4] hover:bg-[#1aa8ba] hover:shadow-lg hover:scale-105 font-medium">
                    {isAnalyzing ? <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                        {t('hero.analyzing')}
                      </> : <>
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {t('hero.startSearch')}
                      </>}
                  </Button>
                </div>
                
                {/* AI Results */}
                {aiResults && <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">{t('hero.aiAnalysisResults')}</h3>
                    </div>
                    
                    <p className="text-[#081129] mb-4">{aiResults.analysis}</p>
                    
                    {aiResults.recommendedTests?.length > 0 && <div className="mb-4">
                        <h4 className="font-medium text-green-800 mb-2">{t('hero.testsWeOffer')}</h4>
                        <div className="space-y-2">
                          {aiResults.recommendedTests.map((test: any, index: number) => <div key={index} className="bg-white p-3 rounded border border-green-200">
                              <div className="font-medium text-green-700">{test.testName}</div>
                              <div className="text-sm text-gray-600">{test.reason}</div>
                              <div className="text-xs mt-1 text-white bg-[#22c0d4]">Category: {test.category}</div>
                            </div>)}
                        </div>
                      </div>}
                    
                    {aiResults.alternativeProviders?.length > 0 && <div className="mb-4">
                        <h4 className="font-medium text-orange-800 mb-2">{t('hero.testsNotAvailable')}</h4>
                        <div className="space-y-2">
                          {aiResults.alternativeProviders.map((alt: any, index: number) => <div key={index} className="bg-orange-50 p-3 rounded border border-orange-200">
                              <div className="font-medium text-orange-700">{alt.testName}</div>
                              <div className="text-sm text-gray-600">Suggested: {alt.suggestedProvider}</div>
                              <div className="text-xs text-red-600 mt-1 italic">{alt.disclaimer}</div>
                            </div>)}
                        </div>
                      </div>}
                    
                    <Button onClick={() => navigate('/compare-tests')} className="w-full mt-3 bg-health-primary hover:bg-health-primary/90">
                      {t('hero.compareAvailableTests')}
                    </Button>
                  </div>}
                
                {/* Popular Searches - Mobile optimized */}
                <div className="mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-[#081129] mb-2 font-semibold">{t('hero.popularSearches')}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                    {popularSearches.slice(0, 3).map((search, index) => <button key={index} onClick={() => navigate(search.route)} className="px-2.5 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-health-primary hover:text-white hover:scale-105 rounded-full transition-all duration-200 text-[#081129] active:scale-95 hover:shadow-md">
                        {search.name}
                      </button>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid - Mobile optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 max-w-4xl mx-auto">
              <div className="glass-card rounded-lg p-3 sm:p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover-glow-turquoise cursor-pointer">
                <span className="text-[#22c0d4] text-center text-xs sm:text-base font-bold block">{t('hero.trustedProviders')}</span>
              </div>
              <div className="glass-card rounded-lg p-3 sm:p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover-glow-pink cursor-pointer">
                <span className="text-center text-xs sm:text-base font-semibold text-[#e70d69] block">{t('hero.availableTests')}</span>
              </div>
              <div className="glass-card rounded-lg p-3 sm:p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover-glow-gradient cursor-pointer">
                <span className="text-center text-xs sm:text-base font-bold block gradient-brand-text">{t('hero.nationwideClinics')}</span>
              </div>
            </div>
          </div>
          </div>
        </section>
        
        {/* Accreditation Logos - Lazy loaded */}
        <div className="w-full relative z-10">
          <AccreditationLogos />
        </div>
      </div>
      
      {/* Our Partners Section */}
      <section className="w-full bg-gray-50 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-center text-[#081129] mb-4 sm:mb-6">
            {t('hero.ourPartners')}
          </h2>
          <Carousel opts={{
          align: "start",
          loop: true
        }} plugins={[Autoplay({
          delay: 3000
        }) as any]} className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {providers.map(provider => <CarouselItem key={provider.id} className="basis-full xs:basis-1/2 sm:basis-1/3 md:basis-1/4">
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center h-32 sm:h-40">
                    <img src={provider.logo} alt={`${provider.name} logo`} className="h-20 sm:h-28 md:h-32 w-auto object-contain mx-auto" loading="lazy" />
                  </div>
                </CarouselItem>)}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
      
      {/* Full-width Text Banner Divider */}
      <section className="w-full py-4 sm:py-6 md:py-8 bg-[#081129] relative overflow-hidden">
        {/* Gradient overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(187_72%_48%_/_0.1)] via-transparent to-[hsl(335_89%_48%_/_0.1)] pointer-events-none" />
        <div className="w-full px-3 sm:px-4 relative z-10">
          <ScrollFadeIn delay={200}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-center leading-tight font-heading font-bold text-white tracking-tight">
              Your <span className="text-[#22c0d4]">{t('hero.health')}</span> is your greatest <span className="text-[#e70d69]">{t('hero.asset')}</span>!
            </h2>
          </ScrollFadeIn>
        </div>
      </section>
    </>;
};
export default Hero;