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
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
        <Reveal variant="fade">
          <p className="text-center font-sans font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[10px] sm:text-[11px] text-muted-foreground mb-2 sm:mb-3 px-2">
            All listed providers meet every one of the following standards
          </p>
        </Reveal>

        {/* Mobile: edge-faded horizontal scroller. sm+: wrap and center. */}
        <div className="relative -mx-3 sm:mx-0">
          <ul
            className="
              flex items-center gap-x-3 gap-y-2 overflow-x-auto scrollbar-hide
              snap-x snap-mandatory px-3 pb-1
              sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-3 sm:overflow-visible sm:px-0 sm:pb-0
            "
          >
            {trustItems.map((item, index) => {
              const isOdd = index % 2 === 0;
              const Icon = item.icon;
              return (
                <Reveal
                  key={item.label}
                  as="li"
                  delay={index * 50}
                  variant="rise"
                  className="snap-start shrink-0 sm:shrink"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap">
                    <span
                      aria-hidden="true"
                      className={[
                        "flex items-center justify-center rounded-full w-7 h-7 sm:w-9 sm:h-9 shrink-0 transition-colors duration-standard",
                        isOdd
                          ? "bg-[hsl(var(--turquoise)/0.12)] text-[hsl(var(--turquoise))]"
                          : "bg-[hsl(var(--pink)/0.1)] text-[hsl(var(--pink))]",
                      ].join(" ")}
                    >
                      <Icon className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px]" strokeWidth={2.25} />
                    </span>
                    <span className="font-sans font-bold text-[11px] sm:text-[13px] text-foreground">
                      {item.label}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </ul>
          {/* Edge fades (mobile only) */}
          <div className="sm:hidden pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-muted/40 to-transparent" />
          <div className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-muted/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
