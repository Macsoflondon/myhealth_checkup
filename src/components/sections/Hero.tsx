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
    objectPosition: "30% 35%",
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

        <div className="relative z-10 pt-10 pb-8 sm:pt-14 sm:pb-10 md:pt-16 md:pb-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1240px] mx-auto">
              <div className="text-center mb-5 sm:mb-7">
                <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 sm:px-6 py-2 text-white text-sm sm:text-base font-semibold tracking-wide border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)]">
                  🇬🇧 UK's Leading Blood Test Comparison Platform
                </span>
              </div>

              <div className="text-center mb-2 min-h-[120px] sm:min-h-[140px] flex flex-col items-center justify-center">
                <h1
                  key={currentSlide}
                  className="text-[1.8rem] sm:text-[2.4rem] md:text-[3rem] lg:text-[3.3rem] xl:text-[3.5rem] font-heading font-bold tracking-[-0.03em] leading-[1.06] text-white animate-fade-in"
                >
                  {slide.headline}
                </h1>
                <p
                  key={`sub-${currentSlide}`}
                  className="mt-3 text-base sm:text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto animate-fade-in"
                >
                  {slide.subline}
                </p>
              </div>

              <div className="flex justify-center mt-3 mb-6 sm:mb-8">
                <span className="block w-16 sm:w-20 h-[3px] rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-5 sm:mb-6">
                <button
                  onClick={() => navigate("/assisted-test-finder")}
                  className="bg-white/15 hover:bg-white/30 backdrop-blur-md font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-all duration-300 w-full sm:w-auto border shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)] text-tertiary border-tertiary"
                >
                  Find your test
                </button>
                <button
                  onClick={() => navigate("/compare/symptoms")}
                  className="bg-white/15 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-all duration-300 w-full sm:w-auto border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)]"
                >
                  Compare by symptom
                </button>
                <button
                  onClick={() => navigate("/compare/goals")}
                  className="bg-white/15 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-all duration-300 w-full sm:w-auto border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)]"
                >
                  Compare by goal
                </button>
              </div>

              <div className="max-w-[1140px] mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.1)]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5 sm:w-6 sm:h-6 font-bold" />
                    <input
                      type="text"
                      placeholder="Search from over 200 tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-white/40 focus:outline-none bg-white/15 backdrop-blur-md border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] font-extrabold text-tertiary border-tertiary"
                    />
                    {isAnalyzing && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[hsl(var(--primary))]" />
                    )}
                  </div>

                  <div className="mt-4 sm:mt-5 bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 text-center border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.1)] border-tertiary">
                    <p className="text-xs sm:text-sm font-bold text-black mb-3 uppercase tracking-[0.15em]">
                      Popular Searches
                    </p>
                    <div className="flex flex-nowrap gap-2 sm:gap-3 justify-center overflow-x-auto">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(search.route)}
                          className="px-3 sm:px-4 py-1.5 bg-white/15 hover:bg-white/30 backdrop-blur-md border border-black/70 rounded-full transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)] font-extrabold text-sm sm:text-base text-tertiary whitespace-nowrap"
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
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-7 gap-y-2 mb-1.5">
              {trustSignals.slice(0, 3).map((signal, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm sm:text-base text-[hsl(var(--navy))]">
                  <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--primary))] flex-shrink-0" />
                  <span className="font-semibold">{signal.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-7 gap-y-2">
              {trustSignals.slice(3).map((signal, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm sm:text-base text-[hsl(var(--navy))]">
                  <signal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--primary))] flex-shrink-0" />
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
