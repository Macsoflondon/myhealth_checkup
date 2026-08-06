import React from "react";
import { Link } from "@/lib/router-compat";
import { AT_HOME_SECTIONS } from "@/config/atHomeSections";

interface AtHomeSectionGridProps {
  /** Live test count per section slug. */
  counts: Record<string, number>;
}

/**
 * Landing grid for /at-home-tests — one card per category section, each deep
 * linking into the filtered listing via `?subcategory=`.
 */
export const AtHomeSectionGrid: React.FC<AtHomeSectionGridProps> = ({ counts }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {AT_HOME_SECTIONS.filter((section) => (counts[section.slug] ?? 0) > 0).map((section) => {
      const count = counts[section.slug] ?? 0;
      return (
        <Link
          key={section.slug}
          to={`/at-home-tests?subcategory=${section.slug}`}
          className="group relative block rounded-2xl bg-white border border-black/[0.06] p-7 shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
        >
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
            className="block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors"
            style={{
              color: section.accent,
              backgroundColor: `${section.accent}12`,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: `${section.accent}33`,
            }}
          >
            View kits
          </span>
        </Link>
      );
    })}
  </div>
);
