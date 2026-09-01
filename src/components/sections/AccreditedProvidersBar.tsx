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

const underlineColors = ["#22c0d4", "#e70d69", "#081129", "#22c0d4", "#e70d69", "#081129"];


/**
 * Trust signals bar — static standards row.
 */
const AccreditedProvidersBar = () => {
  return (
    <section
      aria-label="Accredited provider standards"
      className="bg-white border-b border-[#081129]/10 -mt-6 md:mt-0 pt-6 md:pt-0"
    >
      <div className="container mx-auto px-5 sm:px-4 py-1 sm:py-1.5">
        <Reveal variant="fade">
          <p className="hidden md:block text-center font-[Montserrat] font-semibold text-[#081129] text-[clamp(1.05rem,5vw,1.9rem)] sm:text-[clamp(1.3rem,3.4vw,2.65rem)] xl:text-[clamp(1.3rem,2.05vw,2rem)] xl:whitespace-nowrap leading-tight mb-0.5 px-4">
            {HERO_CAPTION}
          </p>
        </Reveal>

        {/* Editorial standards header */}
        <div className="flex flex-col items-center mb-1">
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#081129]/40 mb-1">
            Our clinical standards
          </div>
          <div className="w-8 h-[2px] bg-[#22c0d4]" />
        </div>

        {/* Underline grid — condensed spacing */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-1 gap-x-2 sm:gap-x-3"
          data-testid="accreditors-mobile-grid"
        >
          {trustItems.map((item, idx) => (
            <div key={item.label} className="group">
              <div
                className="w-6 h-1.5 mb-0.5 rounded-full"
                style={{ backgroundColor: underlineColors[idx % underlineColors.length] }}
              />
              <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#081129] leading-tight">
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
