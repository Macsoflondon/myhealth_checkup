import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";
import { Logo } from "../header/Logo";
import mainLogo from "@/assets/myhealth-logo-cropped.webp";
import mobileLogo from "/myhealth-logo.png";

import { SearchBar } from "../header/SearchBar";
import { NavigationItems } from "../header/NavigationItems";
import { MobileMenu } from "../header/MobileMenu";
// MobileNavigationDrawer is heavy (~640 lines) — lazy-load so it doesn't bloat the initial header chunk.
const MobileNavigationDrawer = lazy(() =>
  import("../header/MobileNavigationDrawer").then((m) => ({ default: m.MobileNavigationDrawer })),
);
import { UtilityBar } from "../header/UtilityBar";
import { ErrorBoundary } from "../common/ErrorBoundary";
import PromoTicker from "../sections/PromoTicker";
import styles from "./Header.module.css";

interface HeaderProps {
  className?: string;
}
const Header = ({ className }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tickerHeight, setTickerHeight] = useState(0);
  const [logoBarHeight, setLogoBarHeight] = useState(0);
  const [collapseProgress, setCollapseProgress] = useState(0);
  const logoBarRef = useRef<HTMLElement>(null);
  const promoTrackerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Continuous scroll-driven collapse progress (desktop/tablet only).
  // Threshold is the actual logo bar height — collapse finishes exactly when
  // the logo bar has rolled fully out of view, at which point the toolbar locks.
  useEffect(() => {
    if (isMobile) {
      setCollapseProgress(0);
      return;
    }
    let rafId = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const threshold = Math.max(80, (logoBarHeight || 120) + (tickerHeight || 0));
      const p = Math.min(1, Math.max(0, y / threshold));
      setCollapseProgress(p);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile, location.pathname, logoBarHeight, tickerHeight]);

  const isSearchDocked = collapseProgress > 0.6;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Measure ticker height for sticky toolbar offset (desktop only)
  useEffect(() => {
    if (isMobile || !promoTrackerRef.current) return;
    const measure = () => {
      if (promoTrackerRef.current) {
        setTickerHeight(promoTrackerRef.current.getBoundingClientRect().height);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(promoTrackerRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  // Measure logo bar height for sticky toolbar offset when docked
  useEffect(() => {
    if (isMobile || !logoBarRef.current) return;
    const measure = () => {
      if (logoBarRef.current) {
        setLogoBarHeight(logoBarRef.current.getBoundingClientRect().height);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(logoBarRef.current);
    return () => observer.disconnect();
  }, [isMobile, isSearchDocked]);
  if (isMobile) {
    return (
      <ErrorBoundary>
        <div className={cn("sticky top-0 z-50 bg-[hsl(var(--brand-navy))]", className)}>
          <PromoTicker />
          <header className="bg-[hsl(var(--brand-navy))] shadow-md">
            <div className="container mx-auto max-w-full px-3 sm:px-4 bg-[#08122b]">
              <div className="relative py-4 flex items-center justify-center min-w-0 bg-[#08122b] pr-[9.5rem] xs:pr-[10rem] sm:pr-[10.5rem]">
                <Link to="/" className="relative z-10 flex items-center justify-center overflow-hidden bg-[#08122b]">
                  <img
                    src={mainLogo}
                    alt="myhealth checkup"
                    className="h-[72px] xs:h-[80px] sm:h-[88px] w-auto max-w-[calc(100vw-11rem)] object-contain object-center"
                  />
                </Link>

                <nav
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex shrink-0 items-center gap-1.5 bg-[#08122b]"
                  aria-label="User controls"
                >
                  <div className="pl-1 border-l border-white/20">
                    <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                  </div>
                </nav>
              </div>
            </div>

            {/* Divider removed */}

            {/* Mobile Navigation Drawer (lazy — only loads when first opened) */}
            {isMenuOpen && (
              <Suspense fallback={null}>
                <MobileNavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
              </Suspense>
            )}
          </header>
        </div>
      </ErrorBoundary>
    );
  }
  // Toolbar with glassmorphism
  const toolbarClasses = cn(
    "bg-brand-navy border-b border-white/10 my-0 mx-0 px-0 py-2 md:py-2.5 lg:py-1 shadow-[0_4px_30px_rgba(0,0,0,0.2)]",
    styles.toolbar,
  );
  return (
    <ErrorBoundary>
      {/* Promo ticker — collapses in normal flow as user scrolls */}
      <div
        ref={promoTrackerRef}
        className={cn("relative z-50 overflow-hidden motion-reduce:transition-none", className)}
        style={{
          maxHeight: collapseProgress >= 1 ? 0 : lerp(tickerHeight || 200, 0, collapseProgress),
          opacity: 1 - collapseProgress,
          willChange: "opacity, max-height",
          pointerEvents: collapseProgress > 0.9 ? "none" : "auto",
        }}
        aria-hidden={isSearchDocked}
      >
        <PromoTicker />
      </div>

      {/* Logo section — scrolls away in normal flow (no sticky) so the toolbar
          locks to the top only once the logo bar has fully left the viewport. */}
      <header
        ref={logoBarRef}
        className={cn(className, "relative z-[60] motion-reduce:transition-none")}
        style={{
          boxShadow: `0 4px 20px rgba(0,0,0,${collapseProgress * 0.12})`,
        }}
      >
        <div style={{ backgroundColor: "#ffffff" }}>
          <div className="px-3 md:px-4 lg:px-8 xl:px-12">
            <div
              className="relative flex items-center justify-center"
              style={{
                paddingTop: `${lerp(24, 6, collapseProgress)}px`,
                paddingBottom: `${lerp(24, 6, collapseProgress)}px`,
              }}
            >
              <Link
                to="/"
                className="flex items-center flex-shrink-0 min-w-0 transform-gpu hover:scale-105 will-change-transform motion-reduce:hover:scale-100"
                style={{ transformOrigin: "center center" }}
              >
                <img
                  src={fullLogo.url}
                  alt="myhealth checkup — Your health! Your choice! One trusted platform!"
                  className="w-auto object-contain flex-shrink-0 max-w-[90vw]"
                  style={{ height: `${lerp(128, 64, collapseProgress)}px` }}
                />
              </Link>

              <div className="flex-1" />
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar locks to the top of the viewport once the header above has
          fully scrolled out — sticky top:0 achieves this naturally. */}
      {false && (
        <div className="sticky top-0 z-40 motion-reduce:transition-none">
          <div
            className={cn(toolbarClasses, "motion-reduce:transition-none")}
            style={{
              overflow: "visible",
              boxShadow: `0 4px 30px rgba(0,0,0,${0.2 + collapseProgress * 0.15})`,
            }}
          >
            <div
              className="flex items-center justify-center px-2 sm:px-3 lg:px-8 w-full"
              style={{ overflow: "visible" }}
            >
              <NavigationItems className="flex items-center gap-0 flex-nowrap justify-center" />
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};
export default Header;
