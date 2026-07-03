import React from "react";
import { ShieldCheck, BadgeCheck, FlaskConical, Lock, Tag, Stethoscope, type LucideIcon } from "lucide-react";
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
];

/**
 * Trust signals bar — unified provider-standards strip shown across the site.
 * Icons alternate between the turquoise/pink brand accents using design tokens.
 * Uses Reveal for a subtle staggered entrance.
 */
const AccreditedProvidersBar: React.FC = () => {
  return (
    <section
      aria-label="Accredited provider standards"
      className="bg-muted/40 border-b border-border/60"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <Reveal variant="fade">
          <p className="text-center font-sans font-bold uppercase tracking-[0.14em] text-[11px] text-muted-foreground mb-3">
            All listed providers meet every one of the following standards
          </p>
        </Reveal>

        <ul className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3">
          {trustItems.map((item, index) => {
            const isOdd = index % 2 === 0;
            const Icon = item.icon;
            return (
              <Reveal key={item.label} as="li" delay={index * 60} variant="rise">
                <div className="flex items-center gap-2.5 whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className={[
                      "flex items-center justify-center rounded-full w-9 h-9 shrink-0 transition-colors duration-standard",
                      isOdd
                        ? "bg-[hsl(var(--brand-turquoise)/0.12)] text-[hsl(var(--brand-turquoise))]"
                        : "bg-[hsl(var(--brand-pink)/0.1)] text-[hsl(var(--brand-pink))]",
                    ].join(" ")}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2.25} />
                  </span>
                  <span className="font-sans font-bold text-[13px] text-foreground">
                    {item.label}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
