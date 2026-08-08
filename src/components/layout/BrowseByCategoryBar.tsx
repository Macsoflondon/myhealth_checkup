import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "@/lib/router-compat";

import { ArrowRight, ChevronDown, Star, Heart, UserCheck, User, Dumbbell, Baby, ShieldCheck, Home, MoreHorizontal, Menu, X, Info, Phone, Users, Search, BarChart2, BookOpen, Library } from "lucide-react";
import { primaryNavigationItems, moreNavigationSections } from "@/components/header/NavigationItems";
import { MoreDropdownMenu } from "@/components/header/MoreDropdownMenu";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { UserMenu } from "@/components/header/UserMenu";
import { CategoryPillDropdown } from "@/components/layout/CategoryPillDropdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
const PINK = "#e70d69";
const TURQUOISE = "#22c0d4";
const ICONS: Record<string, { Icon: any; color: string }> = {
  "Most Popular Tests": { Icon: Star, color: PINK },
  "General Wellness": { Icon: Heart, color: TURQUOISE },
  "Women's Health": { Icon: UserCheck, color: PINK },
  "Men's Health": { Icon: User, color: "#3a5f85" },
  "Sports & Fitness": { Icon: Dumbbell, color: "#16a34a" },
  "Fertility - Prenatal": { Icon: Baby, color: "#e70d69" },
  "Cancer Screening": { Icon: ShieldCheck, color: "#0ea5e9" },
  "At Home Test Kits": { Icon: Home, color: "#f59e0b" },
};
const MORE_SECTION_ICONS: Record<string, { Icon: any; color: string }> = {
  "About Us": { Icon: Info, color: TURQUOISE },
  "Frequently Asked Questions": { Icon: BookOpen, color: "#6366f1" },
  "Our Providers": { Icon: Users, color: PINK },
  "Assisted Test Finder": { Icon: Search, color: "#16a34a" },
  "Compare Tests": { Icon: BarChart2, color: "#f59e0b" },
  "Health Resources Hub": { Icon: BookOpen, color: "#0ea5e9" },
  "Biomarker Library": { Icon: Library, color: "#8b5cf6" },
  "Contact Us": { Icon: Phone, color: PINK },
};
export default function BrowseByCategoryBar({ variant = "card", compact = false, placement = "card", className = "" }: { variant?: "card" | "flush"; compact?: boolean; placement?: "card" | "hero" | "straddle"; className?: string; } = {}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [moreRect, setMoreRect] = useState<DOMRect | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [barHeight, setBarHeight] = useState(0);
  const isStraddle = placement === "straddle";
  // Find the navy/white boundary marker rendered by the category hero.
  useLayoutEffect(() => {
    if (!isStraddle) { setAnchorEl(null); return; }
    const find = () => setAnchorEl(document.getElementById("page-toolbar-anchor"));
    find();
    const raf = requestAnimationFrame(find);
    return () => cancelAnimationFrame(raf);
  }, [isStraddle, pathname]);
  // Measure the bar so it sits exactly half over each colour.
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el || !isStraddle) return;
    const update = () => setBarHeight(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isStraddle, anchorEl]);
  // Straddle mode: float over the boundary, then pin to the top once scrolled past it.
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    if (!isStraddle || !anchorEl) { setPinned(false); return; }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const top = anchorEl.getBoundingClientRect().top;
        const h = barRef.current?.getBoundingClientRect().height ?? barHeight;
        setPinned(top - h / 2 <= 0);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [isStraddle, anchorEl, barHeight]);


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
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setStuck(entry.intersectionRatio < 1 && entry.boundingClientRect.top < 0), { threshold: [1] });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!moreRef.current?.contains(t) && !moreMenuRef.current?.contains(t)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    const sync = () => { const el = moreRef.current; if (el) setMoreRect(el.getBoundingClientRect()); };
    sync();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [moreOpen]);
  const items = primaryNavigationItems.filter((i) => i.name !== "How It Works");
  const isFlush = variant === "flush";
  const useStraddle = isStraddle && Boolean(anchorEl);
  const straddlePositionClass = pinned
    ? "fixed top-0 left-0 right-0 mx-2 sm:mx-3 lg:mx-4"
    : "absolute top-0 left-0 right-0 mx-2 sm:mx-3 lg:mx-4 -translate-y-1/2";

  const wrapperClass = useStraddle
    ? straddlePositionClass
    : placement === "hero" ? "mt-0 mx-3 lg:mx-6" : compact ? "mt-0 mx-3 lg:mx-6" : isFlush ? "mt-4 mx-4 sm:mx-8 md:mx-14 lg:mx-16" : "mt-6 mx-4 sm:mx-8 md:mx-14 lg:mx-16";



  // Floating pill-shaped dock: frosted surface, hairline border, layered lift.
  let innerClass = `mx-auto w-fit max-w-full rounded-full bg-white/85 backdrop-blur-xl border border-white/60 ring-1 ring-[#081129]/[0.06] ${
    stuck
      ? "shadow-[0_2px_8px_rgba(8,17,41,0.08),0_20px_48px_-12px_rgba(8,17,41,0.34)]"
      : "shadow-[0_2px_6px_rgba(8,17,41,0.06),0_16px_40px_-12px_rgba(8,17,41,0.28)]"
  }`;
  if (className) { innerClass = `${innerClass} ${className}`; }


  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      <div className="md:hidden sticky top-0 z-50" data-testid="browse-by-category-bar-mobile">
        <div data-scrolled={scrolled} className={`px-4 h-20 flex items-center justify-between transition-[background-color,border-color,box-shadow] duration-300 ease-out border-b ${scrolled ? "bg-[#081129] border-[#081129] shadow-[0_2px_10px_rgba(8,17,41,0.18)]" : "bg-white border-[#081129]/10"}`}>
          <Link to="/" className="flex items-center h-10 no-underline font-[Montserrat] font-extrabold tracking-tight text-[30px] leading-none"><span className={`transition-colors duration-300 ease-out ${scrolled ? "text-white" : "text-[#081129]"}`}>myhealth</span><span className="text-[#e70d69]">checkup</span></Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild><button type="button" aria-label="Open menu" className={`inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-300 ease-out focus:outline-hidden ${scrolled ? "bg-white/10 text-white hover:bg-white/20" : "bg-[#081129]/5 text-[#081129] hover:bg-[#081129]/10"}`}><Menu className="w-6 h-6" strokeWidth={2.25} /></button></SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[340px] bg-[#f7f7f8] border-l border-[#081129]/10 p-0 flex flex-col">
              <SheetHeader className="px-4 py-4 border-b border-[#081129]/10 text-left"><SheetTitle className="text-[#081129] text-base font-[Montserrat] font-semibold">Menu</SheetTitle></SheetHeader>
              <nav className="px-3 py-4 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <div>
                    <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/40 mb-3">Test Categories</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item) => {
                        const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
                        const hasSubs = Boolean(item.hasDropdown && item.dropdownItems?.length);
                        const isExpanded = mobileExpanded === item.name;
                        return (
                          <div key={item.name} className="rounded-xl bg-white border-[1.5px] border-[#081129]/10 overflow-hidden">
                            <div className="flex items-stretch">
                              <Link to={item.path} onClick={() => setMobileOpen(false)} className="group flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0 no-underline"><span className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0" style={{ background: `${color}1a` }}><Icon className="w-4 h-4" style={{ color }} strokeWidth={2} /></span><span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">{item.name}</span></Link>
                              {hasSubs && (<button type="button" onClick={() => setMobileExpanded((cur) => (cur === item.name ? null : item.name))} className="shrink-0 px-3 flex items-center justify-center border-l border-[#081129]/10 text-[#081129]/60"><ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} /></button>)}
                            </div>
                            {hasSubs && isExpanded && (<ul className="border-t border-[#081129]/10 bg-[#f7f7f8] py-1">{item.dropdownItems!.map((sub) => (<li key={sub.path + sub.name}><Link to={sub.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 pl-14 pr-3 py-2 text-[13px] font-medium text-[#081129] font-[Montserrat] no-underline hover:bg-white transition-colors"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} /><span className="truncate">{sub.name}</span></Link></li>))}</ul>)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {moreNavigationSections.map((section) => (
                    <div key={section.title}>
                      <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/40 mb-3">{section.title}</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {section.items.map((item) => {
                          const { Icon, color } = MORE_SECTION_ICONS[item.name] ?? { Icon: Info, color: TURQUOISE };
                          return (
                            <Link key={item.name} to={item.path} onClick={() => setMobileOpen(false)} className="rounded-xl bg-white border-[1.5px] border-[#081129]/10 group flex items-center gap-3 px-3 py-2.5 no-underline">
                              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0" style={{ background: `${color}1a` }}><Icon className="w-4 h-4" style={{ color }} strokeWidth={2} /></span>
                              <span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {(() => {
        const desktopBar = (
          <div
            ref={barRef}
            className={`hidden md:block z-[1000] ${useStraddle ? "" : "sticky top-0"} ${wrapperClass}`}
            data-testid="browse-by-category-bar"
          >

            <div className={`p-1.5 transition-all duration-300 ${innerClass}`}>
              <div className={`flex items-center justify-start gap-y-0 flex-nowrap max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] ${useStraddle ? "gap-x-0.5" : "gap-x-0.5 2xl:gap-x-1"}`}>
                {items.map((item) => {
                  const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
                  return <CategoryPillDropdown key={item.name} item={item} color={color} Icon={Icon} compact={compact} dense={useStraddle} />;
                })}

                <div ref={moreRef} className="relative shrink-0 ml-1">
                  <button type="button" onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen} className={`group inline-flex items-center rounded-full bg-[#081129] text-white transition-colors duration-200 hover:bg-[#0f1d3f] ${useStraddle ? "gap-1.5 px-3 py-2" : "gap-1.5 px-3 py-2 2xl:gap-2 2xl:px-4 2xl:py-2.5"}`}><MoreHorizontal className={`shrink-0 ${useStraddle ? "w-[15px] h-[15px]" : "w-[15px] h-[15px] 2xl:w-[17px] 2xl:h-[17px]"}`} strokeWidth={2} /><span className={`font-bold font-[Montserrat] whitespace-nowrap ${useStraddle ? "text-[12.5px] lg:text-[13px] tracking-[-0.02em]" : "text-[11.5px] lg:text-[12px] xl:text-[12px] 2xl:text-[14px] tracking-[-0.015em] 2xl:tracking-normal"}`}>More</span><ChevronDown className={`text-white/70 transition-transform duration-300 shrink-0 w-[12px] h-[12px] 2xl:w-[14px] 2xl:h-[14px] ${moreOpen ? "rotate-180" : ""}`} /></button>

                  {moreOpen && typeof document !== "undefined" && createPortal(
                    <div ref={moreMenuRef} className="fixed z-[9999]" style={{ top: moreRect ? moreRect.bottom + 8 : 0, right: moreRect ? Math.max(8, window.innerWidth - moreRect.right) : 8 }}>
                      <MoreDropdownMenu sections={moreNavigationSections} onItemClick={() => setMoreOpen(false)} onClose={() => setMoreOpen(false)} />
                    </div>,
                    document.body,
                  )}
                </div>
                {placement !== "hero" && (
                  <div className={`flex items-center shrink-0 ${compact ? "gap-0" : "gap-1"}`}><div className={compact ? "scale-[0.78]" : useStraddle ? "scale-[0.85]" : ""}><LanguageSwitcher /></div><div className={compact ? "scale-[0.78]" : useStraddle ? "scale-[0.85]" : ""}><UserMenu /></div></div>
                )}

              </div>
            </div>
          </div>
        );
        return useStraddle && anchorEl ? createPortal(desktopBar, anchorEl) : desktopBar;
      })()}
    </>
  );
}

