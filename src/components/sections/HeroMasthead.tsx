import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";


import { PROVIDER_LOGOS } from "@/constants/providers";
import heartMarkAsset from "@/assets/brand/heart-mark.png.asset.json";
import HeroSalesTestCard from "@/components/sections/HeroSalesTestCard";




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

const clinicReception = clinicReceptionAsset.url;
const seniorCouple = seniorCoupleAsset.url;
const benchPhone = benchPhoneAsset.url;
const bloodTestKit = bloodTestKitAsset.url;
const heartMark = heartMarkAsset.url;

// Per-slide focal points tuned for mobile / tablet / desktop crops
const SLIDES = [
  { src: joggingWoman,    label: "Stay ahead of your health",     posMobile: "30% 30%", posTablet: "center 32%", posDesktop: "center 35%" },
  { src: clinicReception, label: "Clinics Located Nationwide",    posMobile: "60% 50%", posTablet: "center 50%", posDesktop: "center 50%" },
  { src: seniorCouple,    label: "Active at every age",           posMobile: "50% 25%", posTablet: "center 28%", posDesktop: "center 30%" },
  { src: benchPhone,      label: "Find. Compare. Book.",          posMobile: "55% 40%", posTablet: "center 40%", posDesktop: "center 40%" },
  { src: bloodTestKit,    label: "Easy At Home Kits Available",   posMobile: "35% 60%", posTablet: "40% 60%", posDesktop: "50% 65%" },
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
  "Medichecks": "medichecks",
  "Goodbody Clinic": "goodbody-clinic",
  "London Medical Laboratory": "london-medical-laboratory",
  "Clinilabs": "clinilabs",
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
  category: string; color: string; to: string;
  name: string; price: number; provider: string;
  providerKey: keyof typeof PROVIDER_LOGOS;
  providerLogo: string; url: string;
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
    return [{
      category, color: meta.color, to: meta.to,
      name: t["Test Name"], price: t["Price (£)"], provider: t.Provider,
      providerKey: key, providerLogo: PROVIDER_LOGOS[key], url: t["Test URL"],
    }];
  });
}

const ADVERTS: Advert[] = buildAdverts();

interface HeroMastheadProps {
  rotateMs?: number;
}

const Wordmark = () => (
  <span className="inline-flex items-center leading-none min-w-0">
    <span className="font-bold text-[clamp(1.25rem,6.2vw,2.25rem)] tracking-[-0.02em] font-[Montserrat] whitespace-nowrap">
      <span className="text-[#081129]">myhealth</span>
      <span className="text-[#e70d69]">checkup</span>
    </span>
  </span>
);

export default function HeroMasthead({ rotateMs = 15000 }: HeroMastheadProps) {
  const [i, setI] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setI((n) => n + 1), Math.max(1200, rotateMs));
    return () => clearInterval(id);
  }, [rotateMs]);

  const slide = SLIDES[i % SLIDES.length];
  const ad = ADVERTS.length ? ADVERTS[i % ADVERTS.length] : null;

  return (
    <section className="rounded-t-[28px] rounded-b-none overflow-hidden bg-[#F5F5F5] border border-b-0 border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-3 sm:px-6 md:px-9 pt-4 sm:pt-7 pb-0 min-h-[84svh] sm:min-h-[96svh] flex flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-[#081129]/10 pb-2">
        <Wordmark />
        <nav className="hidden sm:flex gap-6 text-[11px] font-bold uppercase tracking-[0.18em] font-[Montserrat]">
          <Link to="/compare" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Compare</Link>
          <Link to="/test-categories" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Categories</Link>
          <Link to="/find-test" className="text-[#e70d69]">Find your test</Link>
        </nav>
        <button
          className="sm:hidden p-2 text-[#081129] rounded-lg hover:bg-[#081129]/[0.06] transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden flex flex-col gap-1 py-3 border-b border-[#081129]/10">
          <Link to="/compare" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-[13px] font-bold uppercase tracking-[0.14em] font-[Montserrat] text-[#081129] hover:text-[#22c0d4] transition-colors">Compare</Link>
          <Link to="/test-categories" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-[13px] font-bold uppercase tracking-[0.14em] font-[Montserrat] text-[#081129] hover:text-[#22c0d4] transition-colors">Categories</Link>
          <Link to="/find-test" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-[13px] font-bold uppercase tracking-[0.14em] font-[Montserrat] text-[#e70d69]">Find Your Test</Link>
        </div>
      )}

      <h1 className="font-extrabold text-[clamp(2.5rem,12vw,11rem)] tracking-[-0.05em] leading-[0.9] text-[#081129] m-0 mt-4 sm:mt-10 mb-3 sm:mb-10 font-[Montserrat]">
        Compare<span className="text-[#22c0d4]">.</span>
      </h1>

      <div className="flex items-baseline justify-between gap-4 border-b border-[#081129]/10 pb-1.5 sm:pb-2">
        <span className="text-[13px] sm:text-lg font-bold uppercase tracking-[0.08em] font-[Montserrat] text-[#081129] leading-snug">
          Your <span className="text-[#22c0d4]">health.</span> Your <span className="text-[#e70d69]">choice.</span> One trusted platform.
        </span>
      </div>

      <div className="mt-4 sm:mt-6 mb-2">
        <Link
          to="/find-test"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-sm font-[Montserrat] text-white bg-[#e70d69] hover:bg-[#c40a59] transition-colors"
        >
          Find Your Test <ArrowRight className="w-4 h-4" />
        </Link>
      </div>



      <div className="relative rounded-t-[18px] overflow-hidden mt-2 -mx-3 sm:-mx-6 md:-mx-9 flex-1 min-h-0 bg-[#081129]">
        {SLIDES.map((s, n) => {
          const active = n === i % SLIDES.length;
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
              className="hero-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{
                opacity: active ? 1 : 0,
                ["--pos-m" as any]: s.posMobile,
                ["--pos-t" as any]: s.posTablet,
                ["--pos-d" as any]: s.posDesktop,
              }}
            />
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-b from-[#081129]/20 via-transparent to-[#081129]/30" />

        {/* Rotating slide label bubble */}
        <div className="absolute left-2.5 bottom-2.5 sm:left-[18px] sm:bottom-[18px] pointer-events-none max-w-[85%]">
          <span
            key={`label-${i % SLIDES.length}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full bg-[#081129]/45 backdrop-blur-sm border border-white/20 text-white text-[11px] sm:text-lg md:text-2xl font-semibold font-[Montserrat] animate-fade-in"
          >
            <span className="w-1.5 h-1.5 sm:w-[7px] sm:h-[7px] rounded-full shrink-0" style={{ background: TURQUOISE }} />
            {slide.label}
          </span>
        </div>

        {ad && <HeroSalesTestCard ad={ad} />}

      </div>

    </section>

  );
}
