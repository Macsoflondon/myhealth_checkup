import { ShieldCheck, BadgeCheck, FlaskConical, Lock, Tag, Stethoscope, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";
import { HERO_CAPTION } from "@/components/sections/hero-slides";

interface TrustItem {
  icon: LucideIcon;
  label: string;
}

const trustItems: TrustItem[] = [
  { icon: FlaskConical, label: "UKAS-Accredited Labs" },
  { icon: ShieldCheck, label: "CQC-Regulated Clinics" },
  { icon: BadgeCheck, label: "ISO 15189 Certification" },
  { icon: Lock, label: "GDPR Compliant" },
  { icon: Tag, label: "Transparent Pricing" },
  { icon: Stethoscope, label: "No GP Referral Needed" },
];

const underlineColors = ["#22c0d4", "#e70d69", "#081129", "#22c0d4", "#e70d69", "#081129"];

interface BadgePillProps {
  item: TrustItem;
}

const BadgePill = ({ item }: BadgePillProps) => {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap lg:px-5">
      <span
        aria-hidden="true"
        className="flex items-center justify-center rounded-full w-7 h-7 sm:w-9 sm:h-9 shrink-0 bg-[hsl(var(--trust-tone)/var(--trust-tone-alpha))] text-[hsl(var(--trust-tone))]"
      >
        <Icon className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px]" strokeWidth={2.25} />
      </span>
      <span className="font-sans font-bold text-[11px] sm:text-[13px] text-[#081129]">
        {item.label}
      </span>
    </div>
  );
};

/**
 * Trust signals bar — static standards row.
 */
const AccreditedProvidersBar = () => {
  return (
    <section
      aria-label="Accredited provider standards"
      className="bg-white border-b border-[#081129]/10 -mt-6 md:mt-0 pt-6 md:pt-0"
    >
      <div className="container mx-auto px-5 sm:px-4 py-4 sm:py-3">
        <Reveal variant="fade">
          <p className="hidden md:block text-center font-[Montserrat] font-semibold text-[#081129] text-[clamp(1.05rem,5vw,1.9rem)] sm:text-[clamp(1.3rem,3.4vw,2.65rem)] xl:text-[clamp(1.3rem,2.05vw,2rem)] xl:whitespace-nowrap leading-tight mb-1 sm:mb-2 px-4">
            {HERO_CAPTION}
          </p>
        </Reveal>

        {/* Editorial standards header */}
        <div className="flex flex-col items-center mb-3">
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#081129]/40 mb-2">
            Our clinical standards
          </div>
          <div className="w-8 h-[2px] bg-[#22c0d4]" />
        </div>

        {/* Underline grid — same treatment at every breakpoint */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-4 sm:gap-x-6"
          data-testid="accreditors-mobile-grid"
        >
          {trustItems.map((item, idx) => (
            <div key={item.label} className="group">
              <div
                className="w-6 h-1.5 mb-2 rounded-full"
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
