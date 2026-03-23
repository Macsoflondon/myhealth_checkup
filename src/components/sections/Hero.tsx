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
      {/* Main Hero Content */}
      <section className="relative overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20">
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
        {/* Pink overlay */}
        <div className="absolute inset-0 bg-[#f8c8d8]/60 z-[1]" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto text-center">

            {/* Badge */}
            <div className="mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-2 bg-[hsl(var(--brand-turquoise))] rounded-full px-5 sm:px-6 py-2 text-white text-xs sm:text-sm font-semibold shadow-sm">
                🇬🇧 UK's Leading Blood Test Comparison Platform
              </span>
            </div>

            {/* Headline - matching reference: inline flow with hyphen */}
            <h1 className="mx-auto text-center font-heading font-bold tracking-tight leading-[1.15] sm:leading-[1.12] mb-3 sm:mb-4 text-[1.6rem] sm:text-[2.25rem] md:text-[3rem] lg:text-[3.75rem] xl:text-[4.25rem]">
              <span className="text-[hsl(var(--navy))]">Compare the UK's leading private{" "}</span>
              <br className="hidden sm:block" />
              <span className="text-[hsl(var(--navy))]">health test providers</span>
              <span className="text-[hsl(var(--navy))]"> - </span>
              <span className="text-[hsl(var(--brand-pink))]">All in one place!</span>
            </h1>

            {/* Turquoise underline */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <span className="block w-20 sm:w-24 h-[3px] bg-[hsl(var(--brand-turquoise))] rounded-full" />
            </div>

            {/* Mission text block - all paragraphs with turquoise left border */}
            <div className="max-w-3xl mx-auto text-left mb-6 sm:mb-8 md:mb-10 border-l-4 border-[hsl(var(--brand-turquoise))] pl-4 sm:pl-6 space-y-4">
              <p className="text-sm sm:text-base md:text-lg font-bold text-[hsl(var(--navy))] leading-relaxed">
                At myhealth checkup, we believe everyone deserves access to transparent, trustworthy health information.
              </p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-[hsl(var(--navy))] leading-relaxed">
                Our mission is to empower you to take control of your health by making it simple to compare private health tests from accredited UK providers.
              </p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-[hsl(var(--navy))] leading-relaxed">
                We only feature providers that meet rigorous quality standards, including being fully regulated by the Care Quality Commission (CQC) &amp; using only laboratories accredited by the United Kingdom Accreditation Service (UKAS).
              </p>
            </div>

            {/* Three CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-10 md:mb-12">
              <Button
                size="lg"
                onClick={() => navigate("/compare")}
                className="bg-[hsl(var(--brand-turquoise))] hover:bg-[hsl(var(--brand-pink))] text-white font-semibold rounded-full shadow-md px-6 sm:px-8 md:px-10 text-sm sm:text-base h-12 sm:h-14 transition-colors duration-300 w-full sm:w-auto"
              >
                Compare Blood Tests
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/find-a-clinic")}
                className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-turquoise))] text-white font-semibold rounded-full shadow-md px-6 sm:px-8 md:px-10 text-sm sm:text-base h-12 sm:h-14 transition-colors duration-300 w-full sm:w-auto"
              >
                Find a Clinic
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/assisted-test-finder")}
                className="bg-[hsl(var(--brand-turquoise))] hover:bg-[hsl(var(--brand-pink))] text-white font-semibold rounded-full shadow-md px-6 sm:px-8 md:px-10 text-sm sm:text-base h-12 sm:h-14 transition-colors duration-300 w-full sm:w-auto"
              >
                Find the Right Test for You
              </Button>
            </div>

            {/* Search Card - clean white, no heavy border */}
            <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-lg">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-5 h-5 sm:w-6 sm:h-6" />
                  <input
                    type="text"
                    placeholder="Search from over 200 tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-4 sm:py-5 text-base sm:text-lg border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[hsl(var(--brand-turquoise))] focus:border-[hsl(var(--brand-turquoise))] focus:outline-none text-[hsl(var(--navy))] bg-white placeholder:text-[hsl(var(--brand-turquoise))]/60"
                  />
                  {isAnalyzing && (
                    <Loader2 className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 animate-spin text-[hsl(var(--brand-turquoise))]" />
                  )}
                </div>

                {/* AI Results */}
                {aiResults && (
                  <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
                    <p className="text-foreground mb-3">{aiResults.analysis}</p>
                    {aiResults.recommendedTests?.length > 0 && (
                      <div className="space-y-2">
                        {aiResults.recommendedTests.map((test: any, index: number) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-border">
                            <div className="font-medium text-foreground">{test.testName}</div>
                            <div className="text-sm text-muted-foreground">{test.reason}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      onClick={() => navigate("/compare")}
                      className="w-full mt-3 bg-[hsl(var(--brand-turquoise))] hover:bg-[hsl(var(--brand-pink))] text-white transition-colors duration-300"
                    >
                      View available tests
                    </Button>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="mt-5 sm:mt-6 text-center bg-gray-50 rounded-xl p-4 sm:p-5">
                  <p className="text-xs sm:text-sm font-bold text-[hsl(var(--navy))] mb-3 sm:mb-4 uppercase tracking-[0.15em]">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(search.route)}
                        className="px-5 sm:px-6 py-2.5 text-sm sm:text-base text-white bg-[hsl(var(--brand-turquoise))] hover:bg-[hsl(var(--brand-pink))] rounded-full transition-colors duration-300 font-medium"
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

      {/* Trust Signals Bar */}
      <section className="bg-white py-4 sm:py-5 md:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 mb-3">
              {trustSignals.slice(0, 3).map((signal, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base text-[hsl(var(--navy))]">
                  <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--brand-turquoise))] flex-shrink-0" />
                  <span className="font-sans font-semibold">{signal.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3">
              {trustSignals.slice(3).map((signal, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base text-[hsl(var(--navy))]">
                  <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--brand-turquoise))] flex-shrink-0" />
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