import { Link } from "react-router-dom";

const StartJourneySection = () => {
  return (
    <div className="w-full bg-white py-12 sm:py-16 border-y border-brand-turquoise/20 shadow-[0_0_30px_-5px_rgba(34,192,212,0.15)]">
      <div className="max-w-3xl mx-auto px-4 flex flex-col text-center items-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
            Start Your Journey Today
          </span>
          <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 text-[#081129]">
          Take Control of Your Health Today
        </h2>
        <p className="text-base lg:text-lg text-[#081129]/70 leading-relaxed mb-8 max-w-md">
          Compare trusted, accredited health tests from leading UK providers. Find the right test for your needs in
          minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 w-full max-w-lg">
          <Link
            to="/assisted-test-finder"
            className="bg-brand-turquoise hover:bg-brand-pink text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-full transition-colors duration-200 whitespace-nowrap text-center"
          >
            Find your test
          </Link>
          <Link
            to="/compare/symptoms"
            className="bg-brand-pink hover:bg-brand-turquoise text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-full transition-colors duration-200 whitespace-nowrap text-center"
          >
            Compare by symptom
          </Link>
          <Link
            to="/compare/goals"
            className="bg-brand-turquoise hover:bg-brand-pink text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-full transition-colors duration-200 whitespace-nowrap text-center"
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
