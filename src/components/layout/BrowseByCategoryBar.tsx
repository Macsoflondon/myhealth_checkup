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
  "Sports-Fitness Health":{ Icon: Dumbbell,    color: "#16a34a" },
  "Fertility - Prenatal": { Icon: Baby,        color: "#ec4899" },
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

  const isFlush = variant === "flush";

  // Wrapper margin / mt: compact mode sits flush inside the hero card, so
  // margins are removed. The "hero" placement is used when the bar sits
  // directly under the hero section as a separate sticky element; it keeps
  // the same horizontal margins as the hero card so the edges align.
  const wrapperClass =
    placement === "hero"
      ? "mt-0 mx-4 sm:mx-8 md:mx-14 lg:mx-16"
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
      <div className={`sticky top-0 z-40 ${wrapperClass}`} data-testid="browse-by-category-bar">
        <div
          className={`${compact ? "px-3 py-3 sm:py-4" : "px-2 sm:px-3 py-2.5 sm:py-3"} transition-[background-color,box-shadow,border-color,border-radius,backdrop-filter] duration-300 ${innerClass}`}
        >

          <div className={`flex items-center gap-2 flex-nowrap ${compact ? "justify-center" : ""}`}>
            {/* Mobile: hamburger that opens a category sheet */}
            <div className="flex md:hidden items-center shrink-0">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    data-testid="category-hamburger"
                    aria-label="Browse categories"
                    aria-expanded={mobileOpen}
                    className={`inline-flex items-center rounded-full bg-white border-[1.5px] border-[#081129]/10 hover:-translate-y-0.5 transition-all duration-200 ${
                      compact ? "gap-1 pl-1 pr-1.5 py-0.5" : "gap-1.5 pl-1.5 pr-2 py-1"
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
                        compact ? "w-[16px] h-[16px]" : "w-[18px] h-[18px]"
                      }`}
                      style={{ background: `${PINK}1a` }}
                    >
                      <Menu className={`${compact ? "w-[10px] h-[10px]" : "w-[11px] h-[11px]"}`} style={{ color: PINK }} strokeWidth={2} />
                    </span>
                    <span className={`font-semibold text-[#081129] font-[Montserrat] ${compact ? "text-[10px]" : "text-[11px]"}`}>
                      Browse
                    </span>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[85vw] max-w-[320px] bg-[#f7f7f8] border-r border-[#081129]/10 p-0"
                >
                  <SheetHeader className="px-4 py-4 border-b border-[#081129]/10 text-left">
                    <SheetTitle className="text-[#081129] text-base font-[Montserrat] font-semibold">
                      Browse categories
                    </SheetTitle>
                  </SheetHeader>
                  <nav
                    aria-label="Browse categories"
                    className="px-3 py-4 overflow-y-auto max-h-[calc(100dvh-80px)]"
                    data-testid="mobile-category-sheet"
                  >
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item) => {
                        const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
                        return (
                          <Link
                            key={item.name}
                            to={item.path}
                            data-testid="mobile-category-pill"
                            data-category={item.name}
                            onClick={() => setMobileOpen(false)}
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border-[1.5px] border-[#081129]/10 hover:-translate-y-0.5 transition-all duration-200 no-underline"
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
                              className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
                              style={{ background: `${color}1a` }}
                            >
                              <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
                            </span>
                            <span className="text-sm font-semibold text-[#081129] font-[Montserrat]">
                              {item.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Scrollable pill strip — only this zone scrolls (desktop only) */}
            <div
              className={`hidden md:flex min-w-0 overflow-x-auto scrollbar-none items-center flex-nowrap ${compact ? "gap-2 justify-center" : "flex-1 gap-1.5"}`}
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, #000 0, #000 calc(100% - 16px), transparent 100%)",
                maskImage:
                  "linear-gradient(to right, #000 0, #000 calc(100% - 16px), transparent 100%)",
              }}
              data-testid="category-pill-strip"
            >
              {items.map((item) => {
                const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    data-testid="category-pill"
                    data-category={item.name}
                    className={`group inline-flex items-center rounded-full no-underline bg-white border-[1.5px] border-[#081129]/10 hover:-translate-y-0.5 transition-all duration-200 shrink-0 ${
                      compact ? "gap-2 pl-2 pr-3 py-1.5 sm:pl-2.5 sm:pr-3.5 sm:py-2" : "gap-1.5 pl-1.5 pr-2 sm:pl-2 sm:pr-2.5 py-1 sm:py-1.5"
                    }`}
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
                      className={`rounded-full inline-flex items-center justify-center shrink-0 ${
                        compact ? "w-[22px] h-[22px] sm:w-[26px] sm:h-[26px]" : "w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                      }`}
                      style={{ background: `${color}1a` }}
                    >
                      <Icon className={`${compact ? "w-[13px] h-[13px] sm:w-[15px] sm:h-[15px]" : "w-[11px] h-[11px] sm:w-[12px] sm:h-[12px]"}`} style={{ color }} strokeWidth={2} />
                    </span>
                    <span className={`font-semibold text-[#081129] font-[Montserrat] whitespace-nowrap ${compact ? "text-[13px] sm:text-[15px] md:text-base" : "text-[11px] sm:text-[11.5px]"}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* More dropdown — pinned, never scrolls away */}
            <div ref={moreRef} className="relative shrink-0">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((o) => !o)}
                className={`inline-flex items-center rounded-full bg-white border-[1.5px] border-[#081129]/10 hover:-translate-y-0.5 transition-all duration-200 ${
                  compact ? "gap-1 pl-1 pr-1.5 py-0.5 sm:pl-1.5 sm:pr-2 sm:py-1" : "gap-1.5 pl-1.5 pr-2 sm:pl-2 sm:pr-2.5 py-1 sm:py-1.5"
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
                    compact ? "w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" : "w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                  }`}
                  style={{ background: `${PINK}1a` }}
                >
                  <MoreHorizontal className={`${compact ? "w-[10px] h-[10px] sm:w-[11px] sm:h-[11px]" : "w-[11px] h-[11px] sm:w-[12px] sm:h-[12px]"}`} style={{ color: PINK }} strokeWidth={2} />
                </span>
                <span className={`font-semibold text-[#081129] font-[Montserrat] ${compact ? "text-[10px] sm:text-[11px]" : "text-[11px] sm:text-[11.5px]"}`}>
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

            {/* Right cluster — mobile: unified soft-pink glass pill; desktop: existing bordered chips */}
            <div
              data-testid="category-bar-right-cluster"
              className={`md:hidden flex items-center bg-[#e70d69]/5 border border-[#e70d69]/10 rounded-full shrink-0 ml-1 ${compact ? "p-[1px]" : "p-0.5"}`}
            >
              <div className={compact ? "scale-90 origin-center" : ""}>
                <LanguageSwitcher variant="glass" />
              </div>
              <div className={`bg-[#e70d69]/20 mx-0.5 ${compact ? "w-px h-3" : "w-px h-4"}`} aria-hidden="true" />
              <div className={compact ? "scale-90 origin-center" : ""}>
                <UserMenu variant="glass" />
              </div>
            </div>
            <div
              className={`hidden md:flex items-center shrink-0 pl-2 border-l border-[#081129]/10 ${compact ? "gap-0.5" : "gap-1"}`}
            >
              <div className={compact ? "scale-90 origin-center" : ""}>
                <LanguageSwitcher />
              </div>
              <div className={compact ? "scale-90 origin-center" : ""}>
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
