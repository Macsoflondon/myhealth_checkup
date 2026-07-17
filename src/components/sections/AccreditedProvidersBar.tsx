import React from "react";
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


// Split into two rows so they can rotate at different offsets.
const rowA = trustItems.filter((_, i) => i % 2 === 0);
const rowB = trustItems.filter((_, i) => i % 2 === 1);

interface BadgePillProps {
  item: TrustItem;
  tone: "turquoise" | "pink";
}

const BadgePill: React.FC<BadgePillProps> = ({ item, tone }) => {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap px-3">
      <span
        aria-hidden="true"
        className={[
          "flex items-center justify-center rounded-full w-7 h-7 sm:w-9 sm:h-9 shrink-0",
          tone === "turquoise"
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
  );
};

interface MarqueeRowProps {
  items: TrustItem[];
  tone: "turquoise" | "pink";
  /** seconds for one full loop */
  duration: number;
  reverse?: boolean;
  /** horizontal offset in % so rows are staggered off-centre */
  offset?: string;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  items,
  tone,
  duration,
  reverse = false,
  offset = "0%",
}) => {
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden" data-testid="accreditors-row">
      <div style={{ transform: `translateX(${offset})` }}>
        <div
          className="flex w-max items-center animate-marquee"
          style={{
            animationDuration: `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {loop.map((item, i) => (
            <BadgePill key={`${item.label}-${i}`} item={item} tone={tone} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Trust signals bar — two-row marquee. The rows scroll in opposite directions
 * and start from staggered offsets so the badges never line up column-to-column.
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

        {/* Desktop & tablet: single static row, evenly distributed */}
        <div className="hidden md:flex items-center justify-between gap-4 lg:gap-6">
          {trustItems.map((item, i) => (
            <BadgePill key={item.label} item={item} tone={i % 2 === 0 ? "turquoise" : "pink"} />
          ))}
        </div>

        {/* Mobile: two-row marquee (unchanged) */}
        <div className="relative space-y-1.5 sm:space-y-2 md:hidden">
          <MarqueeRow items={rowA} tone="turquoise" duration={56} offset="0%" />
          <MarqueeRow items={rowB} tone="pink" duration={68} reverse offset="-12%" />

          {/* Edge fades on both sides */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-muted/60 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-muted/60 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
