import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Loader2, Shield, FlaskConical, MapPin, Clock, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBgImage from "@/assets/hero-bg-blood-tubes.jpg";

const popularSearches = [
  { name: "Full Blood Count", route: "/compare?search=full+blood+count" },
  { name: "Thyroid Function", route: "/compare?search=thyroid" },
  { name: "Vitamin D", route: "/compare?search=vitamin+d" },
  { name: "Liver Function", route: "/compare?search=liver" },
];

const trustSignals = [
  { icon: Shield, text: "UKAS-accredited labs" },
  { icon: FlaskConical, text: "200+ tests available" },
  { icon: MapPin, text: "150+ clinics nationwide" },
  { icon: Clock, text: "Results in 3–5 days" },
  { icon: Stethoscope, text: "No GP referral needed" },
];

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/compare?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      {/* Main Hero Content - Clear promise, immediate action */}
      <section className="relative overflow-hidden py-6 sm:py-10 md:py-14 lg:py-20">
        {/* Background image */}
        <img
          src={heroBgImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* White overlay for readability */}
        <div className="absolute inset-0 bg-white/[0.65] z-[1]" />
        <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,192,212,0.12)", border: "1px solid rgba(34,192,212,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ color: COLORS.accent, fontSize: 13, fontWeight: 600 }}>🇬🇧 UK's Leading Blood Test Comparison Platform</span>
          </div>
            {/* Headline - Clear promise in plain language */}
            <h1 className="max-w-[400px] sm:max-w-3xl lg:max-w-5xl mx-auto text-[1.6rem] xs:text-[2rem] sm:text-[2.25rem] md:text-[3.3rem] lg:text-[3.75rem] xl:text-[4.1rem] font-heading font-bold leading-snug sm:leading-snug mb-3 sm:mb-4 md:mb-6">
              <span className="block text-brand-navy">Compare the UK's leading private health test providers</span>
              <span className="block text-brand-pink">All in one place!</span>
            </h1>

            {/* Primary & Secondary CTAs - Immediate action path */}
            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center mb-6 sm:mb-8 md:mb-10">
              <Button
                size="default"
                onClick={() => navigate("/compare")}
                className="bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold rounded-xl shadow-md px-3 sm:px-6 md:px-8 text-xs sm:text-base h-10 sm:h-11 md:h-12 transition-colors duration-300"
              >
                Compare blood tests
              </Button>
              <Button
                size="default"
                onClick={() => navigate("/assisted-test-finder")}
                className="bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold rounded-xl shadow-md px-3 sm:px-6 md:px-8 text-xs sm:text-base h-10 sm:h-11 md:h-12 transition-colors duration-300"
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                      onClick={() => navigate("/compare")}
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
                <div key={index} className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base text-brand-navy">
                  <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-turquoise flex-shrink-0" />
                  <span className="font-sans font-semibold">{signal.text}</span>
                </div>
              ))}
            </div>
            {/* Row 2: 2 items centred */}
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3">
              {trustSignals.slice(3).map((signal, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base text-brand-navy">
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
