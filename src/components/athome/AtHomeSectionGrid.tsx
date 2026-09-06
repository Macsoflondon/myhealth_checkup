import React, { useState } from "react";
import { Link } from "@/lib/router-compat";
import { AT_HOME_SECTIONS } from "@/config/atHomeSections";

interface AtHomeSectionGridProps {
  /** Live test count per section slug. */
  counts: Record<string, number>;
}

/**
 * Landing grid for /at-home-tests — one card per category section, each deep
 * linking into the filtered listing via `?subcategory=`. Card styling mirrors
 * the General Wellness (/wellness) landing grid for a uniform look.
 */
export const AtHomeSectionGrid: React.FC<AtHomeSectionGridProps> = ({ counts }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {AT_HOME_SECTIONS.filter((section) => (counts[section.slug] ?? 0) > 0).map((section) => {
        const count = counts[section.slug] ?? 0;
        const isHov = hovered === section.slug;
        return (
          <Link
            key={section.slug}
            to={`/at-home-tests?subcategory=${section.slug}`}
            onMouseEnter={() => setHovered(section.slug)}
            onMouseLeave={() => setHovered(null)}
            className="group relative block overflow-hidden rounded-[20px] bg-white px-7 pt-7 pb-6 shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: isHov ? `${section.accent}50` : "rgba(0,0,0,0.06)",
            }}
          >
            {/* Accent glow on hover */}
            {isHov && (
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${section.accent}80, transparent)`,
                }}
              />
            )}

            <div className="flex items-start justify-between mb-5">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-[14px] text-[22px] transition-transform duration-300 group-hover:scale-105"
                style={{
                  color: section.accent,
                  backgroundColor: `${section.accent}10`,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: `${section.accent}40`,
                }}
                aria-hidden="true"
              >
                {section.icon}
              </span>
              <span className="text-xs font-medium text-[#1b1f3b]">
                {count} {count === 1 ? "kit" : "kits"}
              </span>
            </div>

            <h3 className="mb-2.5 font-heading text-xl font-bold tracking-tight text-[#060b18]">
              {section.label}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-[#060b18]/75">{section.desc}</p>

            <span
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold tracking-[0.06em] transition-all duration-300"
              style={{
                color: section.accent,
                background: `linear-gradient(135deg, ${section.accent}20, ${section.accent}10)`,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: section.accent,
              }}
            >
              View kits
              <span
                className={`inline-block transition-transform duration-300 ${
                  isHov ? "translate-x-1" : ""
                }`}
              >
                →
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
};
