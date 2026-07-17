import { useEffect, useRef } from "react";
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
 * Trust signals bar — single-row auto-scrolling carousel of all standards.
 * Pauses on hover.
 */
const AccreditedProvidersBar = () => {
  // Duplicate items so the -50% translate loops seamlessly.
  const loop = [...trustItems, ...trustItems];
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId = 0;
    let lastTime = 0;
    let position = 0;
    let singleSetWidth = 0;

    const measureSetWidth = () => {
      singleSetWidth = Array.from(track.children)
        .slice(0, trustItems.length)
        .reduce((total, child) => total + (child as HTMLElement).getBoundingClientRect().width, 0);
    };

    const animate = (timestamp: number) => {
      animationId = requestAnimationFrame(animate);

      if (document.hidden || pausedRef.current) {
        lastTime = 0;
        return;
      }

      if (lastTime === 0) {
        lastTime = timestamp;
        return;
      }

      const delta = Math.min(timestamp - lastTime, 50);
      lastTime = timestamp;

      if (singleSetWidth <= 0) measureSetWidth();
      position -= 0.045 * delta;

      if (singleSetWidth > 0 && Math.abs(position) >= singleSetWidth) {
        position += singleSetWidth;
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;
    };

    measureSetWidth();
    document.fonts?.ready?.then(measureSetWidth).catch(() => undefined);

    const resizeObserver = new ResizeObserver(measureSetWidth);
    resizeObserver.observe(track);

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

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
          className="relative overflow-hidden"
          data-testid="accreditors-carousel"
        >
          <div
            ref={trackRef}
            className="mhc-standards-carousel flex w-max items-center"
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
          >
            {loop.map((item, i) => (
              <BadgePill
                key={`${item.label}-${i}`}
                item={item}
                tone={i % 2 === 0 ? "turquoise" : "pink"}
              />
            ))}
          </div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-[#081129] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[#081129] to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default AccreditedProvidersBar;
