/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

import { PROVIDER_LOGOS } from "@/constants/providers";
import HeroSalesTestCard from "@/components/sections/HeroSalesTestCard";
import TestCategoryTicker from "@/components/sections/TestCategoryTicker";

// ── Brand ─────────────────────────────────────────────────────────────
const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const NAVY = "#081129";
const PEARL = "#F5F5F5";

// ── Hero carousel images ──────────────────────────────────────────────
import joggingWoman from "@/assets/hero/hero-jogging-woman.png";
import clinicReceptionAsset from "@/assets/hero/hero-clinic-reception.png.asset.json";
import seniorCoupleAsset from "@/assets/hero/hero-senior-couple.png.asset.json";
import benchPhoneAsset from "@/assets/hero/hero-bench-phone.png.asset.json";
import bloodTestKitAsset from "@/assets/hero/hero-blood-test-kit.png.asset.json";

// ── Hero carousel videos (looping cinemagraphs) ───────────────────────
import clipJoggingAsset from "@/assets/hero/video/clip-jogging.mp4.asset.json";
import clipClinicAsset from "@/assets/hero/video/clip-clinic-reception.mp4.asset.json";
import clipSeniorAsset from "@/assets/hero/video/clip-senior-couple.mp4.asset.json";
import clipBenchAsset from "@/assets/hero/video/clip-bench-phone.mp4.asset.json";
import clipKitAsset from "@/assets/hero/video/clip-blood-test-kit.mp4.asset.json";

const clinicReception = clinicReceptionAsset.url;
const seniorCouple = seniorCoupleAsset.url;
const benchPhone = benchPhoneAsset.url;
const bloodTestKit = bloodTestKitAsset.url;

// Per-slide focal points tuned for mobile / tablet / desktop crops
const SLIDES = [
  {
    src: joggingWoman,
    video: clipJoggingAsset.url,
    label: "Know Your Health. Own Your Future.",
    posMobile: "30% 30%",
    posTablet: "center 32%",
    posDesktop: "center 35%",
  },
  {
    src: clinicReception,
    video: clipClinicAsset.url,
    label: "Nationwide network of CQC-regulated clinics",
    posMobile: "60% 50%",
    posTablet: "center 50%",
    posDesktop: "center 50%",
  },
  {
    src: seniorCouple,
    video: clipSeniorAsset.url,
    label: "Proactive Health for Every Stage of Life",
    posMobile: "50% 25%",
    posTablet: "center 28%",
    posDesktop: "center 30%",
  },
  {
    src: benchPhone,
    video: clipBenchAsset.url,
    label: "Find the Right Test for You, Compare. Choose. Book.",
    posMobile: "55% 40%",
    posTablet: "center 40%",
    posDesktop: "center 40%",
  },
  {
    src: bloodTestKit,
    video: clipKitAsset.url,
    label: "Test from the Comfort of Home",
    posMobile: "35% 60%",
    posTablet: "40% 60%",
    posDesktop: "50% 65%",
  },
];


import { realTestData, type RealTestData } from "@/data/compare/realProviderData";

const CATEGORY_META: Record<string, { color: string; to: string }> = {
  "General Health": { color: TURQUOISE, to: "/test/general-health" },
  Hormone: { color: PINK, to: "/hormones" },
  Heart: { color: "#ef4444", to: "/tests/heart" },
  Thyroid: { color: "#7c3aed", to: "/thyroid" },
  Diabetes: { color: "#f59e0b", to: "/tests/diabetes" },
  Fertility: { color: "#e70d69", to: "/fertility-tests" },
  Vitamins: { color: "#16a34a", to: "/tests/vitamins" },
};

// providerName in realTestData → key in PROVIDER_LOGOS
const PROVIDER_KEY: Record<string, keyof typeof PROVIDER_LOGOS> = {
  Medichecks: "medichecks",
  "Goodbody Clinic": "goodbody-clinic",
  "London Medical Laboratory": "london-medical-laboratory",
  Clinilabs: "clinilabs",
};

// Curated rotation: provider + preferred test name + display category
const ROTATION: { provider: string; testName: string; category: string }[] = [
  { provider: "Medichecks", testName: "Advanced Well Woman Blood Test", category: "General Health" },
  { provider: "Goodbody Clinic", testName: "", category: "General Health" },
  { provider: "London Medical Laboratory", testName: "", category: "General Health" },
  { provider: "Clinilabs", testName: "", category: "General Health" },
  { provider: "Medichecks", testName: "Cholesterol Blood Test", category: "Heart" },
  { provider: "Medichecks", testName: "Thyroid Function Blood Test", category: "Thyroid" },
];

interface Advert {
  category: string;
  color: string;
  to: string;
  name: string;
  price: number;
  provider: string;
  providerKey: keyof typeof PROVIDER_LOGOS;
  providerLogo: string;
  url: string;
}

function buildAdverts(): Advert[] {
  return ROTATION.flatMap(({ provider, testName, category }) => {
    const t: RealTestData | undefined =
      (testName && realTestData.find((r) => r.Provider === provider && r["Test Name"] === testName)) ||
      realTestData.find((r) => r.Provider === provider);
    if (!t) return [];
    const meta = CATEGORY_META[category] ?? { color: TURQUOISE, to: "/compare" };
    const key = PROVIDER_KEY[t.Provider];
    if (!key) return [];
    return [
      {
        category,
        color: meta.color,
        to: meta.to,
        name: t["Test Name"],
        price: t["Price (£)"],
        provider: t.Provider,
        providerKey: key,
        providerLogo: PROVIDER_LOGOS[key],
        url: t["Test URL"],
      },
    ];
  });
}

const ADVERTS: Advert[] = buildAdverts();

interface HeroMastheadProps {
  rotateMs?: number;
}

const Wordmark = () => (
  <span className="inline-flex items-center leading-[1.1] min-w-0 py-1">
    <span className="font-bold tracking-[-0.02em] font-[Montserrat] whitespace-nowrap text-[clamp(1.5rem,3vw,2.25rem)] lg:text-[3.5rem] xl:text-[4.5rem]">
      <span className="text-brand-navy">myhealth</span>
      <span className="text-brand-pink">checkup</span>
    </span>
  </span>
);

export default function HeroMasthead({ rotateMs = 15000 }: HeroMastheadProps) {
  const [i, setI] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const activeIndex = i % SLIDES.length;

  // Detect reduced-motion (fallback to timer-based advance).
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

  // Play the active video from the start; pause the others.
  // Reduced-motion: skip playback entirely — the poster PNG stays visible and
  // the timer below still advances slides so the carousel remains functional.
  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === activeIndex && !reducedMotion) {
        try {
          v.currentTime = 0;
        } catch {
          /* ignore */
        }
        v.play().catch(() => {
          /* autoplay may be blocked — timer fallback below still advances */
        });
      } else {
        v.pause();
      }
    });
  }, [activeIndex, reducedMotion]);

  // Fallback timer: advances if a video fails to fire `ended` (blocked autoplay,
  // network stall) or if the user prefers reduced motion. 11s = clip length + buffer.
  useEffect(() => {
    const ms = reducedMotion ? Math.max(1200, rotateMs) : 11000;
    const id = setTimeout(advance, ms);
    return () => clearTimeout(id);
  }, [activeIndex, advance, reducedMotion, rotateMs]);

  const slide = SLIDES[activeIndex];
  const ad = ADVERTS.length ? ADVERTS[activeIndex] : null;

  return (
    <section className="rounded-t-none rounded-b-none overflow-hidden bg-[#F5F5F5] border border-b-0 border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-3 sm:px-6 md:px-9 pt-0 pb-0 min-h-[84svh] sm:min-h-[100svh] flex flex-col">
      <h1 className="sr-only">Compare private blood tests and health screening from trusted UK providers</h1>
      <TestCategoryTicker
        variant="inline"
        className="bg-[#F5F5F5] border-b border-[#081129]/[0.06] -mx-3 sm:-mx-6 md:-mx-9"
      />

      <div className="flex items-center justify-between gap-3 border-b border-[#081129]/10 pb-2 pt-4 sm:pt-7">
        <div className="hidden sm:block">
          <Wordmark />
        </div>
        <nav className="hidden sm:flex items-center gap-3 md:gap-4 lg:gap-6 text-xs sm:text-[13px] md:text-sm lg:text-base font-bold uppercase tracking-[0.14em] md:tracking-[0.18em] font-[Montserrat]">
          <Link
            to="/compare"
            className="whitespace-nowrap text-brand-navy hover:text-brand-turquoise underline decoration-2 underline-offset-4 decoration-brand-turquoise hover:decoration-brand-pink transition-colors hover:-translate-y-0.5"
          >
            Compare
          </Link>
          <Link
            to="/test-categories"
            className="whitespace-nowrap text-brand-navy hover:text-brand-turquoise underline decoration-2 underline-offset-4 decoration-brand-turquoise hover:decoration-brand-pink transition-colors hover:-translate-y-0.5"
          >
            Categories
          </Link>
          <Link
            to="/find-test"
            className="whitespace-nowrap text-brand-pink hover:text-brand-turquoise underline decoration-2 underline-offset-4 decoration-brand-turquoise hover:decoration-brand-pink transition-colors hover:-translate-y-0.5"
          >
            Take the health quiz
          </Link>
        </nav>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-b border-[#081129]/10 pb-1.5 sm:pb-2 mt-4 sm:mt-6 md:mt-8">
        <span className="font-bold uppercase tracking-[0.08em] font-[Montserrat] text-brand-navy leading-[1.15] text-[clamp(0.85rem,4.2vw,3.25rem)] sm:whitespace-nowrap sm:text-[clamp(0.95rem,2.8vw,2.25rem)]">
          YOUR <span className="text-brand-turquoise">HEALTH.</span> YOUR{" "}
          <span className="text-brand-pink">CHOICE.</span> ONE TRUSTED PLATFORM.
        </span>
      </div>
      <div className="relative rounded-t-[18px] overflow-hidden mt-2 -mx-3 sm:-mx-6 md:-mx-9 flex-1 min-h-0 bg-[#081129]">
        {SLIDES.map((s, n) => {
          const active = n === activeIndex;
          const commonStyle = {
            opacity: active ? 1 : 0,
            ["--pos-m" as any]: s.posMobile,
            ["--pos-t" as any]: s.posTablet,
            ["--pos-d" as any]: s.posDesktop,
          };
          if (s.video) {
            return (
              <video
                key={n}
                ref={(el) => {
                  videoRefs.current[n] = el;
                }}
                src={s.video}
                poster={s.src}
                muted
                playsInline
                preload={n === 0 || n === (activeIndex + 1) % SLIDES.length ? "auto" : "metadata"}
                onEnded={advance}
                className="hero-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={commonStyle}
              />
            );
          }
          return (
            <img
              key={n}
              src={s.src}
              alt={s.label}
              width={1920}
              height={1080}
              sizes="100vw"
              loading={n === 0 ? "eager" : "lazy"}
              fetchPriority={n === 0 ? "high" : "low"}
              decoding="async"
              className="hero-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={commonStyle}
            />
          );
        })}


        <div className="absolute inset-0 bg-gradient-to-b from-[#081129]/20 via-transparent to-[#081129]/30" />

        {/* Rotating slide label bubble */}
        <div className="hidden lg:block absolute left-[18px] bottom-[18px] pointer-events-none max-w-[45%]">
          <span
            key={`label-${i % SLIDES.length}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full bg-[#081129]/45 backdrop-blur-sm border border-white/20 text-white text-[11px] sm:text-sm md:text-base lg:text-xl font-semibold font-[Montserrat] animate-fade-in"
          >
            <span
              className="w-1.5 h-1.5 sm:w-[7px] sm:h-[7px] rounded-full shrink-0"
              style={{ background: TURQUOISE }}
            />
            {slide.label}
          </span>
        </div>


        {ad && <HeroSalesTestCard ad={ad} />}
      </div>
    </section>
  );
}
