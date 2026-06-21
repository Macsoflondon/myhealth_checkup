import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";
import { PROVIDER_LOGOS } from "@/constants/providers";
import heartMarkAsset from "@/assets/brand/heart-mark.png.asset.json";

// ── Brand ─────────────────────────────────────────────────────────────
const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const NAVY = "#081129";
const PEARL = "#fafaf7";

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
    <section className="rounded-[28px] overflow-hidden bg-[#fafaf7] border border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-6 sm:px-9 pt-7 pb-8">
      <div className="flex items-center justify-between border-b border-[#081129]/10 pb-3.5">
        <Wordmark />
        <nav className="hidden sm:flex gap-6 text-[10px] font-bold uppercase tracking-[0.18em] font-[Montserrat]">
          <Link to="/compare" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Compare</Link>
          <Link to="/test-categories" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Categories</Link>
          <Link to="/find-test" className="text-[#e70d69]">Find your test</Link>
        </nav>
      </div>

      <h1 className="font-extrabold text-[clamp(4.5rem,12vw,10rem)] tracking-[-0.05em] leading-[0.9] text-[#081129] m-0 mt-10 mb-3 font-[Montserrat]">
        Compare<span className="text-[#22c0d4]">.</span>
      </h1>

      <div className="flex items-baseline justify-between gap-4 border-b border-[#081129]/10 pb-4">
        <span className="text-lg font-bold uppercase tracking-[0.12em] font-[Montserrat] text-[#081129]/55">
          Your <span className="text-[#22c0d4]">health.</span> Your <span className="text-[#e70d69]">choice.</span> One trusted platform.
        </span>
        <div className="hidden sm:flex items-center gap-2"><LanguageSwitcher /><UserMenu /></div>
      </div>

      <div className="relative rounded-[18px] overflow-hidden my-4 -mx-6 sm:-mx-9 h-[360px] sm:h-[520px] md:h-[620px] lg:h-[700px] bg-[#081129]">
        {SLIDES.map((s, n) => (
          <img key={n} src={s.src} alt={s.label}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: n === i % SLIDES.length ? 1 : 0, objectPosition: s.pos }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#081129]/20 via-transparent to-[#081129]/30" />

        <div className="absolute left-5 top-[18px] flex gap-1.5">
          {SLIDES.map((_, n) => (
            <button key={n} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)}
              className="h-[7px] rounded-full transition-all"
              style={{ width: n === i % SLIDES.length ? 20 : 7, background: n === i % SLIDES.length ? TURQUOISE : "rgba(255,255,255,0.5)" }} />
          ))}
        </div>

        <div className="absolute left-[18px] bottom-[18px]">
          <span className="inline-flex items-center gap-2 px-3 py-[7px] rounded-full bg-[#081129]/45 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold font-[Montserrat]">
            <span className="w-[7px] h-[7px] rounded-full" style={{ background: TURQUOISE }} />
            {slide.label}
          </span>
        </div>

        {ad && (
        <Link to={ad.to} className="absolute right-[18px] bottom-[18px] w-[272px] bg-[#fafaf7] rounded-2xl p-4 shadow-[0_16px_40px_rgba(8,17,41,0.28)] no-underline block">
          <div className="flex items-center justify-between mb-2.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.05em] text-white font-[Montserrat]" style={{ background: ad.color }}>{ad.category}</span>
            <span className="flex items-baseline gap-1">
              <span className="text-[11px] font-semibold text-[#081129]/45 font-[Lato]">from</span>
              <span className="font-extrabold text-xl text-[#081129] font-[Montserrat]">£{ad.price}</span>
            </span>
          </div>
          <div className="font-bold text-[15px] text-[#081129] leading-tight min-h-[36px] font-[Montserrat]">{ad.name}</div>
          <div className="flex items-center mt-3 gap-3">
            <div className="flex-1 flex items-center justify-center px-2 min-w-0">
              <img src={ad.providerLogo} alt={ad.provider}
                   className="h-12 w-auto max-w-full object-contain" />
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-semibold font-[Montserrat]" style={{ background: ad.color }}>
              Compare <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </span>
          </div>
        </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-6 pt-1.5">
        <h2 className="font-bold text-[22px] tracking-[-0.02em] text-[#081129] leading-[1.15] m-0 font-[Montserrat]">One price you<br />can actually trust.</h2>
        <p className="text-xs text-[#081129]/60 leading-[1.55] m-0 font-[Lato]">We pull live prices from accredited UK providers — Medichecks, Goodbody, Lola, Thriva and more — and line them up side by side. No markup, no hidden fees.</p>
        <p className="text-xs text-[#081129]/60 leading-[1.55] m-0 font-[Lato]">UKAS-accredited labs. CQC-regulated clinics. No GP referral needed. Results typically in 2–5 working days, by post or in clinic.</p>
      </div>
    </section>
  );
}
