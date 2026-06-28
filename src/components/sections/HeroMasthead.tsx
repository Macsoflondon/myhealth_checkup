import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ── Brand ─────────────────────────────────────────────────────────────
const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const NAVY = "#081129";

interface HeroMastheadProps {
  rotateMs?: number;
}

const PROVIDERS = [
  "Medichecks",
  "Randox Health",
  "Thriva",
  "Lola Health",
  "Goodbody Clinic",
  "London Medical Laboratory",
  "Clinilabs",
  "London Health Company",
];

const CARDS = [
  { icon: "🩸", title: "Blood Tests", sub: "500+ tests from £29", to: "/tests/blood" },
  { icon: "🎗️", title: "Cancer Screening", sub: "Early detection panels", to: "/cancer-screening" },
  { icon: "⚡", title: "Wellness Panels", sub: "Full body MOT from £89", to: "/tests/wellness" },
  { icon: "🧬", title: "Hormone Tests", sub: "Men's & Women's health", to: "/hormones" },
];

const AVATARS = [
  { initial: "M", bg: "#22c0d4" },
  { initial: "R", bg: "#e70d69" },
  { initial: "T", bg: "#0a7a87" },
  { initial: "L", bg: "#22c0d4" },
  { initial: "G", bg: "#c40a59" },
];

export default function HeroMasthead({ rotateMs: _rotateMs }: HeroMastheadProps = {}) {
  return (
    <section
      className="relative overflow-hidden rounded-t-[28px] rounded-b-none border border-b-0 border-white/5 shadow-[0_30px_80px_rgba(8,17,41,0.10)]"
      style={{ background: NAVY }}
    >
      {/* Inline keyframes for staggered card entrance + marquee */}
      <style>{`
        @keyframes hero-card-in {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hero-card-anim { opacity: 0; animation: hero-card-in 0.7s ease-out forwards; }
        .hero-marquee-track { animation: hero-marquee 30s linear infinite; }
      `}</style>

      {/* Radial glow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(34,192,212,0.18) 0%, transparent 60%)",
        }}
      />

      {/* Main hero split */}
      <div className="relative px-5 sm:px-8 md:px-12 pt-10 sm:pt-14 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-12 items-center">
          {/* LEFT — content */}
          <div className="text-white">
            {/* Urgency pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-[Montserrat] font-semibold text-white"
              style={{
                background: "#0D1838",
                border: `1px solid ${TURQUOISE}`,
              }}
            >
              <span aria-hidden>🔬</span>
              Comparing 1,000+ private health tests across 9 accredited UK providers
            </div>

            {/* Headline */}
            <h1 className="mt-6 font-bold font-[Montserrat] tracking-[-0.02em] leading-[0.95] text-5xl md:text-7xl">
              <span className="block text-white">Compare Private Health Tests.</span>
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${TURQUOISE} 0%, ${PINK} 100%)`,
                }}
              >
                Take Control.
              </span>
            </h1>

            {/* Subhead */}
            <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
              The UK's independent comparison platform for private blood tests,
              cancer screening, and wellness diagnostics. UKAS-accredited
              providers. Transparent pricing.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-white font-semibold font-[Montserrat] transition-colors"
                style={{ background: PINK }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#c40a59")}
                onMouseLeave={(e) => (e.currentTarget.style.background = PINK)}
              >
                Compare Tests <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center rounded-full px-8 py-4 font-semibold font-[Montserrat] text-white border border-white/60 hover:bg-white/10 transition-colors"
              >
                How It Works
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {AVATARS.map((a, idx) => (
                  <div
                    key={idx}
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white font-[Montserrat]"
                    style={{ background: a.bg, borderColor: NAVY }}
                  >
                    {a.initial}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-300">
                Trusted by <span className="text-white font-semibold">12,400+</span> health-conscious UK adults
              </p>
            </div>
          </div>

          {/* RIGHT — 2x2 card grid */}
          <div className="grid grid-cols-2 gap-4">
            {CARDS.map((c, idx) => (
              <Link
                key={c.title}
                to={c.to}
                className="hero-card-anim group rounded-2xl p-5 border border-l-2 transition-all hover:-translate-y-1 hover:border-l-[3px]"
                style={{
                  background: "#0D1838",
                  borderColor: "#1C2E4A",
                  borderLeftColor: TURQUOISE,
                  animationDelay: `${idx * 150}ms`,
                }}
              >
                <div className="text-3xl mb-3" aria-hidden>{c.icon}</div>
                <div className="text-white font-bold font-[Montserrat] text-lg leading-tight">
                  {c.title}
                </div>
                <div className="mt-1 text-sm text-gray-400">{c.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Provider logo carousel */}
      <div className="relative border-t border-white/5" style={{ background: "#050D1F" }}>
        <div className="px-5 sm:px-8 md:px-12 pt-6 pb-2 text-center">
          <span className="text-[11px] tracking-[0.22em] text-gray-500 font-[Montserrat] font-semibold uppercase">
            Accredited Provider Partners
          </span>
        </div>
        <div className="relative overflow-hidden py-5">
          {/* edge fades */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
            style={{ background: "linear-gradient(to right, #050D1F, transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
            style={{ background: "linear-gradient(to left, #050D1F, transparent)" }}
          />
          <div className="hero-marquee-track flex gap-12 whitespace-nowrap w-max">
            {[...PROVIDERS, ...PROVIDERS].map((name, idx) => (
              <span
                key={`${name}-${idx}`}
                className="text-gray-400 hover:text-white transition-colors text-base sm:text-lg font-[Montserrat] font-semibold tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
