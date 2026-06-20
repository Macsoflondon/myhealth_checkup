import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ── Brand ─────────────────────────────────────────────────────────────
const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const NAVY = "#081129";

// ── Hero carousel images ──────────────────────────────────────────────
// Add the three NEW images to src/assets/hero/ (exported with your kit),
// the other two already exist in your project.
import benchMan from "@/assets/hero/hero-bench-man.png";
import joggingWoman from "@/assets/hero/hero-jogging-woman.png";
import activeCouple from "@/assets/hero/hero-active-lifestyle.webp";
import homeKit from "@/assets/hero/hero-home-kit.webp";
import clinicNew from "@/assets/hero/hero-clinic-new.png";
// Extracted love-heart mark (transparent PNG) — add to src/assets/
import heartMark from "@/assets/heart-mark.png";

const SLIDES = [
  { src: benchMan, label: "Your results, in your pocket" },
  { src: joggingWoman, label: "Stay ahead of your health" },
  { src: activeCouple, label: "Active at every age" },
  { src: homeKit, label: "Finger-prick test from home" },
  { src: clinicNew, label: "Walk-in clinics nationwide" },
];

// ── Live advert data ──────────────────────────────────────────────────
// Wired to your real catalog. We curate ONE recognisable test per category
// (a clean, on-brand name) and resolve its price / provider / biomarkers /
// URL from realProviderData so the figures are always live. Categories span
// the full range and the card rotates through them.
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

// Curated picks (display category → preferred test name). Resolved against
// the live catalog below; falls back to the first test in the category Tag.
const PICKS: { category: string; name: string; tag?: string }[] = [
  { category: "General Health", name: "Advanced Well Woman Blood Test", tag: "General Health" },
  { category: "Hormone", name: "Testosterone Blood Test", tag: "Hormone" },
  { category: "Heart", name: "Cholesterol Blood Test", tag: "Heart" },
  { category: "Thyroid", name: "Thyroid Function Blood Test", tag: "Thyroid" },
  { category: "Diabetes", name: "Diabetes (HbA1c) Blood Test", tag: "Diabetes" },
  { category: "Fertility", name: "Day 3 Fertility Blood Test", tag: "Fertility" },
  { category: "Vitamins", name: "Vitamin D (25 OH) Blood Test" }, // vitamins are untagged
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
    // Medichecks biomarker counts are placeholder (4) — only show when richer.
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
  /** Carousel + advert rotation interval (ms). @default 3800 */
  rotateMs?: number;
}

const Wordmark = () => (
  <span className="inline-flex items-center gap-2.5 leading-none">
    <img src={heartMark} alt="myhealth checkup" className="h-8 w-auto" />
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
      {/* top bar — brand + slim nav (no Clinics, no year) */}
      <div className="flex items-center justify-between border-b border-[#081129]/10 pb-3.5">
        <Wordmark />
        <nav className="hidden sm:flex gap-6 text-[10px] font-bold uppercase tracking-[0.18em] font-[Montserrat]">
          <Link to="/compare" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Compare</Link>
          <Link to="/test-categories" className="text-[#081129] hover:text-[#22c0d4] transition-colors">Categories</Link>
          <Link to="/find-test" className="text-[#e70d69]">Find your test</Link>
        </nav>
      </div>

      {/* masthead headline */}
      <h1 className="font-extrabold text-[clamp(3rem,9vw,7rem)] tracking-[-0.05em] leading-[0.9] text-[#081129] m-0 mt-3 font-[Montserrat]">
        Compare<span className="text-[#22c0d4]">.</span>
      </h1>

      {/* tagline — dropped clear of the descender; health=turquoise, choice=pink */}
      <div className="flex items-baseline justify-between gap-4 border-b border-[#081129]/10 pb-4 mt-[18px]">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] font-[Montserrat] text-[#081129]/55">
          Your <span className="text-[#22c0d4]">health.</span> Your <span className="text-[#e70d69]">choice.</span> One trusted platform.
        </span>
        <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.18em] font-[Montserrat] text-[#081129]/30 whitespace-nowrap">UK · 200+ tests</span>
      </div>

      {/* rotating carousel */}
      <div className="relative rounded-[18px] overflow-hidden my-4 h-[320px] bg-[#081129]">
        {SLIDES.map((s, n) => (
          <img key={n} src={s.src} alt={s.label}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
            style={{ opacity: n === i % SLIDES.length ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#081129]/20 via-transparent to-[#081129]/30" />

        {/* progress dots */}
        <div className="absolute left-5 top-[18px] flex gap-1.5">
          {SLIDES.map((_, n) => (
            <button key={n} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)}
              className="h-[7px] rounded-full transition-all"
              style={{ width: n === i % SLIDES.length ? 20 : 7, background: n === i % SLIDES.length ? TURQUOISE : "rgba(255,255,255,0.5)" }} />
          ))}
        </div>

        {/* caption */}
        <div className="absolute left-[18px] bottom-[18px]">
          <span className="inline-flex items-center gap-2 px-3 py-[7px] rounded-full bg-[#081129]/45 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold font-[Montserrat]">
            <span className="w-[7px] h-[7px] rounded-full" style={{ background: TURQUOISE }} />
            {slide.label}
          </span>
        </div>

        {/* rotating advert card — links to that category */}
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

      {/* small-print columns */}
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-6 pt-1.5">
        <h2 className="font-bold text-[22px] tracking-[-0.02em] text-[#081129] leading-[1.15] m-0 font-[Montserrat]">One price you<br />can actually trust.</h2>
        <p className="text-xs text-[#081129]/60 leading-[1.55] m-0 font-[Lato]">We pull live prices from accredited UK providers — Medichecks, Goodbody, Lola, Thriva and more — and line them up side by side. No markup, no hidden fees.</p>
        <p className="text-xs text-[#081129]/60 leading-[1.55] m-0 font-[Lato]">UKAS-accredited labs. CQC-regulated clinics. No GP referral needed. Results typically in 2–5 working days, by post or in clinic.</p>
      </div>
    </section>
  );
}
