import { ShieldCheck, BadgeCheck, FlaskConical, Lock, Tag, Stethoscope, EyeOff, Star, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/primitives/Reveal";

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
  { icon: EyeOff, label: "Data Never Shared" },
  { icon: Star, label: "Trusted Comparison" },
];

interface BadgePillProps {
  item: TrustItem;
  tone: "turquoise" | "pink";
}

const BadgePill = ({ item, tone }: BadgePillProps) => {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap px-3 md:px-4 lg:px-5">
      <span
        aria-hidden="true"
        className={[
          "flex items-center justify-center rounded-full w-7 h-7 sm:w-9 sm:h-9 shrink-0",
          tone === "turquoise"
            ? "bg-[hsl(var(--turquoise)/0.18)] text-[hsl(var(--turquoise))]"
            : "bg-[hsl(var(--pink)/0.16)] text-[hsl(var(--pink))]",
        ].join(" ")}
      >
        <Icon className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px]" strokeWidth={2.25} />
      </span>
      <span className="font-sans font-bold text-[11px] sm:text-[13px] text-white">
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
      className="bg-[#081129] border-b border-white/10"
    >
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
        <Reveal variant="fade">
          <p className="text-center font-sans font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[10px] sm:text-[11px] text-white/80 mb-2 sm:mb-3 px-2">
            All listed providers meet every one of the following standards
          </p>
        </Reveal>

        <div
          className="flex flex-wrap items-center justify-center gap-y-3 lg:flex-nowrap"
          data-testid="accreditors-static-row"
        >
          {trustItems.map((item, i) => (
            <BadgePill
              key={item.label}
              item={item}
              tone={i % 2 === 0 ? "turquoise" : "pink"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
