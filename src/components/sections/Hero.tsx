import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Shield, FlaskConical, MapPin, Clock, Stethoscope } from "lucide-react";
import heroBgImage from "@/assets/hero-bg-tubes.jpeg";

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/compare?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background image - full cover */}
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
        {/* Pink wash overlay */}
        <div className="absolute inset-0 bg-[#f0b8cc]/65 z-[1]" />

        {/* Content */}
        <div className="relative z-10 pt-10 pb-6 sm:pt-14 sm:pb-8 md:pt-16 md:pb-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1240px] mx-auto">
              {/* Badge - small turquoise pill */}
              <div className="text-center mb-5 sm:mb-7">
                <span className="inline-flex items-center gap-1.5 bg-brand-turquoise rounded-full px-4 py-1.5 text-white text-xs sm:text-sm font-medium tracking-wide">
                  🇬🇧 UK's Leading Blood Test Comparison Platform
                </span>
              </div>

              {/* Headline - fixed two-line layout on desktop to match reference */}
              <h1 className="text-center font-heading tracking-[-0.03em] leading-[1.06] mb-2 text-[2rem] sm:text-[2.8rem] md:text-[3.5rem] lg:text-[4.1rem] xl:text-[4.5rem] 2xl:text-[4.8rem]">
                <span className="block text-brand-navy lg:whitespace-nowrap">Compare the UK's leading private</span>
                <span className="block text-brand-navy lg:whitespace-nowrap">
                  health test providers <span className="text-brand-navy font-bold">- </span>
                  <span className="text-brand-pink">All in one place!</span>
                </span>
              </h1>

              {/* Short gradient underline - turquoise to pink */}
              <div className="flex justify-center mt-3 mb-6 sm:mb-8">
                <span className="block w-16 sm:w-20 h-[3px] rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]" />
              </div>

              {/* Mission text - left aligned with turquoise left border */}
              <div className="max-w-[780px] mx-auto text-left mb-6 sm:mb-8 border-l-[4px] border-[hsl(var(--primary))] pl-5 sm:pl-6 space-y-4">
                <p className="text-[0.95rem] sm:text-base md:text-lg font-bold text-[hsl(var(--navy))] leading-relaxed">
                  At myhealth checkup, we believe everyone deserves access to transparent, trustworthy health
                  information.
                </p>
                <p className="text-[0.95rem] sm:text-base md:text-lg font-bold text-[hsl(var(--navy))] leading-relaxed">
                  Our mission is to empower you to take control of your health by making it simple to compare private
                  health tests from accredited UK providers.
                </p>
                <p className="text-[0.95rem] sm:text-base md:text-lg font-bold text-[hsl(var(--navy))] leading-relaxed">
                  We only feature providers that meet rigorous quality standards, including being fully regulated by the
                  Care Quality Commission (CQC) &amp; using only laboratories accredited by the United Kingdom
                  Accreditation Service (UKAS).
                </p>
              </div>

              {/* Three CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-7 sm:mb-9">
                <button
                  onClick={() => navigate("/compare")}
                  className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-white font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto"
                >
                  Compare Blood Tests
                </button>
                <button
                  onClick={() => navigate("/find-a-clinic")}
                  className="bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--primary))] text-white font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto"
                >
                  Find a Clinic
                </button>
                <button
                  onClick={() => navigate("/assisted-test-finder")}
                  className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-white font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto"
                >
                  Find the Right Test for You
                </button>
              </div>

              {/* Search card - large white panel */}
              <div className="max-w-[780px] mx-auto">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--primary))]/40 w-5 h-5 sm:w-6 sm:h-6" />
                    <input
                      type="text"
                      placeholder="Search from over 200 tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 sm:pl-14 pr-4 py-4 sm:py-5 text-base sm:text-lg border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] focus:outline-none text-[hsl(var(--navy))] bg-white placeholder:text-[hsl(var(--primary))]/50"
                    />
                    {isAnalyzing && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[hsl(var(--primary))]" />
                    )}
                  </div>

                  {/* Popular searches inset */}
                  <div className="mt-4 sm:mt-5 bg-gray-50 rounded-xl p-4 sm:p-5 text-center">
                    <p className="text-xs sm:text-sm font-bold text-[hsl(var(--navy))] mb-3 uppercase tracking-[0.15em]">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(search.route)}
                          className="px-4 sm:px-5 py-2 text-sm text-white bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] rounded-full transition-colors duration-300 font-medium"
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
        </div>
      </section>

      {/* Trust Signals Bar - white strip */}
      <section className="bg-white py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-7 gap-y-2 mb-1.5">
              {trustSignals.slice(0, 3).map((signal, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs sm:text-sm text-[hsl(var(--navy))]">
                  <signal.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--primary))] flex-shrink-0" />
                  <span className="font-semibold">{signal.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-7 gap-y-2">
              {trustSignals.slice(3).map((signal, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs sm:text-sm text-[hsl(var(--navy))]">
                  <signal.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--primary))] flex-shrink-0" />
                  <span className="font-semibold">{signal.text}</span>
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
