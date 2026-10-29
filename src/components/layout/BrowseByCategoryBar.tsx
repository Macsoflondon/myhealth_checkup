import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "@/lib/router-compat";

import { ChevronDown, Star, Info } from "lucide-react";
import {
  primaryNavigationItems,
  moreNavigationSections,
} from "@/components/header/NavigationItems";
import {
  CATEGORY_MENU_ICONS as ICONS,
  MORE_SECTION_ICONS,
  MENU_TURQUOISE as TURQUOISE,
} from "@/components/header/menuIcons";
import { LanguageAccordion } from "@/components/header/LanguageSwitcher";
import { MobileAccountLinks } from "@/components/header/MobileAccountLinks";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Brand bar: the myhealth checkup wordmark plus the menu drawer that carries
 * every category, section, account and language link. The desktop "Browse by
 * Category" pill toolbar was removed on 29 October 2026 — the drawer is now
 * the single navigation entry point at every width.
 */
export default function BrowseByCategoryBar({
  placement = "card",
}: {
  placement?: "card" | "hero" | "straddle";
} = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const [mobileBarOut, setMobileBarOut] = useState(false);
  const { pathname } = useLocation();
  const [hydrated, setHydrated] = useState(false);
  const items = primaryNavigationItems.filter((i) => i.name !== "How It Works");

  useEffect(() => setHydrated(true), []);

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

  // Track when the brand bar (with its in-bar menu trigger) has scrolled above
  // the viewport, so a floating trigger can take over.
  useEffect(() => {
    const el = mobileBarRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) =>
        setMobileBarOut(
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0,
        ),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname]);

  const menuDrawer = (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="flex flex-col items-end justify-center gap-[5px] min-w-11 min-h-11 p-2 rounded-xl bg-white border border-[#e70d69]/15 shadow-[0_4px_14px_-4px_rgba(231,13,105,0.45)] active:shadow-[0_2px_8px_-2px_rgba(231,13,105,0.5)] transition-shadow focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#e70d69] cursor-pointer"
        >
          <div className="h-[3px] w-9 rounded-full bg-[#081129]" />
          <div className="h-[3px] w-6 rounded-full bg-[#e70d69]" />
          <div className="h-[3px] w-10 rounded-full bg-[#22c0d4]" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        id="mobile-menu"
        className="w-[85vw] max-w-[340px] bg-[#f7f7f8] border-l border-[#081129]/10 p-0 flex flex-col"
      >
        <SheetHeader className="px-4 py-4 border-b border-[#081129]/10 text-left">
          <SheetTitle className="text-[#081129] text-base font-[Montserrat] font-semibold">
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="px-3 py-4 overflow-y-auto flex-1">
          <div className="space-y-6">
            <div>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/70 mb-3">
                Account
              </h3>
              <MobileAccountLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            <div>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/70 mb-3">
                Language
              </h3>
              <LanguageAccordion onSelect={() => setMobileOpen(false)} />
            </div>
            <div>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/70 mb-3">
                Test Categories
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {items.map((item) => {
                  const { Icon, color } = ICONS[item.name] ?? {
                    Icon: Star,
                    color: TURQUOISE,
                  };
                  const hasSubs = Boolean(
                    item.hasDropdown && item.dropdownItems?.length,
                  );
                  const isExpanded = mobileExpanded === item.name;
                  return (
                    <div
                      key={item.name}
                      className="rounded-xl bg-white border-[1.5px] border-[#081129]/10 overflow-hidden"
                    >
                      <div className="flex items-stretch">
                        <Link
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className="group flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0 no-underline"
                        >
                          <span
                            className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
                            style={{ background: `${color}1a` }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color }}
                              strokeWidth={2}
                            />
                          </span>
                          <span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">
                            {item.name}
                          </span>
                        </Link>
                        {hasSubs && (
                          <button
                            type="button"
                            onClick={() =>
                              setMobileExpanded((cur) =>
                                cur === item.name ? null : item.name,
                              )
                            }
                            className="shrink-0 px-3 flex items-center justify-center border-l border-[#081129]/10 text-[#081129]/60"
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
            </div>
            {moreNavigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/70 mb-3">
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {section.items.map((item) => {
                    const { Icon, color } = MORE_SECTION_ICONS[item.name] ?? {
                      Icon: Info,
                      color: TURQUOISE,
                    };
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl bg-white border-[1.5px] border-[#081129]/10 group flex items-center gap-3 px-3 py-2.5 no-underline"
                      >
                        <span
                          className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
                          style={{ background: `${color}1a` }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{ color }}
                            strokeWidth={2}
                          />
                        </span>
                        <span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">
                          {item.name}
                        </span>
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
  );

  return (
    <>
      <div
        ref={mobileBarRef}
        className="w-full shrink-0 basis-full relative"
        data-testid="brand-bar"
      >
        <div
          data-scrolled={scrolled}
          className={`${placement === "hero" ? "flex flex-col px-4 sm:px-6 md:px-9 min-h-[96px] md:min-h-[120px] py-3 md:py-4" : "flex items-center px-4 sm:px-6 md:px-9 h-24 md:h-[120px]"} transition-[background-color,border-color,box-shadow] duration-300 ease-out border-b-2 bg-white ${placement === "hero" ? "border-[#e70d69]" : "border-[#22c0d4]"}`}
        >
          <div className="flex items-start w-full shrink-0">
            <div className="flex flex-col min-w-0 pr-14">
              <Link
                to="/"
                className="flex items-center no-underline font-[Montserrat] font-extrabold tracking-[-0.02em] leading-none whitespace-nowrap text-[clamp(24px,5.6vw,108px)] max-sm:text-[clamp(24px,7.6vw,40px)] xl:text-[clamp(24px,7.4vw,108px)] py-1 md:py-2"
              >
                <BrandWordmark />
              </Link>
              {placement === "hero" && (
                <p className="m-0 mt-1 md:mt-2 text-left">
                  <span className="block whitespace-nowrap font-[Montserrat] font-bold text-[clamp(11px,2.4vw,28px)] max-sm:text-[clamp(11px,3.3vw,16px)] xl:text-[clamp(11px,3.3vw,28px)] uppercase tracking-[0.12em] sm:tracking-[0.18em] xl:tracking-[0.22em] leading-snug">
                    <span className="transition-colors duration-300 ease-out text-[#081129]">
                      Your{" "}
                    </span>
                    {/* Slogan "health." in brand turquoise (#22c0d4) — the
                        same token the footer and logo mark use. */}
                    <span className="text-brand-turquoise">health.</span>
                    <span className="transition-colors duration-300 ease-out text-[#081129]">
                      {" "}
                      Your{" "}
                    </span>
                    <span className="text-[#e70d69]">choice.</span>
                  </span>
                </p>
              )}
            </div>
          </div>

          <div
            className="absolute right-4 sm:right-6 md:right-9 lg:right-9 top-1/2 -translate-y-1/2 z-50"
            data-testid="menu-trigger"
          >
            {menuDrawer}
          </div>
        </div>
      </div>

      {/* Floating menu trigger — portalled to <body> so no ancestor transform,
          filter or overflow can trap the fixed positioning. It takes over once
          the brand bar has scrolled above the viewport. */}
      {hydrated && typeof document !== "undefined"
        ? createPortal(
            <div
              className={`fixed top-3 right-3 z-[1200] transition-all duration-300 ease-out motion-reduce:transition-none ${
                mobileBarOut && !mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-3 pointer-events-none"
              }`}
              data-testid="sticky-menu-trigger"
              // inert, not aria-hidden: while the trigger is faded out it must
              // also leave the tab order, or keyboard users land on a button
              // that screen readers are told does not exist.
              inert={!mobileBarOut || mobileOpen}
            >
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-controls="mobile-menu"
                className="flex flex-col items-end justify-center gap-[5px] min-w-11 min-h-11 p-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#e70d69]/15 shadow-[0_6px_18px_-6px_rgba(231,13,105,0.5)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#e70d69] cursor-pointer"
              >
                <div className="h-[3px] w-9 rounded-full bg-[#081129]" />
                <div className="h-[3px] w-6 rounded-full bg-[#e70d69]" />
                <div className="h-[3px] w-10 rounded-full bg-[#22c0d4]" />
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
