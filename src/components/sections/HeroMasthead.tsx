import { useState, useEffect, useCallback, useRef } from "react";

import TestCategoryTicker from "@/components/sections/TestCategoryTicker";
import BrowseByCategoryBar from "@/components/layout/BrowseByCategoryBar";


import {
  SLIDES,
  FIRST_SLIDE_LQIP,
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
    <section className="rounded-t-none rounded-b-none overflow-visible bg-[#081129] md:bg-white border-0 sm:border sm:border-b-0 sm:border-white/10 md:border-0 shadow-[0_30px_80px_rgba(8,17,41,0.10)] md:shadow-none px-3 sm:px-6 md:px-0 pt-0 pb-0 min-h-[68svh] sm:min-h-[100svh] flex flex-col">
      <TestCategoryTicker
        variant="inline"
        className="bg-white border-b-2 border-[#22c0d4] -mx-3 sm:-mx-6 md:mx-0"
      />

      {/* Brand bar + category toolbar. The brand bar renders at every width;
          the pill toolbar is desktop/tablet only (mobile uses the drawer).
          No border here — the pink brand-bar line plus the stage's own inner
          turquoise divider form the top edge, mirroring the bottom divider. */}
      <div className="relative -mx-3 sm:-mx-6 md:mx-0 mt-0 order-1 flex flex-wrap items-center bg-white pb-0 md:pb-1 lg:bg-transparent lg:pb-0">
        <BrowseByCategoryBar compact placement="hero" />
      </div>

      {/* White breathing space between the pink brand-bar line and the photo */}
      <div aria-hidden className="order-2 -mx-3 sm:-mx-6 md:mx-0 h-4 sm:h-5 bg-white" />

      <div className="relative overflow-hidden mt-0 -mx-3 sm:-mx-6 md:mx-0 flex-1 min-h-[34svh] sm:min-h-0 bg-[#081129] order-3 pb-16 md:pb-20 md:rounded-2xl md:border md:border-[rgba(34,192,212,0.35)] md:shadow-[0_0_0_1px_rgba(34,192,212,0.20),0_8px_28px_rgba(34,192,212,0.18)]">
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
              className={`hero-slide absolute inset-0 h-full w-full ${s.fit === "contain" ? "object-contain" : "object-cover"}`}
            />
          );

          return (
            <div
              key={`slide-${n}`}
              aria-hidden={active ? undefined : true}
              className="absolute inset-0 transition-opacity duration-500"
              style={commonStyle}
            >
              <picture>
                {s.mobileAvifSrcSet ? (
                  <source media="(max-width: 639px)" type="image/avif" srcSet={s.mobileAvifSrcSet} sizes="100vw" />
                ) : null}
                {s.mobileWebpSrcSet ? (
                  <source media="(max-width: 639px)" type="image/webp" srcSet={s.mobileWebpSrcSet} sizes="100vw" />
                ) : null}
                <source type="image/avif" srcSet={s.avifSrcSet} sizes="100vw" />
                <source type="image/webp" srcSet={s.webpSrcSet} sizes="100vw" />
                {img}
              </picture>

              {s.headline ? (
                <div
                  className={`absolute inset-0 z-10 flex items-start px-5 pt-8 sm:items-center sm:px-10 sm:pt-0 md:px-16 lg:px-20 ${
                    s.align === "right"
                      ? "justify-end bg-gradient-to-l from-brand-navy/90 via-brand-navy/55 to-transparent text-right"
                      : "bg-gradient-to-r from-brand-navy/90 via-brand-navy/55 to-transparent"
                  }`}
                >
                  <div className="@container w-[82%] max-w-4xl text-primary-foreground sm:w-[58%] md:w-[88%] lg:w-[62%]">
                    {s.eyebrow ? (
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-turquoise sm:text-sm">
                        {s.eyebrow}
                      </p>
                    ) : null}
                    {n === 0 ? (
                      <h1 className="font-display text-[clamp(1.5rem,8cqw,3.75rem)] font-extrabold leading-[1.12]">
                        {s.headlineLines
                          ? s.headlineLines.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))
                          : s.headline}
                      </h1>
                    ) : (
                      <h2 className="font-display text-[clamp(1.5rem,8cqw,3.75rem)] font-extrabold leading-[1.12]">
                        {s.headlineLines
                          ? s.headlineLines.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))
                          : s.headline}
                      </h2>
                    )}
                    {s.supportingCopy ? (
                      <p
                        className={`mt-4 max-w-2xl text-[clamp(0.875rem,3.4cqw,1.25rem)] font-medium leading-relaxed text-primary-foreground/90 ${
                          s.align === "right" ? "ml-auto" : ""
                        }`}
                      >
                        {s.supportingCopy}
                      </p>
                    ) : null}
                    <div
                      aria-hidden
                      className={`mt-5 flex h-1 w-28 overflow-hidden rounded-full sm:w-36 ${
                        s.align === "right" ? "ml-auto" : ""
                      }`}
                    >
                      <span className="w-2/3 bg-brand-turquoise" />
                      <span className="w-1/3 bg-brand-pink" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-b from-[#081129]/20 via-transparent to-[#081129]/30" />

        {/* Turquoise section dividers — inside the rounded stage so they stop at the curve */}
        <div className="absolute top-0 inset-x-0 w-full max-w-none z-10 border-t-2 border-[#22c0d4]" />
        <div className="absolute bottom-0 inset-x-0 w-full max-w-none z-10 border-t-2 border-[#22c0d4]" />

      </div>
    </section>
  );
}
