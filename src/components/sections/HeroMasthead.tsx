import { useState, useEffect, useCallback, useRef } from "react";

import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";
import TestCategoryTicker from "@/components/sections/TestCategoryTicker";
import BrowseByCategoryBar from "@/components/layout/BrowseByCategoryBar";

const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";

import {
  SLIDES,
  FIRST_SLIDE_LQIP,
  HERO_CAPTION,
} from "@/components/sections/hero-slides";

const Wordmark = () => (
  <span className="inline-flex items-center leading-[1.1] min-w-0 py-2 sm:py-3">
    <span className="font-bold tracking-[-0.02em] font-[Montserrat] whitespace-nowrap text-[clamp(2.25rem,12vw,4rem)] sm:text-[clamp(4.5rem,8vw,8rem)] lg:text-[7rem] xl:text-[8rem]">
      <span className="text-white">myhealth</span>
      <span className="text-brand-pink">checkup</span>
    </span>
  </span>
);

export default function HeroMasthead({
  rotateMs = 15000,
}: {
  rotateMs?: number;
}) {
  const [i, setI] = useState(0);
  const activeIndex = i % SLIDES.length;
  const firstSlideRef = useRef<HTMLImageElement>(null);
  const [firstLoaded, setFirstLoaded] = useState(false);
  useEffect(() => {
    // Cached images can finish before hydration attaches onLoad.
    if (firstSlideRef.current?.complete) setFirstLoaded(true);
  }, []);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  const advance = useCallback(() => setI((n) => n + 1), []);
  useEffect(() => {
    const ms = reducedMotion ? Math.max(1200, rotateMs) : rotateMs;
    const id = setTimeout(advance, ms);
    return () => clearTimeout(id);
  }, [activeIndex, advance, reducedMotion, rotateMs]);

  return (

    <section className="rounded-t-none rounded-b-none overflow-hidden bg-[#081129] border border-b-0 border-white/10 shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-3 sm:px-6 md:px-9 pt-0 pb-0 min-h-[68svh] sm:min-h-[100svh] flex flex-col">
      <TestCategoryTicker
        variant="inline"
        className="bg-white border-b border-brand-navy/10 -mx-3 sm:-mx-6 md:-mx-9"
      />

      {/* Wordmark + primary heading.
          On desktop the slogan sits directly below the wordmark and above the white category bar.
          On mobile the slogan sits below the white category bar. */}
      <div className="hidden md:flex flex-col items-start pt-4 sm:pt-6 lg:pt-8 order-2 sm:order-1">
        <div className="hidden sm:block">
          <Wordmark />
        </div>

        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1 sm:px-0 pt-0 pb-5 sm:pb-4">
          <h1
            className="hidden md:block font-bold font-[Montserrat] text-white text-left m-0
              text-[clamp(1.05rem,5vw,1.9rem)] sm:text-[clamp(1.3rem,3.4vw,2.65rem)]
              tracking-[0.05em] sm:tracking-[0.08em]
              leading-[1.25] sm:leading-[1.15]"
          >
            <span className="block sm:inline">
              <span className="text-white">Your </span>
              <span className="text-brand-turquoise">health.</span>
              <span className="text-white"> Your </span>
              <span className="text-brand-pink">choice.</span>
            </span>
          </h1>
          <p
            className="md:hidden text-center font-[Montserrat] font-semibold text-white
              text-[clamp(1.05rem,5vw,1.9rem)] sm:text-[clamp(1.3rem,3.4vw,2.65rem)]
              leading-tight px-4 m-0"
          >
            {HERO_CAPTION}
          </p>
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Category toolbar — white band with pink hairlines above and below.
          The bottom pink line is the single divider between the toolbar and the hero image. */}
      <div className="relative -mx-3 sm:-mx-6 md:-mx-9 mt-0 order-1 sm:order-2 flex items-center sm:bg-white sm:py-1 sm:border-t-2 sm:border-b-2 sm:border-[#e70d69]">
        <BrowseByCategoryBar compact placement="hero" />
      </div>

      <div className="relative overflow-hidden mt-5 sm:mt-0 -mx-3 sm:-mx-6 md:-mx-9 flex-1 min-h-[34svh] sm:min-h-0 bg-[#081129] order-3 pb-16 md:pb-0">

        {/* Blurred LQIP + gradient placeholder — fades out once slide 1 paints */}
        <div
          aria-hidden
          className={`absolute inset-0 scale-110 bg-cover bg-center blur-2xl transition-opacity duration-500 ${firstLoaded ? "opacity-0" : "opacity-100"}`}
          style={{ backgroundImage: `url("${FIRST_SLIDE_LQIP}")` }}
        />
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-b from-[#081129]/40 via-[#081129]/10 to-[#081129]/60 transition-opacity duration-500 ${firstLoaded ? "opacity-0" : "opacity-100"}`}
        />

        {SLIDES.map((s, n) => {
          const active = n === activeIndex;
          const commonStyle = {
            opacity: active ? 1 : 0,
            ["--pos-m" as string]: s.posMobile,
            ["--pos-t" as string]: s.posTablet,
            ["--pos-d" as string]: s.posDesktop,
          };
          return (
            <img
              key={`i-${n}`}
              ref={n === 0 ? firstSlideRef : undefined}
              src={s.src}
              alt={s.alt}
              aria-hidden={active ? undefined : true}
              width={1920}
              height={1080}
              sizes="100vw"
              loading={n === 0 ? "eager" : "lazy"}
              fetchPriority={n === 0 ? "high" : "low"}
              decoding="async"
              onLoad={n === 0 ? () => setFirstLoaded(true) : undefined}
              className="hero-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={commonStyle}
            />
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-b from-[#081129]/20 via-transparent to-[#081129]/30" />

        {/* Mobile: caption card overlapping the hero image bottom */}
        <div className="md:hidden absolute bottom-0 left-5 right-5 z-10 bg-[#081129] p-5 border-b-2 border-[#e70d69] shadow-[0_20px_50px_rgba(8,17,41,0.45)]">
          <p className="text-center font-[Montserrat] font-semibold text-white text-[13px] sm:text-[14px] leading-tight tracking-wide">
            {HERO_CAPTION}
          </p>
        </div>
      </div>
    </section>
  );
}
