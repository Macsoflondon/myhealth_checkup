import { useState, useEffect, useCallback, useMemo } from "react";

import { PROVIDER_LOGOS, normalizeProviderId, getProviderName } from "@/constants/providers";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";
import HeroSalesTestCard from "@/components/sections/HeroSalesTestCard";
import TestCategoryTicker from "@/components/sections/TestCategoryTicker";
import { useHeroPopularTests } from "@/hooks/queries/useHeroPopularTests";

const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";

import joggingWoman from "@/assets/hero/hero-jogging-woman.png";
import clinicReceptionAsset from "@/assets/hero/hero-clinic-reception.png.asset.json";
import seniorCoupleAsset from "@/assets/hero/hero-senior-couple.png.asset.json";
import benchPhoneAsset from "@/assets/hero/hero-bench-phone.png.asset.json";
import bloodTestKitAsset from "@/assets/hero/hero-blood-test-kit.png.asset.json";

const clinicReception = clinicReceptionAsset.url;
const seniorCouple = seniorCoupleAsset.url;
const benchPhone = benchPhoneAsset.url;
const bloodTestKit = bloodTestKitAsset.url;

const SLIDES = [
  {
    src: joggingWoman,
    label: "Know Your Health. Own Your Future.",
    posMobile: "35% 55%",
    posTablet: "center 32%",
    posDesktop: "center 35%",
  },
  {
    src: clinicReception,
    label: "Nationwide network of CQC-regulated clinics",
    posMobile: "60% 50%",
    posTablet: "center 50%",
    posDesktop: "center 50%",
  },
  {
    src: seniorCouple,
    label: "Proactive Health for Every Stage of Life",
    posMobile: "50% 40%",
    posTablet: "center 28%",
    posDesktop: "center 30%",
  },
  {
    src: benchPhone,
    label: "Find the Right Test for You, Compare. Choose. Book.",
    posMobile: "55% 50%",
    posTablet: "center 40%",
    posDesktop: "center 40%",
  },
  {
    src: bloodTestKit,
    label: "Test from the Comfort of Home",
    posMobile: "40% 55%",
    posTablet: "40% 60%",
    posDesktop: "50% 65%",
  },
];


const CATEGORY_META: Record<string, { color: string; to: string }> = {
  "general-health": { color: TURQUOISE, to: "/test/general-health" },
  "heart": { color: "#ef4444", to: "/tests/heart" },
  "thyroid": { color: "#7c3aed", to: "/thyroid" },
  "diabetes": { color: "#f59e0b", to: "/tests/diabetes" },
  "fertility": { color: PINK, to: "/fertility-tests" },
  "vitamins": { color: "#16a34a", to: "/tests/vitamins" },
  "cancer-screening": { color: "#dc2626", to: "/tests/cancer-screening" },
  "hormone": { color: PINK, to: "/hormones" },
};

export interface HeroAdvert {
  id: string;
  category: string;
  color: string;
  to: string;
  name: string;
  price: number;
  provider: string;
  providerKey: string;
  providerLogo: string;
  url: string;
  markers: string[];
  biomarkerCount: number | null;
  turnaround: string | null;
  clinicalReviewType: string | null;
}

const Wordmark = () => (
  <span className="inline-flex items-center leading-[1.1] min-w-0 py-1">
    <span className="font-bold tracking-[-0.02em] font-[Montserrat] whitespace-nowrap text-[clamp(2rem,4vw,3.75rem)] lg:text-[5rem] xl:text-[6rem]">
      <span className="text-white">myhealth</span>
      <span className="text-brand-pink">checkup</span>
    </span>
  </span>
);

export default function HeroMasthead({ rotateMs = 15000 }: { rotateMs?: number }) {
  const [i, setI] = useState(0);
  const activeIndex = i % SLIDES.length;
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

  const { data: popularTests } = useHeroPopularTests();
  const adverts: HeroAdvert[] = useMemo(() => {
    if (!popularTests || popularTests.length === 0) return [];
    return popularTests
      .filter((t) => t.totalExpectedCost != null && t.url)
      .map((t) => {
        const providerKey = normalizeProviderId(t.providerId);
        const providerLogo = PROVIDER_LOGOS[providerKey] || "";
        const category = t.canonicalCategory || "general-health";
        const meta = CATEGORY_META[category] ?? { color: "#22c0d4", to: "/compare" };
        return {
          id: t.id,
          category,
          color: meta.color,
          to: meta.to,
          name: t.testName,
          price: t.totalExpectedCost!,
          provider: getProviderName(t.providerId),
          providerKey,
          providerLogo,
          url: t.url!,
          markers: t.biomarkersList,
          biomarkerCount: t.biomarkerCount,
          turnaround: t.turnaroundDaysText,
          clinicalReviewType: t.clinicalReviewType,
        };
      });
  }, [popularTests]);
  const slide = SLIDES[activeIndex];
  const ad = adverts.length ? adverts[i % adverts.length] : null;
  return (
    <section className="rounded-t-none rounded-b-none overflow-hidden bg-[#081129] border border-b-0 border-white/10 shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-3 sm:px-6 md:px-9 pt-0 pb-0 min-h-[78svh] sm:min-h-[100svh] flex flex-col">
      <TestCategoryTicker variant="inline" className="bg-white border-b border-brand-navy/10 -mx-3 sm:-mx-6 md:-mx-9" />
      <div className="hidden sm:flex items-center border-b border-white/10 pb-2 pt-4 sm:pt-7">
        <div><Wordmark /></div>
      </div>
      <div className="hidden sm:flex items-center justify-end gap-4 border-b border-white/10 pb-1.5 sm:pb-2 mt-2.5 sm:mt-6 md:mt-8">
        <div className="flex items-center gap-1 shrink-0">
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </div>

      <div className="relative rounded-t-[18px] overflow-hidden mt-1.5 sm:mt-2 -mx-3 sm:-mx-6 md:-mx-9 flex-1 min-h-0 bg-[#081129]">
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
              src={s.src}
              alt={active ? s.label : ""}
              aria-hidden={active ? undefined : true}
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
        <div className="hidden lg:block absolute left-[18px] bottom-[18px] pointer-events-none max-w-[45%]">
          <span key={`label-${i % SLIDES.length}`} className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full bg-[#081129]/45 backdrop-blur-sm border border-white/20 text-white text-[11px] sm:text-sm md:text-base lg:text-xl font-semibold font-[Montserrat] animate-fade-in">
            <span className="w-1.5 h-1.5 sm:w-[7px] sm:h-[7px] rounded-full shrink-0" style={{ background: "#22c0d4" }} />
            {slide.label}
          </span>
        </div>
        {ad && (
          <div className="hidden sm:block">
            <HeroSalesTestCard ad={ad} />
          </div>
        )}
      </div>
    </section>
  );
}
