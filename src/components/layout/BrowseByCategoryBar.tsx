import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Star,
  Heart,
  UserCheck,
  User,
  Dumbbell,
  Baby,
  ShieldCheck,
  Home,
  MoreHorizontal,
} from "lucide-react";
import {
  primaryNavigationItems,
  moreNavigationSections,
} from "@/components/header/NavigationItems";
import { MoreDropdownMenu } from "@/components/header/MoreDropdownMenu";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";

const PINK = "#e70d69";
const TURQUOISE = "#22c0d4";

const ICONS: Record<string, { Icon: any; color: string }> = {
  "Most Popular Tests":   { Icon: Star,        color: PINK },
  "General Wellness":     { Icon: Heart,       color: TURQUOISE },
  "Women's Health":       { Icon: UserCheck,   color: PINK },
  "Men's Health":         { Icon: User,        color: "#3a5f85" },
  "Sports-Fitness Health":{ Icon: Dumbbell,    color: "#16a34a" },
  "Fertility - Prenatal": { Icon: Baby,        color: "#ec4899" },
  "Cancer Screening":     { Icon: ShieldCheck, color: "#0ea5e9" },
  "At Home Tests":        { Icon: Home,        color: "#f59e0b" },
};

/**
 * Browse-by-category pill bar that doubles as the homepage sticky toolbar.
 * Uses native CSS `position: sticky` so the morph between in-flow and pinned
 * states is fully fluid in both scroll directions — no JS jumps, no flicker.
 */
export default function BrowseByCategoryBar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  // Observe a sentinel placed immediately above the bar to detect stuck state.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(entry.intersectionRatio < 1 && entry.boundingClientRect.top < 0),
      { threshold: [1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Close "More" on outside click / ESC.
  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const items = primaryNavigationItems.filter((i) => i.name !== "How It Works");

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      <div className="sticky top-0 z-40">
        <div
          className={`rounded-[28px] px-6 sm:px-[30px] py-[18px] transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
            stuck
              ? "bg-[#f7f7f8]/95 backdrop-blur-md border border-[#081129]/[0.08] shadow-[0_12px_30px_rgba(8,17,41,0.12)]"
              : "bg-[#f7f7f8] border border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)]"
          }`}
        >
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] font-[Montserrat] text-[#081129]/50">
              Browse by category
            </span>
            <Link
              to="/test-categories"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#22c0d4] no-underline font-[Montserrat]"
            >
              View all <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="flex gap-2.5 flex-wrap items-center">
            {items.map((item) => {
              const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="group inline-flex items-center gap-2.5 pl-[11px] pr-[15px] py-[9px] rounded-full no-underline bg-white border-[1.5px] border-[#081129]/10 hover:-translate-y-0.5 transition-all duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.boxShadow = `0 8px 20px ${color}26`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(8,17,41,0.1)";
                    e.currentTarget.style.boxShadow = "0 1px 2px rgba(8,17,41,0.04)";
                  }}
                >
                  <span
                    className="w-[26px] h-[26px] rounded-full inline-flex items-center justify-center shrink-0"
                    style={{ background: `${color}1a` }}
                  >
                    <Icon className="w-[15px] h-[15px]" style={{ color }} strokeWidth={2} />
                  </span>
                  <span className="text-[13.5px] font-semibold text-[#081129] font-[Montserrat]">
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* More dropdown — matches pill design */}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((o) => !o)}
                className="inline-flex items-center gap-2 pl-[11px] pr-[13px] py-[9px] rounded-full bg-white border-[1.5px] border-[#081129]/10 hover:-translate-y-0.5 transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = PINK;
                  e.currentTarget.style.boxShadow = `0 8px 20px ${PINK}26`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(8,17,41,0.1)";
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(8,17,41,0.04)";
                }}
              >
                <span
                  className="w-[26px] h-[26px] rounded-full inline-flex items-center justify-center shrink-0"
                  style={{ background: `${PINK}1a` }}
                >
                  <MoreHorizontal className="w-[15px] h-[15px]" style={{ color: PINK }} strokeWidth={2} />
                </span>
                <span className="text-[13.5px] font-semibold text-[#081129] font-[Montserrat]">
                  More
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#081129]/60 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {moreOpen && (
                <MoreDropdownMenu
                  sections={moreNavigationSections}
                  onItemClick={() => setMoreOpen(false)}
                  onClose={() => setMoreOpen(false)}
                />
              )}
            </div>

            {/* Language + user — moved out of hero, ride with the toolbar */}
            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
