import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Shield, FlaskConical, MapPin, Clock, Stethoscope } from "lucide-react";

import heroEmpowered from "@/assets/hero/hero-empowered-results.jpg";
import heroClinic from "@/assets/hero/hero-clinic-ease.jpg";
import heroHomeKit from "@/assets/hero/hero-home-kit.jpg";
import heroActive from "@/assets/hero/hero-active-lifestyle.jpg";
import heroCompare from "@/assets/hero/hero-compare-decide.jpg";

const heroSlides = [
  {
    image: heroEmpowered,
    headline: "Your Results. Your Control.",
    subline: "Review your health test results with confidence — anytime, anywhere.",
    objectPosition: "center 30%",
  },
  {
    image: heroClinic,
    headline: "200+ Clinics Nationwide",
    subline: "Choose a clinic, get tested, and take the guesswork out of your health.",
  },
  {
    image: heroHomeKit,
    headline: "Test From Home",
    subline: "Professional at-home finger-prick blood test kits delivered to your door.",
    objectPosition: "18% 25%",
  },
  {
    image: heroActive,
    headline: "Live With Confidence",
    subline: "Know your numbers. Stay ahead. Take control of your wellbeing.",
    objectPosition: "center 20%",
  },
  {
    image: heroCompare,
    headline: "Compare. Book. Test.",
    subline: "Side-by-side pricing from accredited UK providers — no hidden fees.",
    objectPosition: "center 25%",
  },
];

const popularSearches = [
  { name: "Full Blood Count", route: "/compare?search=full+blood+count" },
  { name: "Thyroid Function", route: "/compare?search=thyroid" },
  { name: "Vitamin D", route: "/compare?search=vitamin+d" },
  { name: "Liver Function", route: "/compare?search=liver" },
  { name: "Advanced Well Woman", route: "/compare?search=advanced+well+woman" },
  { name: "Advanced Well Man", route: "/compare?search=advanced+well+man" },
];

const trustSignals = [
  { icon: Shield, text: "UKAS-accredited labs" },
  { icon: FlaskConical, text: "200+ tests available" },
  { icon: MapPin, text: "200+ clinics nationwide" },
  { icon: Clock, text: "Results in 3–5 days" },
  { icon: Stethoscope, text: "No GP referral needed" },
];

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/compare?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const slide = heroSlides[currentSlide];

  return (
    <>
      <section className="relative overflow-hidden">
        {heroSlides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt=""
            aria-hidden="true"
            loading={i === 0 ? "eager" : "lazy"}
            width={1920}
            height={1080}
            fetchPriority={i === 0 ? "high" : undefined}
            style={{ objectPosition: s.objectPosition }}
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ease-in-out ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-[#081129]/55 z-[1]" />

        <div className="relative z-10 pt-10 pb-16 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1240px] mx-auto">
              <div className="text-center mb-3 sm:mb-5">
                <span className="inline-flex items-center gap-1.5 backdrop-blur-md rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-semibold tracking-wide border shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)] border-tertiary bg-primary">
                  🇬🇧 UK's Leading Blood Test Comparison Platform
                </span>
              </div>

              <div className="text-center mb-1 sm:mb-2 min-h-[90px] sm:min-h-[120px] md:min-h-[140px] flex flex-col items-center justify-center">
                <h1
                  key={currentSlide}
                  className="text-[2rem] sm:text-[3rem] md:text-[3.6rem] lg:text-[4rem] xl:text-[4.2rem] font-heading font-bold tracking-[-0.03em] leading-[1.08] text-white animate-fade-in"
                >
                  {slide.headline}
                </h1>
                <p
                  key={`sub-${currentSlide}`}
                  className="mt-2 sm:mt-3 text-sm sm:text-lg md:text-xl text-white/85 font-medium max-w-2xl mx-auto animate-fade-in"
                >
                  {slide.subline}
                </p>
              </div>

              <div className="flex justify-center mt-2 sm:mt-3 mb-4 sm:mb-6">
                <span className="block w-12 sm:w-20 h-[2px] sm:h-[3px] rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center items-center mb-4 sm:mb-6">
                <button
                  onClick={() => navigate("/assisted-test-finder")}
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-md font-semibold rounded-full px-6 sm:px-9 py-2.5 sm:py-3.5 text-sm sm:text-base transition-all duration-300 w-full sm:w-auto border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.08)] text-white border-white/20"
                >
                  Find your test
                </button>
                <button
                  onClick={() => navigate("/compare/symptoms")}
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-md font-semibold rounded-full px-6 sm:px-9 py-2.5 sm:py-3.5 text-sm sm:text-base transition-all duration-300 w-full sm:w-auto border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.08)] text-white border-white/20"
                >
                  Compare by symptom
                </button>
                <button
                  onClick={() => navigate("/compare/goals")}
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-md font-semibold rounded-full px-6 sm:px-9 py-2.5 sm:py-3.5 text-sm sm:text-base transition-all duration-300 w-full sm:w-auto border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.08)] text-white border-white/20"
                >
                  Compare by goal
                </button>
              </div>

              <div className="max-w-[855px] mx-auto">
                <div className="bg-white/8 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search from over 200 tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-lg sm:rounded-xl focus:ring-2 focus:ring-white/30 focus:outline-none bg-white/10 backdrop-blur-md border border-white/15 font-semibold text-white placeholder:text-white/50"
                    />
                    {isAnalyzing && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[hsl(var(--primary))]" />
                    )}
                  </div>

                  <div className="mt-3 sm:mt-4 bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/10">
                    <p className="text-[10px] sm:text-xs font-semibold text-white/60 mb-1.5 sm:mb-2 uppercase tracking-[0.15em]">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(search.route)}
                          className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm text-white/90 whitespace-nowrap"
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

      <section className="bg-white py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-nowrap justify-start sm:justify-center gap-x-5 sm:gap-x-7 lg:gap-x-9 overflow-x-auto scrollbar-hide pb-1">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base text-[hsl(var(--navy))] whitespace-nowrap">
                <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--primary))] flex-shrink-0" />
                <span className="font-semibold whitespace-nowrap">{signal.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
