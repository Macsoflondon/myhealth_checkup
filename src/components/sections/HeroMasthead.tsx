import { useState, useEffect, useRef } from "react";

import TestCategoryTicker from "@/components/sections/TestCategoryTicker";
import BrowseByCategoryBar from "@/components/layout/BrowseByCategoryBar";

import {
  HERO_COPY,
  HERO_POSTER_SRC,
  HERO_POSTER_WEBP_SRCSET,
  FIRST_SLIDE_LQIP,
} from "@/components/sections/hero-slides";
import heroVideoMp4 from "@/assets/hero/hero-video.mp4.asset.json";
import heroVideoWebm from "@/assets/hero/hero-video.webm.asset.json";

/** The ad runs at half speed so the loop feels calm behind the copy. */
const HERO_PLAYBACK_RATE = 0.5;

export default function HeroMasthead() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterLoaded, setPosterLoaded] = useState(false);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = HERO_PLAYBACK_RATE;
    if (reducedMotion) {
      video.pause();
      return;
    }
    // Keep the loop running no matter what: browsers can pause background
    // video on scroll, tab visibility changes or power saving, so any pause
    // that we did not ask for is immediately reversed.
    const resume = () => {
      void video.play().catch(() => undefined);
    };
    const onPause = () => {
      if (!video.ended) resume();
    };
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", resume);
    resume();
    return () => {
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [reducedMotion]);

  const mobilePlacement =
    HERO_COPY.copyPlacementMobile === "bottom"
      ? "items-end pb-20 bg-gradient-to-t from-brand-navy/95 via-brand-navy/55 to-transparent"
      : "items-start pt-16 bg-gradient-to-b from-brand-navy/90 via-brand-navy/45 to-transparent";
  const desktopGradient =
    HERO_COPY.align === "right"
      ? "sm:bg-gradient-to-l sm:from-brand-navy/90 sm:via-brand-navy/50 sm:to-transparent"
      : "sm:bg-gradient-to-r sm:from-brand-navy/90 sm:via-brand-navy/50 sm:to-transparent";

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

      {/* White breathing space between the pink brand-bar line and the video */}
      <div
        aria-hidden
        className="order-2 -mx-3 sm:-mx-6 md:mx-0 h-4 sm:h-5 bg-white"
      />

      <div className="relative overflow-hidden mt-0 -mx-3 sm:-mx-6 md:mx-0 flex-1 min-h-[34svh] sm:min-h-0 bg-[#081129] order-3 pb-16 md:pb-20 md:rounded-2xl md:border md:border-[rgba(34,192,212,0.35)] md:shadow-[0_0_0_1px_rgba(34,192,212,0.20),0_8px_28px_rgba(34,192,212,0.18)]">
        {/* Blurred LQIP + gradient placeholder — fades out once the poster paints */}
        <div
          aria-hidden
          className={`absolute inset-0 scale-110 bg-cover bg-center blur-2xl transition-opacity duration-500 ${posterLoaded ? "opacity-0" : "opacity-100"}`}
          style={{ backgroundImage: `url("${FIRST_SLIDE_LQIP}")` }}
        />
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-b from-[#081129]/40 via-[#081129]/10 to-[#081129]/60 transition-opacity duration-500 ${posterLoaded ? "opacity-0" : "opacity-100"}`}
        />

        <div
          className="absolute inset-0"
          style={{
            ["--copy-width-t" as string]: HERO_COPY.copyWidthTablet,
            ["--copy-width-d" as string]: HERO_COPY.copyWidthDesktop,
          }}
          data-testid="hero-slide-1"
          data-active="true"
        >
          <video
            ref={videoRef}
            className="hero-slide absolute inset-0 h-full w-full object-cover"
            poster={HERO_POSTER_SRC}
            muted
            loop
            playsInline
            autoPlay={!reducedMotion}
            preload="auto"
            aria-label={HERO_COPY.alt}
          >
            <source src={heroVideoWebm.url} type="video/webm" />
            <source src={heroVideoMp4.url} type="video/mp4" />
          </video>
          {/* Invisible poster img: warms the LCP candidate and flips the
              placeholder off once it is cached. */}
          <img
            src={HERO_POSTER_SRC}
            srcSet={HERO_POSTER_WEBP_SRCSET}
            alt=""
            aria-hidden
            width={1920}
            height={1080}
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setPosterLoaded(true)}
            className="absolute inset-0 h-full w-full object-cover opacity-0 pointer-events-none"
          />

          <div
            className={`absolute inset-0 z-10 flex px-5 sm:items-center sm:px-10 sm:pb-0 sm:pt-0 md:px-12 lg:px-16 xl:px-20 ${mobilePlacement} ${desktopGradient} ${HERO_COPY.align === "right" ? "justify-end text-right" : "justify-start text-left"}`}
          >
            <div className="@container w-full max-w-4xl text-primary-foreground sm:w-[var(--copy-width-t)] sm:min-w-[19rem] lg:w-[var(--copy-width-d)]">
              {HERO_COPY.eyebrow ? (
                <p className="mb-3 whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-brand-turquoise sm:text-sm">
                  {HERO_COPY.eyebrow}
                </p>
              ) : null}
              <h1 className="font-display text-[clamp(1.5rem,10cqw,3.5rem)] font-extrabold leading-[1.12]">
                {HERO_COPY.headlineLines
                  ? HERO_COPY.headlineLines.map((line) => (
                      <span key={line} className="block whitespace-nowrap">
                        {line}{" "}
                      </span>
                    ))
                  : HERO_COPY.headline}
              </h1>
              {HERO_COPY.supportingCopy ? (
                <p
                  className={`mt-3 max-w-[40ch] text-[clamp(0.875rem,3.4cqw,1.125rem)] [text-wrap:pretty] font-medium leading-relaxed text-primary-foreground/90 sm:mt-4 ${
                    HERO_COPY.align === "right" ? "ml-auto" : ""
                  }`}
                >
                  {HERO_COPY.supportingCopy}
                </p>
              ) : null}
              <div
                aria-hidden
                className={`mt-4 flex h-1 w-28 overflow-hidden rounded-full sm:mt-5 sm:w-36 ${
                  HERO_COPY.align === "right" ? "ml-auto" : ""
                }`}
              >
                <span className="w-2/3 bg-brand-turquoise" />
                <span className="w-1/3 bg-brand-pink" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#081129]/20 via-transparent to-[#081129]/30" />

        {/* Turquoise section dividers — inside the rounded stage so they stop at the curve */}
        <div className="absolute top-0 inset-x-0 w-full max-w-none z-10 border-t-2 border-[#22c0d4]" />
        <div className="absolute bottom-0 inset-x-0 w-full max-w-none z-10 border-t-2 border-[#22c0d4]" />
      </div>
    </section>
  );
}
