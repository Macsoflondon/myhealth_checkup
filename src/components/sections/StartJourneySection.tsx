import { Link } from "react-router-dom";
import letterboxVideo from "@/assets/compare-screen-recording.mov.asset.json";
import LiveComparisonCard from "@/components/sections/LiveComparisonCard";


// ── Rotating test data ──────────────────────────────────────────────────────
const TESTS = [
  {
    name: "Full Blood Count Panel",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£59" }, { label: "Clinic-based", price: "£59" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£89" }, { label: "Clinic-based", price: "£99" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£59" }, { label: "Clinic-based", price: "£65" }] },
      { name: "London Medical Laboratory", options: [{ label: "Clinic-based", price: "£75" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£155" }, { label: "Clinic-based", price: "£129" }] },
    ],
  },
  {
    name: "Thyroid Health Panel",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£45" }, { label: "Clinic-based", price: "£89" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£102" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£59" }, { label: "Clinic-based", price: "£99" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£55" }, { label: "Clinic-based", price: "£69" }] },
      { name: "London Medical Laboratory", options: [{ label: "Clinic-based", price: "£79" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£139" }, { label: "Clinic-based", price: "£119" }] },
    ],
  },
  {
    name: "Cholesterol Panel",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£29" }, { label: "Clinic-based", price: "£55" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£59" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£39" }, { label: "Clinic-based", price: "£49" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£45" }, { label: "Clinic-based", price: "£55" }] },
      { name: "London Medical Laboratory", options: [{ label: "Clinic-based", price: "£59" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£119" }, { label: "Clinic-based", price: "£99" }] },
    ],
  },
  {
    name: "Hormone Panel",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£99" }, { label: "Clinic-based", price: "£159" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£155" }, { label: "Clinic-based", price: "£139" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£117" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£139" }, { label: "Clinic-based", price: "£169" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£89" }, { label: "Clinic-based", price: "£99" }] },
    ],
  },
  {
    name: "Vitamin D Test",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£29" }, { label: "Clinic-based", price: "£49" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£45" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£35" }, { label: "Clinic-based", price: "£45" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£39" }, { label: "Clinic-based", price: "£45" }] },
      { name: "London Medical Laboratory", options: [{ label: "Clinic-based", price: "£49" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£89" }, { label: "Clinic-based", price: "£75" }] },
    ],
  },
  {
    name: "Vitamin B12 Test",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£29" }, { label: "Clinic-based", price: "£49" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£42" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£35" }, { label: "Clinic-based", price: "£45" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£35" }, { label: "Clinic-based", price: "£45" }] },
      { name: "London Medical Laboratory", options: [{ label: "Clinic-based", price: "£45" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£85" }, { label: "Clinic-based", price: "£69" }] },
    ],
  },
];

const StartJourneySection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6">

        {/* ── ROW 1 — Take Control (full width, horizontal) ─────────────── */}
        <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_-20px_rgba(8,17,41,0.35),0_8px_24px_-8px_rgba(8,17,41,0.18)] ring-1 ring-slate-200/60 overflow-hidden mb-8 lg:mb-12 transition-transform duration-700 ease-out hover:-translate-y-1">
          <div className="p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">

            {/* Left: text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="h-px w-8 sm:w-12 bg-brand-pink" />
                <span className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] text-brand-turquoise">
                  Start Your Journey
                </span>
                <div className="h-px w-8 sm:w-12 bg-brand-pink" />
              </div>
              <h2 className="font-heading font-bold text-[#081129] leading-[1.15] tracking-tight text-3xl sm:text-[2.25rem] lg:text-[2.5rem] mb-3">
                Take Control of Your Health Today
              </h2>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Compare trusted, accredited tests from leading UK providers in minutes.
              </p>
            </div>

            {/* Right: CTAs side-by-side */}
            <div className="flex flex-col sm:flex-row lg:flex-row gap-3 lg:flex-shrink-0 lg:max-w-[640px] w-full lg:w-auto">
              <Link
                to="/assisted-test-finder"
                className="flex-1 h-[60px] inline-flex items-center justify-center px-6 bg-[#22c0d4] hover:bg-[#1da9bc] text-white font-semibold text-base rounded-full shadow-[0_8px_28px_-8px_rgba(34,192,212,0.5)] hover:shadow-[0_10px_32px_-8px_rgba(34,192,212,0.6)] transition-all active:scale-[0.98] whitespace-nowrap"
              >
                Find your test
              </Link>
              <Link
                to="/compare/goals"
                className="flex-1 h-[60px] inline-flex items-center justify-center px-6 bg-[#e70d69] hover:bg-[#c50a5a] text-white font-semibold text-base rounded-full shadow-[0_8px_28px_-8px_rgba(231,13,105,0.45)] hover:shadow-[0_10px_32px_-8px_rgba(231,13,105,0.55)] transition-all active:scale-[0.98] whitespace-nowrap"
              >
                Compare by goal
              </Link>
              <Link
                to="/compare"
                className="flex-1 h-[60px] inline-flex items-center justify-center px-6 bg-white border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold text-base rounded-full transition-colors active:scale-[0.98] whitespace-nowrap"
              >
                Browse all tests
              </Link>
            </div>
          </div>
        </div>

        {/* ── ROW 2 — Video + Live Comparison ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

          {/* LEFT — Letterbox video */}
          <div className="relative bg-[#081129] rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_-20px_rgba(8,17,41,0.35),0_8px_24px_-8px_rgba(8,17,41,0.18)] ring-1 ring-slate-200/60 overflow-hidden h-full min-h-[420px] transition-transform duration-700 ease-out hover:-translate-y-1">
            <video
              src={letterboxVideo.url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081129]/80 via-[#081129]/10 to-transparent pointer-events-none" />
            <div className="relative z-10 p-6 sm:p-8 md:p-10 h-full flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 sm:w-12 bg-brand-pink" />
                <span className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] text-brand-turquoise">
                  From Letterbox to Lab
                </span>
                <div className="h-px w-8 sm:w-12 bg-brand-pink" />
              </div>
              <h3 className="font-heading font-bold text-white text-2xl sm:text-3xl tracking-tight leading-tight">
                Convenient at-home test kits, delivered to your door.
              </h3>
              <p className="mt-2 text-sm sm:text-base text-white/75 leading-relaxed max-w-md">
                Collect your sample at home, post it back, and receive lab-verified results — all from accredited UK providers.
              </p>
            </div>
          </div>

          {/* RIGHT — Live Comparison */}
          <LiveComparisonCard panels={TESTS} rotateMs={60000} />

        </div>
      </div>
    </section>
  );
};

export default StartJourneySection;

