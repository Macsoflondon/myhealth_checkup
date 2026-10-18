import { Reveal } from "@/components/primitives/Reveal";
import { HERO_CAPTION } from "@/components/sections/hero-slides";

interface TrustItem {
  label: string;
}

const trustItems: TrustItem[] = [
  { label: "UKAS-Accredited Labs" },
  { label: "CQC-Regulated Clinics" },
  { label: "ISO 15189 Certification" },
  { label: "GDPR Compliant" },
  { label: "Transparent Pricing" },
  { label: "No GP Referral Needed" },
];

const underlineColors = ["bg-brand-turquoise", "bg-brand-pink", "bg-brand-navy"];

/**
 * Trust signals bar — static standards row.
 */
const AccreditedProvidersBar = () => {
  return (
    <section
      aria-label="Accredited provider standards"
      className="bg-white border-t-2 border-t-brand-pink border-b-2 border-b-brand-turquoise"
    >
      <div className="container mx-auto px-5 sm:px-4 py-3 sm:py-4">
        <Reveal variant="fade">
          <p className="text-center font-heading font-semibold text-brand-navy text-lg md:text-2xl xl:text-3xl leading-tight mb-1 px-2">
            {HERO_CAPTION}
          </p>
        </Reveal>

        {/* Editorial standards header */}
        <div className="flex flex-col items-center mt-0 mb-3">
          <div className="text-[10px] font-bold uppercase text-brand-navy/40 mb-2">
            Our clinical standards
          </div>
          <div className="w-8 h-0.5 bg-brand-turquoise" />
        </div>

        {/* Underline grid — condensed spacing */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-3 sm:gap-y-4 gap-x-2 sm:gap-x-3"
          data-testid="accreditors-mobile-grid"
        >
          {trustItems.map((item, idx) => (
            <div key={item.label} className="min-w-0 lg:justify-self-center">
              <div
                className={`w-5 h-1 mb-1 rounded-full ${underlineColors[idx % underlineColors.length]}`}
              />
              <h3 className="text-[9px] sm:text-[10px] font-bold uppercase text-brand-navy leading-tight">
                {item.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
