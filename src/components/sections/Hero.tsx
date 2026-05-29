import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import TrustSignalsBar from "@/components/common/TrustSignalsBar";

import heroHomeKit from "@/assets/hero/hero-home-kit.webp";
import heroActive from "@/assets/hero/hero-active-lifestyle.webp";
import heroMobileKitOpen from "@/assets/hero/mobile/hero-mobile-kit-open.png";
import heroMobileActive from "@/assets/hero/mobile/hero-mobile-active.jpeg";

type SlideTheme = {
  /** Tailwind classes for the absolute scrim overlay */
  overlay: string;
  /** Navy surface alpha (0-100) for badge / CTA / search backgrounds */
  surface: number;
  /** Brand accent used for borders on this slide */
  accent: "turquoise" | "pink";
};

const ACCENT_HEX: Record<SlideTheme["accent"], string> = {
  turquoise: "#22c0d4",
  pink: "#e70d69",
};

const heroSlides: Array<{
  image: string;
  mobileImage?: string;
  headline: string;
  subline: string;
  objectPosition: string;
  mobileObjectPosition?: string;
  /** Optional CSS transform (mobile only) — e.g. "scale(1.15)" to tighten the crop */
  mobileScale?: string;
  theme: SlideTheme;
}> = [
  {
    image: heroHomeKit,
    mobileImage: heroMobileKitOpen,
    headline: "Test From Home",
    subline: "Professional at-home finger-prick blood test kits delivered to your door.",
    objectPosition: "center 50%",
    mobileObjectPosition: "35% 30%",
    mobileScale: "scale(1.1)",
    theme: {
      overlay: "bg-gradient-to-b from-[#081129]/15 via-transparent to-[#081129]/20",
      surface: 70,
      accent: "turquoise",
    },
  },
  {
    image: heroActive,
    mobileImage: heroMobileActive,
    headline: "Know Your Numbers. Own Your Health.",
    subline: "Know your numbers. Stay ahead. Take control of your wellbeing.",
    objectPosition: "center 18%",
    mobileObjectPosition: "center 22%",
    mobileScale: "scale(1.15)",
    theme: {
      overlay: "bg-gradient-to-b from-[#081129]/10 via-transparent to-[#081129]/20",
      surface: 65,
      accent: "turquoise",
    },
  },
];

// Tiny blurred LQIPs (32px WebP, ~150B) for the first slide — render instantly so users
// never see a navy "black screen" while the full hero image streams in.
const LQIP_DESKTOP = "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADwBACdASogABIAPt1WpE2opKOiN/qoARAbiWUAs4AYv7MlNIQ/1eawUMfG66JUE+gA/oVLXJz6RR5bj3eso6dG03s3A+CfuMICh9a1oxoeVCOYa2rytgDftKG2CZ8TBmOxz+CZNRP6R7BUNygAAA==";
const LQIP_MOBILE = "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAACwBQCdASogACAAPu1srlCppiQiqAqpMB2JYwC/WW2rQUZttiClW/8mD0nZ1fH5MRIxjzu7gAAA/vFUJTqM0A/JVYXFVGBF1UD2Ntya24HXaVS/iGfmszfkjsS9WyXn5PjeZ710jyoZRIZnAlaV+AygYPWpbO9xKKgdNBt1J53KpKoHvo8mBExdfPtH5ETUAAA=";

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0]));

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % heroSlides.length;
      setLoadedSlides((seen) => new Set([...seen, next]));
      return next;
    });
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
  const accentColor = ACCENT_HEX[slide.theme.accent];
  const surfaceTransition = "background-color 1200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 1200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1200ms ease";
  const surfaceStyle: React.CSSProperties = {
    backgroundColor: `rgba(255, 255, 255, 0.08)`,
    borderColor: `${accentColor}99`,
    transition: surfaceTransition,
  };
  const chipStyle: React.CSSProperties = {
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
    borderColor: `${accentColor}80`,
    transition: surfaceTransition,
  };
  return (
    <>
      <section
        className="relative overflow-hidden max-w-[100vw] min-h-[500px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[780px] flex flex-col bg-[hsl(var(--brand-navy))]"
        style={{
          backgroundImage: `url("${isMobile ? LQIP_MOBILE : LQIP_DESKTOP}")`,
          backgroundSize: "cover",
          backgroundPosition: isMobile ? "60% 35%" : "center 38%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {heroSlides.map((s, i) =>
          loadedSlides.has(i) ? (
            <img
              key={i}
              src={isMobile && s.mobileImage ? s.mobileImage : s.image}
              alt=""
              aria-hidden="true"
              loading={i === 0 ? "eager" : "lazy"}
              decoding={i === 0 ? "sync" : "async"}
              width={1920}
              height={1080}
              fetchPriority={i === 0 ? "high" : "low"}
              style={{
                objectPosition: isMobile && s.mobileObjectPosition ? s.mobileObjectPosition : s.objectPosition,
                transform: isMobile && s.mobileScale ? s.mobileScale : undefined,
                transformOrigin: "center center",
              }}
              className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-[1600ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null
        )}

        <div className={`absolute inset-0 z-[1] transition-[background] duration-[1600ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${slide.theme.overlay}`} />

        <div className="relative z-10 flex flex-col flex-1 pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-6 sm:pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex flex-col flex-1">
            <div className="max-w-[1240px] mx-auto flex flex-col flex-1 w-full">

              <div className="mt-auto mb-40 sm:mb-44 w-full">
                <div className="text-center mb-3 sm:mb-4">
                  <span style={surfaceStyle} className="inline-flex items-center gap-1.5 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase border-2 border-solid rounded-sm shadow-md">
                    🇬🇧 UK's Leading Blood Test Comparison Platform
                  </span>
                </div>

                <div className="text-center mb-1 sm:mb-2 flex-col flex items-center justify-center">
                  <h1
                    key={currentSlide}
                    className="text-[2rem] sm:text-[3rem] md:text-[3.6rem] xl:text-[4.2rem] tracking-[-0.03em] leading-[1.05] text-white animate-fade-in font-bold font-sans lg:text-6xl drop-shadow-[0_2px_12px_rgba(8,17,41,0.85)]"
                  >
                    {slide.headline}
                  </h1>
                  <p
                    key={`sub-${currentSlide}`}
                    className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto animate-fade-in font-medium drop-shadow-[0_2px_8px_rgba(8,17,41,0.85)]"
                  >
                    ​
                  </p>
                </div>

                <div className="flex justify-center mt-2 sm:mt-3 mb-3 sm:mb-4">
                  <span className="block w-12 sm:w-20 h-[2px] sm:h-[3px] rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]" />
                </div>

                
                <div className="max-w-[855px] mx-auto w-full">
                  <div style={surfaceStyle} className="backdrop-blur-md sm:rounded-2xl p-2.5 sm:p-4 border-2 border-solid rounded-sm shadow-md">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        placeholder="COMPARE OVER 200 TESTS"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={chipStyle}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 text-sm sm:rounded-xl focus:ring-2 focus:ring-white/30 focus:outline-none backdrop-blur-md border-2 text-white placeholder:text-white/70 border-solid rounded-sm shadow-sm sm:text-lg font-extrabold"
                      />
                      {isAnalyzing && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[hsl(var(--primary))]" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-nowrap gap-1 sm:gap-2.5 md:gap-3 justify-center items-center mt-3 sm:mt-4 w-full max-w-full">
                  <button
                    onClick={() => navigate("/assisted-test-finder")}
                    style={surfaceStyle}
                    className="backdrop-blur-md font-semibold px-3 sm:px-4 md:px-6 py-3 sm:py-2.5 md:py-3 min-h-[44px] sm:min-h-0 text-[11px] sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-tight transition-all duration-300 border-2 text-white whitespace-nowrap border-solid rounded-sm shadow-md hover:brightness-125 min-w-0 flex-shrink"
                  >
                    Find your test
                  </button>
                  <button
                    onClick={() => navigate("/compare/symptoms")}
                    style={surfaceStyle}
                    className="backdrop-blur-md font-semibold px-3 sm:px-4 md:px-6 py-3 sm:py-2.5 md:py-3 min-h-[44px] sm:min-h-0 text-[11px] sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-tight transition-all duration-300 border-2 text-white whitespace-nowrap border-solid rounded-sm shadow-md hover:brightness-125 min-w-0 flex-shrink"
                  >
                    Compare by symptom
                  </button>
                  <button
                    onClick={() => navigate("/compare/goals")}
                    style={surfaceStyle}
                    className="backdrop-blur-md font-semibold px-3 sm:px-4 md:px-6 py-3 sm:py-2.5 md:py-3 min-h-[44px] sm:min-h-0 text-[11px] sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-tight transition-all duration-300 border-2 text-white whitespace-nowrap border-solid rounded-sm shadow-md hover:brightness-125 min-w-0 flex-shrink"
                  >
                    Compare by goal
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <TrustSignalsBar />
    </>
  );
};

export default Hero;
