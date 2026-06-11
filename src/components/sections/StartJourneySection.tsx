import { Link } from "react-router-dom";

const StartJourneySection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16">
      <div className="max-w-md sm:max-w-lg mx-auto px-4">
        <div className="relative bg-white rounded-3xl border border-slate-100 shadow-[0_8px_40px_-12px_rgba(8,17,41,0.12)] overflow-hidden">
          <div className="p-8 sm:p-10 flex flex-col items-center text-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-6 bg-slate-200" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
                Start Your Journey
              </span>
              <div className="h-px w-6 bg-slate-200" />
            </div>

            {/* Heading */}
            <h2 className="font-heading font-bold text-[#081129] leading-[1.15] tracking-tight text-2xl sm:text-3xl mb-3">
              Take Control of Your<br />Health Today
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xs mb-8">
              Compare trusted, accredited tests from leading UK providers in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col w-full gap-3 mb-8">
              <Link
                to="/assisted-test-finder"
                className="w-full h-12 inline-flex items-center justify-center bg-[#22c0d4] hover:bg-[#1da9bc] text-white font-semibold text-sm rounded-full shadow-[0_6px_20px_-6px_rgba(34,192,212,0.5)] hover:shadow-[0_8px_24px_-6px_rgba(34,192,212,0.6)] transition-all active:scale-[0.98]"
              >
                Find your test
              </Link>
              <Link
                to="/compare/goals"
                className="w-full h-12 inline-flex items-center justify-center bg-[#e70d69] hover:bg-[#c50a5a] text-white font-semibold text-sm rounded-full shadow-[0_6px_20px_-6px_rgba(231,13,105,0.45)] hover:shadow-[0_8px_24px_-6px_rgba(231,13,105,0.55)] transition-all active:scale-[0.98]"
              >
                Compare by goal
              </Link>
              <Link
                to="/compare"
                className="w-full h-12 inline-flex items-center justify-center bg-white border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold text-sm rounded-full transition-colors active:scale-[0.98]"
              >
                Browse all tests
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Trust Indicators
                </span>
                <div className="h-px w-6 bg-slate-200" />
              </div>
              <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c0d4]" />
                  <span className="text-[11px] sm:text-xs font-medium text-slate-600">Independent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e70d69]" />
                  <span className="text-[11px] sm:text-xs font-medium text-slate-600">CQC Regulated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#081129]" />
                  <span className="text-[11px] sm:text-xs font-medium text-slate-600">Typical 3–5 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Accent Bar */}
          <div className="h-1.5 w-full flex" aria-hidden="true">
            <div className="h-full flex-1 bg-[#22c0d4]" />
            <div className="h-full flex-1 bg-[#e70d69]" />
            <div className="h-full flex-1 bg-[#081129]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartJourneySection;
