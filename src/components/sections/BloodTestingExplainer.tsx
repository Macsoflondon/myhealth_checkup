import { Link } from "react-router-dom";
import bloodTestKit from "@/assets/blood-test-kit.jpg";
import healthResults from "@/assets/health-results.jpg";

const ResultsCard = () => (
  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-xl shadow-lg p-4 w-56">
    <p className="text-xs font-semibold text-[hsl(var(--brand-navy))] mb-1">Testosterone</p>
    <p className="text-lg font-bold text-[hsl(var(--brand-navy))]">18.2 <span className="text-xs font-normal text-muted-foreground">nmol/L</span></p>
    <div className="mt-2 h-2 rounded-full bg-gradient-to-r from-[hsl(var(--brand-turquoise))] via-green-400 to-[hsl(var(--brand-pink))]" />
    <div className="flex justify-between mt-1">
      <span className="text-[10px] text-muted-foreground">Low</span>
      <span className="text-[10px] font-semibold text-green-600">Normal</span>
      <span className="text-[10px] text-muted-foreground">High</span>
    </div>
  </div>
);

const BloodTestingExplainer = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#f5f3ef]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Row 1: Text left, Image right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
          <div className="space-y-5">
            <p className="text-[hsl(var(--brand-turquoise))] uppercase text-xs font-semibold tracking-[0.25em]">
              Your shortcut to smarter health
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[hsl(var(--brand-navy))] leading-tight">
              What can blood testing do for me?
            </h2>
            <p className="text-muted-foreground font-sans leading-relaxed">
              A simple blood test can reveal what's really going on inside your body — from vitamin levels and hormone balance to cholesterol, thyroid function, and early markers for serious conditions. It's one of the most effective ways to take control of your health before symptoms appear.
            </p>
            <Link
              to="/assisted-test-finder"
              className="inline-block border-2 border-[hsl(var(--brand-navy))] text-[hsl(var(--brand-navy))] font-semibold px-8 py-3 rounded-lg hover:bg-[hsl(var(--brand-turquoise))] hover:border-[hsl(var(--brand-turquoise))] hover:text-white transition-all duration-300"
            >
              Find your test
            </Link>
          </div>
          <div className="relative">
            <img
              src={bloodTestKit}
              alt="Professional blood test collection kit with sample tubes"
              className="rounded-xl shadow-md w-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Row 2: Image left, Text right (reversed on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative md:order-1">
            <img
              src={healthResults}
              alt="Woman reviewing her health test results on a tablet"
              className="rounded-xl shadow-md w-full object-cover aspect-[4/3]"
              loading="lazy"
            />
            <ResultsCard />
          </div>
          <div className="space-y-5 md:order-2">
            <p className="text-[hsl(var(--brand-turquoise))] uppercase text-xs font-semibold tracking-[0.25em]">
              Quick, simple, secure
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[hsl(var(--brand-navy))] leading-tight">
              How does it work?
            </h2>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Choose from hundreds of accredited tests, collect your sample at home or visit a nearby clinic, and receive your results securely online — often within days. We compare trusted UK providers so you can find the right test at the right price, with full transparency on what's included.
            </p>
            <Link
              to="/how-it-works"
              className="inline-block border-2 border-[hsl(var(--brand-navy))] text-[hsl(var(--brand-navy))] font-semibold px-8 py-3 rounded-lg hover:bg-[hsl(var(--brand-turquoise))] hover:border-[hsl(var(--brand-turquoise))] hover:text-white transition-all duration-300"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BloodTestingExplainer;
