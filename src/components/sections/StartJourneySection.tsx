import { Link } from "react-router-dom";

const StartJourneySection = () => {
  return (
    <div className="w-full bg-white py-8 sm:py-10 border-y border-brand-turquoise/20 shadow-[0_0_30px_-5px_rgba(34,192,212,0.15)]">
      <div className="max-w-3xl mx-auto px-4 flex flex-col text-center items-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
            Start Your Journey Today
          </span>
          <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-heading font-bold mb-4 text-[#081129]">
          Take Control of Your Health Today
        </h2>
        <p className="text-base lg:text-lg text-[#081129]/70 leading-relaxed mb-8 max-w-md">
          Compare trusted, accredited health tests from leading UK providers. Find the right test for your needs in
          minutes.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8 w-full max-w-lg">
          <Link
            to="/assisted-test-finder"
            className="min-w-0 bg-brand-turquoise hover:bg-brand-pink text-white font-semibold text-[11px] sm:text-sm px-2 sm:px-6 py-3 rounded-full transition-colors duration-200 text-center leading-tight"
          >
            Find your test
          </Link>
          <Link
            to="/compare/symptoms"
            className="min-w-0 bg-brand-pink hover:bg-brand-turquoise text-white font-semibold text-[11px] sm:text-sm px-2 sm:px-6 py-3 rounded-full transition-colors duration-200 text-center leading-tight"
          >
            Compare by symptom
          </Link>
          <Link
            to="/compare/goals"
            className="min-w-0 bg-brand-turquoise hover:bg-brand-pink text-white font-semibold text-[11px] sm:text-sm px-2 sm:px-6 py-3 rounded-full transition-colors duration-200 text-center leading-tight"
          >
            Compare by goal
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs sm:text-sm text-[#081129]/60">
          <span>✓ UKAS Accredited Labs</span>
          <span>✓ CQC Regulated</span>
          <span>✓ Free to Compare</span>
        </div>
      </div>
    </div>
  );
};

export default StartJourneySection;
