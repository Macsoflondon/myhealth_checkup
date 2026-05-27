import { Shield, FlaskConical, MapPin, Clock, Stethoscope, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrustSignal = { icon: LucideIcon; text: string };

interface TrustSignalsBarProps {
  items?: TrustSignal[];
  className?: string;
}

const DEFAULT_ITEMS: TrustSignal[] = [
  { icon: Shield, text: "UKAS-accredited labs" },
  { icon: FlaskConical, text: "200+ tests available" },
  { icon: MapPin, text: "Clinics nationwide" },
  { icon: Clock, text: "Results in 3–5 days" },
  { icon: Stethoscope, text: "No GP referral needed" },
];

const TrustSignalsBar = ({ items = DEFAULT_ITEMS, className }: TrustSignalsBarProps) => {
  return (
    <div
      className={cn(
        "bg-white py-2 sm:py-3 px-2 sm:px-4 border-b border-border overflow-x-auto scrollbar-hide",
        className,
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-x-4 sm:gap-x-7 lg:gap-x-10 flex-nowrap">
          {items.map((signal, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 leading-none whitespace-nowrap"
            >
              <signal.icon className="w-4 h-4 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <span className="text-primary font-extrabold text-[11px] sm:text-xl leading-none">
                {signal.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSignalsBar;
