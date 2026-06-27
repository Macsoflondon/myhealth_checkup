import { Hospital, FlaskConical, ShieldCheck, Scale } from "lucide-react";

/**
 * Global trust bar — sits below the BrowseByCategoryBar / hero.
 * Four signals communicating clinical authority at-a-glance.
 */
const ITEMS = [
  { Icon: Hospital, label: "CQC Regulated Providers" },
  { Icon: FlaskConical, label: "UKAS Accredited Labs" },
  { Icon: ShieldCheck, label: "Your Data Never Shared" },
  { Icon: Scale, label: "Independent Comparison" },
];

export const TrustBar = () => {
  return (
    <div
      className="w-full border-y border-border bg-[#FAFAF8]"
      role="region"
      aria-label="Platform trust signals"
    >
      <div className="container-clinical mx-auto px-4 sm:px-6">
        <ul className="flex items-center justify-start sm:justify-around gap-5 sm:gap-8 overflow-x-auto scrollbar-hide py-2.5">
          {ITEMS.map(({ Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 shrink-0 whitespace-nowrap"
            >
              <Icon
                className="h-4 w-4 shrink-0 text-brand-navy/70"
                aria-hidden="true"
              />
              <span
                className="text-[12px] sm:text-[13px] font-medium text-brand-navy/80"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrustBar;
