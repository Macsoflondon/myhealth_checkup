import { useState, useEffect, useCallback, useRef } from "react";

import TestCategoryTicker from "@/components/sections/TestCategoryTicker";
import BrowseByCategoryBar from "@/components/layout/BrowseByCategoryBar";


import {
  SLIDES,
  FIRST_SLIDE_LQIP,
  HERO_CAPTION,
} from "@/components/sections/hero-slides";

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

  // Defer mounting the non-LCP slides until the browser is idle after first paint.
  const [deferredMounted, setDeferredMounted] = useState(false);
  useEffect(() => {
    const schedule =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(cb as unknown as TimerHandler, 1200));
    const id = schedule(() => setDeferredMounted(true), { timeout: 3000 });
    return () => {
      if (window.cancelIdleCallback && typeof id === "number") {
        window.cancelIdleCallback(id);
      }
    };
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
    <section className="rounded-t-none rounded-b-none overflow-hidden bg-[#081129] border-0 sm:border sm:border-b-0 sm:border-white/10 shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-3 sm:px-6 md:px-9 pt-0 pb-0 min-h-[68svh] sm:min-h-[100svh] flex flex-col">
      <TestCategoryTicker
        variant="inline"
        className="bg-white border-b border-brand-navy/10 -mx-3 sm:-mx-6 md:-mx-9"
      />

      {/* Brand bar + category toolbar. The brand bar renders at every width;
          the pill toolbar is desktop/tablet only (mobile uses the drawer). */}
      <h1 className="sr-only">Compare private blood tests &amp; health checks</h1>
      <div className="relative -mx-3 sm:-mx-6 md:-mx-9 mt-0 order-1 flex flex-wrap items-center bg-white pb-0 md:pb-1 border-b-2 border-[#e70d69]">
        <BrowseByCategoryBar compact placement="hero" />
      </div>


      <div className="relative overflow-hidden mt-0 -mx-3 sm:-mx-6 md:-mx-9 flex-1 min-h-[34svh] sm:min-h-0 bg-[#081129] order-3 pb-16 md:pb-20">
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
          // Slides 2..n only mount once the browser is idle after first paint,
          // so they never compete with the LCP image for bandwidth.
          if (n > 0 && !deferredMounted) return null;

          const active = n === activeIndex;
          const commonStyle = {
            opacity: active ? 1 : 0,
            ["--pos-m" as string]: s.posMobile,
            ["--pos-t" as string]: s.posTablet,
            ["--pos-d" as string]: s.posDesktop,
          };
          const img = (
            <img
              key={`i-${n}`}
              ref={n === 0 ? firstSlideRef : undefined}
              src={s.src}
              srcSet={s.webpSrcSet}
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

          return (
            <picture key={`p-${n}`}>
              <source type="image/avif" srcSet={s.avifSrcSet} sizes="100vw" />
              <source type="image/webp" srcSet={s.webpSrcSet} sizes="100vw" />
              {img}
            </picture>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-b from-[#081129]/20 via-transparent to-[#081129]/30" />

        {/* Caption band pinned to the hero image bottom at every width */}
        <div className="absolute bottom-0 inset-x-0 w-full max-w-none z-10 bg-[#081129] p-5 md:p-6 border-y-2 border-[#e70d69] shadow-[0_20px_50px_rgba(8,17,41,0.45)]">
          <p className="text-center font-[Montserrat] font-semibold text-white text-[13px] sm:text-[14px] md:text-[17px] lg:text-[19px] leading-tight tracking-wide">
            {HERO_CAPTION}
          </p>
        </div>

      </div>
    </section>
  );
}
