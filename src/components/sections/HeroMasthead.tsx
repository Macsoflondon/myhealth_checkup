import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, FlaskConical, Stethoscope, Zap } from "lucide-react";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";
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
  { src: clinicReception, label: "Walk-in clinics nationwide",    posMobile: "60% 50%", posTablet: "center 50%", posDesktop: "center 50%" },
  { src: seniorCouple,    label: "Active at every age",           posMobile: "50% 25%", posTablet: "center 28%", posDesktop: "center 30%" },
  { src: benchPhone,      label: "Your results, in your pocket",  posMobile: "55% 40%", posTablet: "center 40%", posDesktop: "center 40%" },
  { src: bloodTestKit,    label: "Finger-prick test from home",   posMobile: "45% 55%", posTablet: "center 55%", posDesktop: "center 55%" },
];



import { realTestData, type RealTestData } from "@/data/compare/realProviderData";

const CATEGORY_META: Record<string, { color: string; to: string }> = {
  "General Health": { color: TURQUOISE, to: "/test/general-health" },
  Hormone: { color: PINK, to: "/hormones" },
  Heart: { color: "#ef4444", to: "/tests/heart" },
  Thyroid: { color: "#7c3aed", to: "/thyroid" },
  Diabetes: { color: "#f59e0b", to: "/tests/diabetes" },
  Fertility: { color: "#ec4899", to: "/fertility-tests" },
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
  <span className="inline-flex items-center gap-2.5 leading-none">
    <img src={heartMark} alt="myhealth checkup" className="h-10 w-auto" />
    <span className="font-bold text-[26px] tracking-[-0.02em] font-[Montserrat]">
      <span className="text-[#081129]">myhealth</span>
      <span className="text-[#e70d69]">checkup</span>
    </span>
  </span>
);

export default function HeroMasthead({ rotateMs = 15000 }: HeroMastheadProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => n + 1), Math.max(1200, rotateMs));
    return () => clearInterval(id);
  }, [rotateMs]);

  const slide = SLIDES[i % SLIDES.length];
  const ad = ADVERTS.length ? ADVERTS[i % ADVERTS.length] : null;

  return (
    <section className="rounded-[28px] overflow-hidden bg-[#F5F5F5] border border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-6 sm:px-9 pt-7 pb-4 min-h-[100svh] flex flex-col">
      <div className="flex items-center justify-between border-b border-[#081129]/10 pb-2">
        <Wordmark />
        <nav className="hidden sm:flex gap-6 text-[11px] font-bold uppercase tracking-[0.18em] font-[Montserrat]">
          <Link to="/compare" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Compare</Link>
          <Link to="/test-categories" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Categories</Link>
          <Link to="/find-test" className="text-[#e70d69]">Find your test</Link>
        </nav>
      </div>

      <h1 className="font-extrabold text-[clamp(5rem,13vw,11rem)] tracking-[-0.05em] leading-[0.9] text-[#081129] m-0 mt-3 md:mt-4 mb-3 font-[Montserrat]">
        Compare<span className="text-[#22c0d4]">.</span>
      </h1>

      <div className="flex items-baseline justify-between gap-4 border-b border-[#081129]/10 pb-2">
        <span className="text-lg font-bold uppercase tracking-[0.12em] font-[Montserrat] text-[#081129]/55">
          Your <span className="text-[#22c0d4]">health.</span> Your <span className="text-[#e70d69]">choice.</span> One trusted platform.
        </span>
        <div className="hidden sm:flex items-center gap-2"><LanguageSwitcher /><UserMenu /></div>
      </div>

      <div className="relative rounded-[18px] overflow-hidden my-2 -mx-6 sm:-mx-9 flex-1 min-h-[55svh] bg-[#081129]">
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
              className="hero-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
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
        <div className="absolute left-[18px] bottom-[18px] pointer-events-none">
          <span
            key={`label-${i % SLIDES.length}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#081129]/45 backdrop-blur-sm border border-white/20 text-white text-2xl font-semibold font-[Montserrat] animate-fade-in"
          >
            <span className="w-[7px] h-[7px] rounded-full" style={{ background: TURQUOISE }} />
            {slide.label}
          </span>
        </div>

        {ad && <HeroSalesTestCard ad={ad} />}

      </div>

      <div className="pt-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: "100%", label: "UKAS-accredited labs", Icon: ShieldCheck, color: TURQUOISE },
            { value: "200+", label: "Tests to compare", Icon: FlaskConical, color: PINK },
            { value: "No GP", label: "Referral needed", Icon: Stethoscope, color: "#3a5f85" },
            { value: "60 sec", label: "To compare & decide", Icon: Zap, color: "#16a34a" },
          ].map(({ value, label, Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#081129]/[0.08] p-2 shadow-[0_4px_16px_rgba(8,17,41,0.05)] flex flex-row items-center gap-2">
              <span className="w-[22px] h-[22px] rounded-[7px] inline-flex items-center justify-center shrink-0" style={{ background: `${color}14` }}>
                <Icon className="w-[12px] h-[12px]" style={{ color }} strokeWidth={2} />
              </span>
              <div className="flex flex-col min-w-0">
                <div className="font-extrabold text-[14px] tracking-[-0.02em] text-[#081129] leading-none font-[Montserrat]">{value}</div>
                <div className="text-[9px] text-[#081129]/55 mt-0.5 font-[Lato] leading-tight">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
