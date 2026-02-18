import { Link } from "react-router-dom";

const BloodTestingExplainer = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#f5f3ef]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Row 1: Text left, Video right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
          <div className="space-y-5">
            <p className="text-[hsl(var(--brand-turquoise))] uppercase text-xs font-semibold tracking-[0.25em]">
              Trusted UK Provider
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[hsl(var(--brand-navy))] leading-tight">
              Know more.<br />Live Better.
            </h2>
            <p className="text-muted-foreground font-sans leading-relaxed">
              GoodBody Clinics, provide comprehensive private health checks at affordable prices.
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Visit one of over 200 nationwide locations, or opt for their convenient home testing service. GoodBody Clinics has got you covered, Regulated by the CQC and only exclusively utilise UKAS-accredited laboratories for our analysis.
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Providing you with a comprehensive GP review of your results and featuring over 60 different blood and wellness tests for you to choose from. They offer a blend of clinical precision and convenient high-street accessibility.
            </p>
            <Link
              to="/provider/goodbody-clinic"
              className="inline-block border-2 border-[hsl(var(--brand-navy))] text-[hsl(var(--brand-navy))] font-semibold px-8 py-3 rounded-lg hover:bg-[hsl(var(--brand-turquoise))] hover:border-[hsl(var(--brand-turquoise))] hover:text-white transition-all duration-300"
            >
              View GoodBody tests
            </Link>
          </div>
          <div className="relative">
            <video
              src="/videos/goodbody-promo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-xl shadow-md w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>

        {/* Row 2: Image left, Text right (reversed on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative md:order-1">
            <video
              src="/videos/medichecks-promo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-xl shadow-md w-full object-cover aspect-[4/3]"
            />
          </div>
          <div className="space-y-5 md:order-2">
            <p className="text-[hsl(var(--brand-turquoise))] uppercase text-xs font-semibold tracking-[0.25em]">
              Trusted UK Provider
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[hsl(var(--brand-navy))] leading-tight">
              Medichecks
            </h2>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Medichecks provide private blood tests and health checks designed for clarity, speed, and clinical accuracy.
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Choose from convenient at home testing kits or attend a nationwide network of partner clinics. All samples are analysed by UKAS accredited laboratories, with services delivered through CQC regulated clinical partners.
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Results include a clear GP reviewed report, helping you understand your biomarkers and take informed next steps.
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Medichecks combine medical rigour with flexible access, offering a wide range of blood and wellness tests across hormones, nutrition, heart health, and preventative screening.
            </p>
            <Link
              to="/medichecks"
              className="inline-block border-2 border-[hsl(var(--brand-navy))] text-[hsl(var(--brand-navy))] font-semibold px-8 py-3 rounded-lg hover:bg-[hsl(var(--brand-turquoise))] hover:border-[hsl(var(--brand-turquoise))] hover:text-white transition-all duration-300"
            >
              View Medichecks tests
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BloodTestingExplainer;
