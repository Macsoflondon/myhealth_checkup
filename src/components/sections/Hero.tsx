import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Shield, FlaskConical, MapPin, Clock, Stethoscope, ChevronLeft, ChevronRight } from "lucide-react";

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
  },
  {
    image: heroClinic,
    headline: "150+ Clinics Nationwide",
    subline: "Walk in, get tested, and take the guesswork out of your health.",
  },
  {
    image: heroHomeKit,
    headline: "Test From Home",
    subline: "Professional-grade at-home blood test kits delivered to your door.",
  },
  {
    image: heroActive,
    headline: "Live With Confidence",
    subline: "Know your numbers. Stay ahead. Take control of your wellbeing.",
  },
  {
    image: heroCompare,
    headline: "Compare. Decide. Act.",
    subline: "Side-by-side pricing from accredited UK providers — no hidden fees.",
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
  { icon: MapPin, text: "150+ clinics nationwide" },
  { icon: Clock, text: "Results in 3–5 days" },
  { icon: Stethoscope, text: "No GP referral needed" },
];

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/compare?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const slide = heroSlides[currentSlide];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background images with crossfade */}
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
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ease-in-out ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#081129]/55 z-[1]" />




              {/* Three CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-7 sm:mb-9">
                <button
                  onClick={() => navigate("/assisted-test-finder")}
                  className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-white font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto"
                >
                  Find your test
                </button>
                <button
                  onClick={() => navigate("/compare?view=symptoms")}
                  className="bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--primary))] text-white font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto"
                >
                  Compare by symptom
                </button>
                <button
                  onClick={() => navigate("/compare?view=goals")}
                  className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-white font-semibold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base transition-colors duration-300 w-full sm:w-auto"
                >
                  Compare by goal
                </button>
              </div>

              {/* Search card */}
              <div className="max-w-[780px] mx-auto">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-primary border-2 shadow-xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--primary))]/40 w-5 h-5 sm:w-6 sm:h-6 font-bold" />
                    <input
                      type="text"
                      placeholder="Search from over 200 tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 sm:pl-14 pr-4 py-4 sm:py-5 text-base sm:text-lg rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] focus:outline-none text-[hsl(var(--navy))] bg-white placeholder:text-[hsl(var(--primary))]/50 border-2 border-primary font-semibold"
                    />
                    {isAnalyzing && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[hsl(var(--primary))]" />
                    )}
                  </div>

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

      {/* Trust Signals Bar */}
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
