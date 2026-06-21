import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";

// ── Brand ─────────────────────────────────────────────────────────────
const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const NAVY = "#081129";

// ── Hero carousel images ──────────────────────────────────────────────
import benchMan from "@/assets/hero/hero-bench-man.png";
import joggingWoman from "@/assets/hero/hero-jogging-woman.png";
import activeCouple from "@/assets/hero/hero-active-lifestyle.webp";
import homeKit from "@/assets/hero/hero-home-kit.webp";
import clinicNew from "@/assets/hero/hero-clinic-new.png";

// Heart mark — embedded as base64 so no separate asset upload is needed
const HEART_MARK_B64 = "data:image/png;base64,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";

const SLIDES = [
  { src: benchMan, label: "Your results, in your pocket" },
  { src: joggingWoman, label: "Stay ahead of your health" },
  { src: activeCouple, label: "Active at every age" },
  { src: homeKit, label: "Finger-prick test from home" },
  { src: clinicNew, label: "Walk-in clinics nationwide" },
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

const PICKS: { category: string; name: string; tag?: string }[] = [
  { category: "General Health", name: "Advanced Well Woman Blood Test", tag: "General Health" },
  { category: "Hormone", name: "Testosterone Blood Test", tag: "Hormone" },
  { category: "Heart", name: "Cholesterol Blood Test", tag: "Heart" },
  { category: "Thyroid", name: "Thyroid Function Blood Test", tag: "Thyroid" },
  { category: "Diabetes", name: "Diabetes (HbA1c) Blood Test", tag: "Diabetes" },
  { category: "Fertility", name: "Day 3 Fertility Blood Test", tag: "Fertility" },
  { category: "Vitamins", name: "Vitamin D (25 OH) Blood Test" },
];

interface Advert {
  category: string; color: string; to: string;
  name: string; price: number; provider: string; markers: number | null; url: string;
}

function buildAdverts(): Advert[] {
  const find = (name: string, tag?: string): RealTestData | undefined =>
    realTestData.find((t) => t["Test Name"] === name) ||
    (tag ? realTestData.find((t) => t.Tags === tag) : undefined);

  return PICKS.flatMap(({ category, name, tag }) => {
    const t = find(name, tag);
    if (!t) return [];
    const meta = CATEGORY_META[category] ?? { color: TURQUOISE, to: "/compare" };
    const count = t["Biomarker Count"];
    return [{
      category, color: meta.color, to: meta.to,
      name: t["Test Name"], price: t["Price (£)"], provider: t.Provider,
      markers: count > 4 ? count : null, url: t["Test URL"],
    }];
  });
}

const ADVERTS: Advert[] = buildAdverts();

interface HeroMastheadProps {
  rotateMs?: number;
}

const Wordmark = () => (
  <span className="inline-flex items-center gap-2.5 leading-none">
    <img src={HEART_MARK_B64} alt="myhealth checkup" className="h-8 w-auto" />
    <span className="font-bold text-[26px] tracking-[-0.02em] font-[Montserrat]">
      <span className="text-[#081129]">myhealth</span>
      <span className="text-[#e70d69]">checkup</span>
    </span>
  </span>
);

export default function HeroMasthead({ rotateMs = 3800 }: HeroMastheadProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => n + 1), Math.max(1200, rotateMs));
    return () => clearInterval(id);
  }, [rotateMs]);

  const slide = SLIDES[i % SLIDES.length];
  const ad = ADVERTS.length ? ADVERTS[i % ADVERTS.length] : null;

  return (
    <section className="rounded-[28px] overflow-hidden bg-white border border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-6 sm:px-9 pt-7 pb-8">
      <div className="flex items-center justify-between border-b border-[#081129]/10 pb-3.5">
        <Wordmark />
        <nav className="hidden sm:flex gap-6 text-[10px] font-bold uppercase tracking-[0.18em] font-[Montserrat]">
          <Link to="/compare" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Compare</Link>
          <Link to="/test-categories" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Categories</Link>
          <Link to="/find-test" className="text-[#e70d69]">Find your test</Link>
        </nav>
      </div>

      <h1 className="font-extrabold text-[clamp(3rem,9vw,7rem)] tracking-[-0.05em] leading-[0.9] text-[#081129] m-0 mt-3 font-[Montserrat]">
        Compare<span className="text-[#22c0d4]">.</span>
      </h1>

      <div className="flex items-baseline justify-between gap-4 border-b border-[#081129]/10 pb-4 mt-[18px]">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] font-[Montserrat] text-[#081129]/55">
          Your <span className="text-[#22c0d4]">health.</span> Your <span className="text-[#e70d69]">choice.</span> One trusted platform.
        </span>
        <div className="hidden sm:flex items-center gap-2"><LanguageSwitcher /><UserMenu /></div>
      </div>

      <div className="relative rounded-[18px] overflow-hidden my-4 h-[480px] bg-[#081129]">
        {SLIDES.map((s, n) => (
          <img key={n} src={s.src} alt={s.label}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
            style={{ opacity: n === i % SLIDES.length ? 1 : 0 }} />
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
        <Link to={ad.to} className="absolute right-[18px] bottom-[18px] w-[264px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_16px_40px_rgba(8,17,41,0.28)] no-underline block">
          <div className="flex items-center justify-between mb-2.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.05em] text-white font-[Montserrat]" style={{ background: ad.color }}>{ad.category}</span>
            <span className="flex items-baseline gap-1">
              <span className="text-[11px] font-semibold text-[#081129]/45 font-[Lato]">from</span>
              <span className="font-extrabold text-xl text-[#081129] font-[Montserrat]">£{ad.price}</span>
            </span>
          </div>
          <div className="font-bold text-[15px] text-[#081129] leading-tight min-h-[36px] font-[Montserrat]">{ad.name}</div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11.5px] text-[#081129]/50 font-[Lato]">{ad.provider}{ad.markers ? ` · ${ad.markers} markers` : ""}</span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-semibold font-[Montserrat]" style={{ background: ad.color }}>
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
