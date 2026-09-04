import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "@/lib/router-compat";

import { ChevronDown, Star, Info } from "lucide-react";
import { primaryNavigationItems, moreNavigationSections } from "@/components/header/NavigationItems";
import { CATEGORY_MENU_ICONS as ICONS, MORE_SECTION_ICONS, MENU_TURQUOISE as TURQUOISE, MENU_PINK as PINK } from "@/components/header/menuIcons";
import { MoreDropdownMenu } from "@/components/header/MoreDropdownMenu";
import { LanguageList, LanguageAccordion } from "@/components/header/LanguageSwitcher";
import { MobileAccountLinks } from "@/components/header/MobileAccountLinks";
import { useAuth } from "@/context/AuthContext";

import { CategoryPillDropdown } from "@/components/layout/CategoryPillDropdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
export default function BrowseByCategoryBar({ variant = "card", compact = false, placement = "card", className = "" }: { variant?: "card" | "flush"; compact?: boolean; placement?: "card" | "hero" | "straddle"; className?: string; } = {}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [moreRect, setMoreRect] = useState<DOMRect | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const [mobileBarOut, setMobileBarOut] = useState(false);
  const [stuck, setStuck] = useState(false);
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [barHeight, setBarHeight] = useState(0);
  const [heroPinned, setHeroPinned] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { user, signOut } = useAuth();
  const isStraddle = placement === "straddle";
  const items = primaryNavigationItems.filter((i) => i.name !== "How It Works");
  // Responsive overflow: how many category pills fit before the rest collapse
  // into the More menu. All pills render during a measuring pass, then extras hide.
  const stripRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const [measuring, setMeasuring] = useState(true);
  const pillWidths = useRef<number[]>([]);

  useEffect(() => {
    const compute = () => {
      const strip = stripRef.current;
      const bar = barRef.current;
      if (!strip || !bar) return;
      // Measure against the bar itself: the dock can be w-fit, in which case
      // the strip's own clientWidth never constrains and pills slide under More.
      const dock = strip.parentElement?.parentElement as HTMLElement | null;
      const padX = dock
        ? (() => { const s = getComputedStyle(dock); return parseFloat(s.paddingLeft) + parseFloat(s.paddingRight); })()
        : 0;
      const moreW = moreRef.current?.offsetWidth ?? 0;
      // The straddle dock is w-fit, so bar.clientWidth can be unconstrained;
      // clamp to the framed page width (viewport minus the 2×--page-inset frame).
      const rootStyle = getComputedStyle(document.documentElement);
      const inset = parseFloat(rootStyle.getPropertyValue("--page-inset")) || 0;
      const framedWidth = document.documentElement.clientWidth - inset * 2;
      const available = Math.min(bar.clientWidth || framedWidth, framedWidth) - padX - moreW - 12;
      const gap = parseFloat(getComputedStyle(strip).columnGap) || 0;
      let used = 0;
      let count = 0;
      const children = Array.from(strip.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        // Collapsed pills are display:none, so offsetWidth reads 0 on re-measure.
        // Fall back to the width cached during the last pass where it was visible.
        const measured = children[i].offsetWidth;
        if (measured > 0) pillWidths.current[i] = measured;
        const width = measured > 0 ? measured : (pillWidths.current[i] ?? 0);
        const next = used + width + (count > 0 ? gap : 0);
        if (next > available) break;
        used = next;
        count++;
      }
      setVisibleCount(Math.max(1, count));

      setMeasuring(false);
    };
    compute();
    document.fonts?.ready.then(compute).catch(() => {});
    const ro = new ResizeObserver(compute);
    if (barRef.current) ro.observe(barRef.current);
    window.addEventListener("resize", compute);
    return () => { ro.disconnect(); window.removeEventListener("resize", compute); };
  }, []);
  const overflowNavItems = items.slice(visibleCount).map((i) => ({ name: i.name, path: i.path, hasDropdown: i.hasDropdown, dropdownItems: i.dropdownItems }));
  const moreSections = overflowNavItems.length
    ? [{ title: "Categories", items: overflowNavItems }, ...moreNavigationSections]
    : moreNavigationSections;
  useEffect(() => setHydrated(true), []);
  // Find the navy/white boundary marker rendered by the category hero.
  useLayoutEffect(() => {
    if (!isStraddle) { setAnchorEl(null); return; }
    const find = () => setAnchorEl(document.getElementById("page-toolbar-anchor"));
    find();
    const raf = requestAnimationFrame(find);
    const observer = new MutationObserver(find);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [isStraddle, pathname]);
  // Measure the bar so it sits exactly half over each colour, and so the hero
  // placement can reserve its height with a spacer once it pins.
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el || (!isStraddle && placement !== "hero")) return;
    const update = () => setBarHeight(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isStraddle, placement, anchorEl]);

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
  // Track when the mobile brand bar (with the in-bar hamburger) has scrolled
  // above the viewport, so a floating trigger can take over.
  useEffect(() => {
    const el = mobileBarRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setMobileBarOut(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname]);
  useEffect(() => {
    if (placement !== "hero") {
      setHeroPinned(false);
      return;
    }

    // The hero sentinel sits immediately above the toolbar itself, so pinning
    // flips exactly when the bar's own top edge reaches the viewport top —
    // the hand-off from in-flow to fixed is pixel-continuous, like straddle.
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroPinned(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [placement]);
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
  const isFlush = variant === "flush";
  const useStraddle = isStraddle && Boolean(anchorEl);
  const straddlePositionClass = pinned
    ? "fixed top-0 left-0 right-0 page-inset-x mx-2 sm:mx-3 lg:mx-4"
    : "absolute top-0 left-0 right-0 mx-2 sm:mx-3 lg:mx-4 -translate-y-1/2";

  const fallbackStraddleClass = stuck
    ? "fixed top-0 left-0 right-0 page-inset-x mx-2 sm:mx-3 lg:mx-4"
    : "relative mt-4 mx-2 sm:mx-3 lg:mx-4";
  const wrapperClass = useStraddle
    ? straddlePositionClass
    : isStraddle
      ? fallbackStraddleClass
    : placement === "hero"
      ? `${
          heroPinned
            ? "fixed inset-x-0 top-0 page-inset-x transition-[box-shadow] duration-300 ease-out motion-reduce:transition-none shadow-[0_6px_20px_-8px_rgba(8,17,41,0.28)]"
            : "relative transition-[box-shadow] duration-300 ease-out motion-reduce:transition-none"
        } mt-0 w-full min-w-0`
      : compact ? "mt-0 mx-3 lg:mx-6" : isFlush ? "mt-4 mx-4 sm:mx-8 md:mx-14 lg:mx-16" : "mt-6 mx-4 sm:mx-8 md:mx-14 lg:mx-16";



  // Hero placement: a flush, full-width strip with a turquoise top border.
  // Everywhere else the dock stays a floating frosted pill.
  let innerClass = placement === "hero"
    ? "w-full max-w-full overflow-hidden bg-white border-t-2 border-[#22c0d4]"
    : `mx-auto w-fit max-w-full rounded-full bg-white/85 backdrop-blur-xl border border-white/60 border-t-2 border-t-[#22c0d4] ring-1 ring-[#081129]/[0.06] ${
    stuck
      ? "shadow-[0_2px_8px_rgba(8,17,41,0.08),0_20px_48px_-12px_rgba(8,17,41,0.34)]"
      : "shadow-[0_2px_6px_rgba(8,17,41,0.06),0_16px_40px_-12px_rgba(8,17,41,0.28)]"
  }`;


  if (className) { innerClass = `${innerClass} ${className}`; }


  return (
    <>
      {/* Hamburger drawer — rendered inside the brand bar at every breakpoint */}

      <div ref={sentinelRef} aria-hidden="true" className={placement === "hero" ? "absolute inset-x-0 top-0 h-px" : "h-px w-full"} />
      <div ref={mobileBarRef} className="w-full shrink-0 basis-full relative" data-testid="browse-by-category-bar-mobile">
        <div data-scrolled={scrolled} className={`${placement === "hero" ? "flex flex-col px-4 sm:px-6 md:px-9 min-h-[96px] md:min-h-[120px] py-3 md:py-4" : "flex items-center px-4 sm:px-6 md:px-9 h-24 md:h-[120px]"} transition-[background-color,border-color,box-shadow] duration-300 ease-out border-b bg-white border-[#22c0d4]`}>
            <div className="flex items-start w-full shrink-0">
              <div className="flex flex-col min-w-0 pr-14">
                <Link to="/" className="flex items-center no-underline font-[Montserrat] font-extrabold tracking-[-0.02em] leading-none whitespace-nowrap text-[clamp(30px,8.2vw,88px)] py-1 md:py-2">
                  <span className="transition-colors duration-300 ease-out text-[#081129]">myhealth</span>
                  <span className="text-[#22c0d4]">checkup</span>
                </Link>
                {placement === "hero" && (
                  <h1 className="m-0 mt-1 md:mt-2 text-left">
                    <span className="block font-[Montserrat] font-bold text-[clamp(11px,2.8vw,20px)] uppercase tracking-[0.14em] sm:tracking-[0.22em] leading-snug">
                      <span className="transition-colors duration-300 ease-out text-[#081129]">Your </span>
                      <span className="text-[#22c0d4]">health.</span>
                      <span className="transition-colors duration-300 ease-out text-[#081129]"> Your </span>
                      <span className="text-[#e70d69]">choice.</span>
                    </span>
                  </h1>
                )}

              </div>

            </div>

          <div className="absolute right-4 sm:right-6 md:right-9 lg:right-9 top-1/2 -translate-y-1/2 z-50" data-testid="mobile-floating-menu-trigger">
            {/* Desktop: show the hamburger icon but keep it inactive */}
            <div className="hidden lg:flex flex-col items-end justify-center gap-[5px] min-w-11 min-h-11 p-2 opacity-40" aria-hidden="true">
              <div className="h-[3px] w-9 rounded-full bg-[#081129]" />
              <div className="h-[3px] w-6 rounded-full bg-[#e70d69]" />
              <div className="h-[3px] w-10 rounded-full bg-[#22c0d4]" />
            </div>
            {/* Mobile: functional hamburger drawer */}
            <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="flex flex-col items-end justify-center gap-[5px] min-w-11 min-h-11 p-2 bg-transparent border-0 shadow-none focus:outline-hidden cursor-pointer"
            >
              <div className="h-[3px] w-9 rounded-full bg-[#081129]" />
              <div className="h-[3px] w-6 rounded-full bg-[#e70d69]" />
              <div className="h-[3px] w-10 rounded-full bg-[#22c0d4]" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" id="mobile-menu" className="w-[85vw] max-w-[340px] bg-[#f7f7f8] border-l border-[#081129]/10 p-0 flex flex-col">
            <SheetHeader className="px-4 py-4 border-b border-[#081129]/10 text-left"><SheetTitle className="text-[#081129] text-base font-[Montserrat] font-semibold">Menu</SheetTitle></SheetHeader>
            <nav className="px-3 py-4 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div>
                  <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/40 mb-3">Account</h3>
                  <MobileAccountLinks onNavigate={() => setMobileOpen(false)} />
                </div>
                <div>

                  <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/40 mb-3">Language</h3>
                  <LanguageAccordion onSelect={() => setMobileOpen(false)} />
                </div>
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
        </div>
      </div>

      {/* Floating hamburger — portalled to <body> so no ancestor transform,
          filter or overflow can trap the fixed positioning. */}
      {hydrated && typeof document !== "undefined"
        ? createPortal(
            <div
              className={`fixed top-3 right-3 z-[1200] lg:hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
                mobileBarOut && !mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-3 pointer-events-none"
              }`}
              data-testid="mobile-sticky-menu-trigger"
              aria-hidden={!mobileBarOut || mobileOpen}
            >
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex flex-col items-end justify-center gap-[5px] min-w-11 min-h-11 p-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#081129]/10 shadow-[0_8px_24px_-8px_rgba(8,17,41,0.35)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#e70d69] cursor-pointer"
              >
                <div className="h-[3px] w-9 rounded-full bg-[#081129]" />
                <div className="h-[3px] w-6 rounded-full bg-[#e70d69]" />
                <div className="h-[3px] w-10 rounded-full bg-[#22c0d4]" />
              </button>
            </div>,
            document.body,
          )
        : null}


      {(() => {
        const desktopBar = (
          <div
            ref={barRef}
            className={`hidden lg:block z-[1000] ${isStraddle || placement === "hero" ? "" : "sticky top-0"} ${wrapperClass}`}
            data-testid="browse-by-category-bar"
            data-placement={placement}
            data-pinned={placement === "hero" ? heroPinned : pinned}
            data-hydrated={hydrated}
          >

            <div className={`${placement === "hero" ? "px-3 sm:px-4 py-1.5" : "p-1.5"} transition-all duration-300 ${innerClass}`} data-testid="category-toolbar-dock">
              <div className={`flex ${placement === "hero" ? "w-full" : "w-fit"} max-w-full min-w-0 items-center gap-1`}>

                <div ref={stripRef} className={`flex min-w-0 items-center justify-start gap-y-0 flex-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${useStraddle ? "gap-x-0" : "gap-x-0 2xl:gap-x-1"}`} data-testid="category-pill-strip">
                  {items.map((item, index) => {
                    const { Icon, color } = ICONS[item.name] ?? { Icon: Star, color: TURQUOISE };
                    const collapsed = !measuring && index >= visibleCount;
                    return (
                      <div key={item.name} className={collapsed ? "hidden" : "shrink-0"}>
                        <CategoryPillDropdown item={item} color={color} Icon={Icon} compact={compact} dense={useStraddle} />
                      </div>
                    );
                  })}
                </div>

                <div ref={moreRef} className="relative shrink-0" data-testid="category-bar-right-cluster">
                  <button type="button" onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen} className={`group inline-flex items-center rounded-full transition-colors duration-200 ${moreOpen ? "bg-brand-pink/10" : "hover:bg-brand-pink/10"} ${useStraddle ? "gap-1.5 px-2.5 py-2" : "gap-0.5 px-1 py-2 2xl:gap-1 2xl:px-2 2xl:py-2.5"}`}><span className={`font-semibold font-[Montserrat] whitespace-nowrap text-[#081129] group-hover:text-brand-pink ${useStraddle ? "text-[12.5px] lg:text-[13px] tracking-[-0.02em]" : "text-xs sm:text-[12px] tracking-[-0.02em] 2xl:text-sm 2xl:tracking-normal"}`}>More</span><ChevronDown className={`text-[#081129]/45 transition-transform duration-300 shrink-0 w-[12px] h-[12px] 2xl:w-[14px] 2xl:h-[14px] group-hover:text-brand-pink ${moreOpen ? "rotate-180" : ""}`} /></button>

                  {moreOpen && typeof document !== "undefined" && createPortal(
                    <div ref={moreMenuRef} className="fixed z-[9999]" style={{ top: moreRect ? moreRect.bottom + 8 : 0, right: moreRect ? Math.max(8, window.innerWidth - moreRect.right) : 8 }}>
                      <MoreDropdownMenu
                        sections={moreSections}
                        onItemClick={() => setMoreOpen(false)}
                        onClose={() => setMoreOpen(false)}
                        accountItems={user
                          ? [
                              { name: "Dashboard", path: "/health-dashboard" },
                              { name: "Sign Out", path: "#", onClick: () => { void signOut(); setMoreOpen(false); } },
                            ]
                          : [{ name: "Sign in", path: "/auth" }]}
                        languageList={<LanguageList onSelect={() => setMoreOpen(false)} />}
                      />
                    </div>,
                    document.body,
                  )}
                </div>

              </div>
            </div>

          </div>
        );
        if (placement === "hero") {
          return (
            <>
              {/* Pin trigger: when this line scrolls past the viewport top, the
                  toolbar's own top edge is exactly at 0 — pin without a jump. */}
              <div ref={heroSentinelRef} aria-hidden="true" className="h-px w-full" />
              {desktopBar}
              {/* Reserve the bar's height once it pins so nothing jumps. */}
              <div aria-hidden="true" className="hidden lg:block" style={{ height: heroPinned ? barHeight : 0 }} />
            </>
          );
        }
        return useStraddle && anchorEl ? createPortal(desktopBar, anchorEl) : desktopBar;

      })()}
    </>
  );
}

