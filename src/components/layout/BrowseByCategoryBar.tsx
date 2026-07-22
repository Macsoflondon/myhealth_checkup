/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
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
  Menu,
  X,
} from "lucide-react";
import {
  primaryNavigationItems,
  moreNavigationSections,
} from "@/components/header/NavigationItems";
import { MoreDropdownMenu } from "@/components/header/MoreDropdownMenu";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";
import { CategoryPillDropdown } from "@/components/layout/CategoryPillDropdown";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PINK = "#e70d69";
const TURQUOISE = "#22c0d4";

const ICONS: Record<string, { Icon: any; color: string }> = {
  "Most Popular Tests":   { Icon: Star,        color: PINK },
  "General Wellness":     { Icon: Heart,       color: TURQUOISE },
  "Women's Health":       { Icon: UserCheck,   color: PINK },
  "Men's Health":         { Icon: User,        color: "#3a5f85" },
  "Sports & Fitness":     { Icon: Dumbbell,    color: "#16a34a" },
  "Fertility - Prenatal": { Icon: Baby,        color: "#e70d69" },
  "Cancer Screening":     { Icon: ShieldCheck, color: "#0ea5e9" },
  "At Home":              { Icon: Home,        color: "#f59e0b" },
};

/**
 * Browse-by-category pill bar that doubles as the homepage sticky toolbar.
 * Uses native CSS `position: sticky` so the morph between in-flow and pinned
 * states is fully fluid in both scroll directions — no JS jumps, no flicker.
 *
 * Variants:
 *  - "card"  (default, homepage): rounded card with horizontal margins, caps the
 *            navy StatsBand below it; when stuck, becomes a fully-rounded pinned card.
 *  - "flush" (non-homepage): full-width edge-to-edge bar pinned at the top of the
 *            viewport from the start, no rounding.
 */
export default function BrowseByCategoryBar({
  variant = "card",
  compact = false,
  placement = "card",
  className = "",
}: {
  variant?: "card" | "flush";
  compact?: boolean;
  placement?: "card" | "hero";
  className?: string;
} = {}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  // Performant scroll detection using rAF; toggles mobile header colour theme.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);




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

  const isFlush = variant === "flush";

  // Wrapper margin / mt: compact mode sits flush inside the hero card, so
  // margins are removed. The "hero" placement is used when the bar sits
  // directly under the hero section as a separate sticky element; it keeps
  // the same horizontal margins as the hero card so the edges align.
  const wrapperClass =
    placement === "hero"
      ? "mt-0 mx-0"
      : compact
      ? "mt-0 mx-0"
      : isFlush
      ? "mt-4 mx-4 sm:mx-8 md:mx-14 lg:mx-16"
      : "mt-6 mx-4 sm:mx-8 md:mx-14 lg:mx-16";

  // Inner card styling. When the bar is part of the unified hero/toolbar/carousel
  // container (compact + placement="hero"), it sits in the middle of the stack:
  // no rounded corners, no top/bottom borders so it fuses with the hero above and
  // the carousel below. When stuck or on flush pages it becomes a fully rounded
  // pinned card.
  let innerClass = isFlush || stuck
    ? "rounded-[22px] bg-[#f7f7f8]/95 backdrop-blur-md border border-[#081129]/[0.08] shadow-[0_12px_30px_rgba(8,17,41,0.12)]"
    : "rounded-t-[22px] rounded-b-none bg-[#f7f7f8] border border-b-0 border-[#081129]/[0.06]";

  if (compact && !stuck && !isFlush) {
    innerClass = "rounded-none bg-[#F5F5F5] border-x border-[#081129]/[0.06]";
  }

  if (className) {
    innerClass = `${innerClass} ${className}`;
  }


  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {/* MOBILE: wordmark bar that morphs white → navy on scroll */}
      <div className="md:hidden sticky top-0 z-40" data-testid="browse-by-category-bar-mobile">
        <div
          data-scrolled={scrolled}
          className={`px-4 h-20 flex items-center justify-between transition-[background-color,border-color,box-shadow] duration-300 ease-out border-b ${
            scrolled
              ? "bg-[#081129] border-[#081129] shadow-[0_2px_10px_rgba(8,17,41,0.18)]"
              : "bg-white border-[#081129]/10"
          }`}
        >
          <Link
            to="/"
            aria-label="myhealth checkup home"
            className="flex items-center h-10 no-underline font-[Montserrat] font-extrabold tracking-tight text-[30px] leading-none"
          >
            <span
              className={`transition-colors duration-300 ease-out ${
                scrolled ? "text-white" : "text-[#081129]"
              }`}
            >
              myhealth
            </span>
            <span className="text-[#e70d69]">checkup</span>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                data-testid="category-hamburger"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-300 ease-out touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c0d4] focus-visible:ring-offset-2 ${
                  scrolled
                    ? "bg-white/10 hover:bg-white/20 active:bg-white/25 text-[#22c0d4] focus-visible:ring-offset-[#081129]"
                    : "bg-[#081129]/5 hover:bg-[#081129]/10 active:bg-[#081129]/15 text-[#22c0d4] focus-visible:ring-offset-white"
                }`}
              >
                <Menu className="w-6 h-6" strokeWidth={2.25} />
              </button>
            </SheetTrigger>


            <SheetContent
              side="right"
              className="w-[85vw] max-w-[340px] bg-[#f7f7f8] border-l border-[#081129]/10 p-0 flex flex-col"
            >
              <SheetHeader className="px-4 py-4 border-b border-[#081129]/10 text-left">
                <SheetTitle className="text-[#081129] text-base font-[Montserrat] font-semibold">
                  Browse categories
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Browse categories"
                className="px-3 py-4 overflow-y-auto flex-1"
                data-testid="mobile-category-sheet"
              >
                <div className="grid grid-cols-1 gap-2">
                  {items.map((item) => {
                    const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
                    const hasSubs = Boolean(item.hasDropdown && item.dropdownItems?.length);
                    const isExpanded = mobileExpanded === item.name;

                    return (
                      <div key={item.name} className="rounded-xl bg-white border-[1.5px] border-[#081129]/10 overflow-hidden">
                        <div className="flex items-stretch">
                          <Link
                            to={item.path}
                            data-testid="mobile-category-pill"
                            data-category={item.name}
                            onClick={() => setMobileOpen(false)}
                            className="group flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0 no-underline"
                          >
                            <span
                              className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
                              style={{ background: `${color}1a` }}
                            >
                              <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
                            </span>
                            <span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">
                              {item.name}
                            </span>
                          </Link>
                          {hasSubs && (
                            <button
                              type="button"
                              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.name} subcategories`}
                              aria-expanded={isExpanded}
                              onClick={() =>
                                setMobileExpanded((cur) => (cur === item.name ? null : item.name))
                              }
                              className="shrink-0 px-3 flex items-center justify-center border-l border-[#081129]/10 text-[#081129]/60 hover:text-[#081129] transition-colors"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          )}
                        </div>
                        {hasSubs && isExpanded && (
                          <ul className="border-t border-[#081129]/10 bg-[#f7f7f8] py-1">
                            {item.dropdownItems!.map((sub) => (
                              <li key={sub.path + sub.name}>
                                <Link
                                  to={sub.path}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-2.5 pl-14 pr-3 py-2 text-[13px] font-medium text-[#081129] font-[Montserrat] no-underline hover:bg-white transition-colors"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ background: color }}
                                  />
                                  <span className="truncate">{sub.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </nav>
              <div className="border-t border-[#081129]/10 px-4 py-4 bg-white space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#081129]/60 font-[Montserrat]">
                    Language
                  </span>
                  <div className="scale-110 origin-right">
                    <LanguageSwitcher variant="glass" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#081129]/60 font-[Montserrat]">
                    Account
                  </span>
                  <div className="scale-110 origin-right">
                    <UserMenu variant="glass" />
                  </div>
                </div>
              </div>

            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* DESKTOP: existing pill card layout */}
      <div className={`hidden md:block sticky top-0 z-40 ${wrapperClass}`} data-testid="browse-by-category-bar">
        <div
          className={`${compact ? "px-2 py-2 sm:px-3 sm:py-2.5" : "px-2 sm:px-3 py-2.5 sm:py-3"} transition-[background-color,box-shadow,border-color,border-radius,backdrop-filter] duration-300 ${innerClass}`}
        >
          <div className="flex items-center justify-center gap-x-1.5 gap-y-2 sm:gap-x-2 flex-wrap max-w-full">
            {/* Category pill strip participates in the same wrapping flow as More/account controls */}
            <div
              className="contents"
              data-testid="category-pill-strip"
            >
              {items.map((item) => {
                const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
                return (
                  <CategoryPillDropdown
                    key={item.name}
                    item={item}
                    color={color}
                    Icon={Icon}
                    compact={compact}
                  />
                );
              })}
            </div>

            {/* More dropdown */}
            <div ref={moreRef} className="relative shrink-0">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((o) => !o)}
                className={`inline-flex items-center rounded-full bg-white border-[1.5px] border-[#081129]/10 hover:-translate-y-0.5 transition-all duration-200 ${
                  compact ? "gap-0.5 pl-1 pr-1.5 py-0.5 sm:gap-1 sm:pl-1.5 sm:pr-2 sm:py-0.5" : "gap-1.5 pl-1.5 pr-2 sm:pl-2 sm:pr-2.5 py-1 sm:py-1.5"
                }`}
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
                  className={`rounded-full inline-flex items-center justify-center shrink-0 ${
                    compact ? "w-[15px] h-[15px] sm:w-[17px] sm:h-[17px]" : "w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                  }`}
                  style={{ background: `${PINK}1a` }}
                >
                  <MoreHorizontal className={`${compact ? "w-[9px] h-[9px] sm:w-[10px] sm:h-[10px]" : "w-[11px] h-[11px] sm:w-[12px] sm:h-[12px]"}`} style={{ color: PINK }} strokeWidth={2} />
                </span>
                <span className={`font-semibold text-[#081129] font-[Montserrat] ${compact ? "text-[9.5px] sm:text-[10.5px]" : "text-[11px] sm:text-[11.5px]"}`}>
                  More
                </span>
                <ChevronDown
                  className={`text-[#081129]/60 transition-transform ${moreOpen ? "rotate-180" : ""} ${compact ? "w-2.5 h-2.5" : "w-3 h-3"}`}
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

            {/* Right cluster — desktop */}
            <div
              className={`flex items-center shrink-0 ${compact ? "gap-0" : "gap-1"}`}
            >
              <div className={compact ? "scale-[0.78] origin-center" : ""}>
                <LanguageSwitcher />
              </div>
              <div className={compact ? "scale-[0.78] origin-center" : ""}>
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
