import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Logo } from "../header/Logo";
import mainLogo from "@/assets/myhealth-logo-cropped.webp";
import fullLogo from "@/assets/myhealth-logo-full.png.asset.json";
import headerTagline from "@/assets/header-tagline.webp";
import mobileLogo from "/myhealth-logo.png";

import { SearchBar } from "../header/SearchBar";
import { NavigationItems } from "../header/NavigationItems";
import { UserMenu } from "../header/UserMenu";
import { MobileMenu } from "../header/MobileMenu";
// MobileNavigationDrawer is heavy (~640 lines) — lazy-load so it doesn't bloat the initial header chunk.
const MobileNavigationDrawer = lazy(() =>
  import("../header/MobileNavigationDrawer").then(m => ({ default: m.MobileNavigationDrawer }))
);
import { LanguageSwitcher } from "../header/LanguageSwitcher";
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
  const [dockedSearchTerm, setDockedSearchTerm] = useState("");
  const logoBarRef = useRef<HTMLElement>(null);
  const promoTrackerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleDockedSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && dockedSearchTerm.trim()) {
      navigate(`/compare?search=${encodeURIComponent(dockedSearchTerm.trim())}`);
    }
  };


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

                <nav className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex shrink-0 items-center gap-1.5 bg-[#08122b]" aria-label="User controls">

                  <LanguageSwitcher />
                  <UserMenu isMobile />
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
    styles.toolbar
  );
  return (
    <ErrorBoundary>
      {/* Promo ticker — slides upward with scroll */}
      <div
        ref={promoTrackerRef}
        className={cn("sticky top-0 z-50 overflow-hidden motion-reduce:transition-none", className)}
        style={{
          maxHeight: lerp(tickerHeight || 200, 0, collapseProgress),
          opacity: 1 - collapseProgress,
          transform: `translateY(${-collapseProgress * (tickerHeight || 0)}px)`,
          willChange: "transform, opacity, max-height",
          pointerEvents: collapseProgress > 0.9 ? "none" : "auto",
        }}
        aria-hidden={isSearchDocked}
      >
        <PromoTicker />
      </div>

      {/* Logo section — shrinks continuously as user scrolls */}
      <header
        ref={logoBarRef}
        className={cn(
          className,
          "sticky top-0 z-[60] motion-reduce:transition-none"
        )}
        style={{
          boxShadow: `0 4px 20px rgba(0,0,0,${collapseProgress * 0.12})`,
          willChange: "padding",
        }}
      >
        <div style={{ backgroundColor: "#ffffff" }}>
          <div className="px-3 md:px-4 lg:px-8 xl:px-12">
            <div
              className="relative flex items-center justify-center"
              style={{
                paddingTop: `${lerp(24, 2, collapseProgress)}px`,
                paddingBottom: `${lerp(24, 2, collapseProgress)}px`,
              }}
            >
              {/* Center: Combined logo + tagline (cross-fades with search) */}
              <Link
                to="/"
                className="flex items-center flex-shrink-0 min-w-0 transform-gpu hover:scale-105 will-change-transform motion-reduce:hover:scale-100"
                style={{
                  transformOrigin: "center center",
                  opacity: 1 - Math.min(1, collapseProgress / 0.6),
                  pointerEvents: isSearchDocked ? "none" : "auto",
                  position: isSearchDocked ? "absolute" : "relative",
                }}
                aria-hidden={isSearchDocked}
                tabIndex={isSearchDocked ? -1 : 0}
              >
                <img
                  src={fullLogo.url}
                  alt="myhealth checkup — Your health! Your choice! One trusted platform!"
                  className="w-auto object-contain flex-shrink-0 max-w-[90vw]"
                  style={{ height: `${lerp(128, 48, collapseProgress)}px` }}
                />
              </Link>

              {/* Center: docked search */}
              {isSearchDocked && (
                <div
                  className="relative w-full max-w-[640px]"
                  style={{ opacity: Math.min(1, (collapseProgress - 0.6) / 0.4) }}
                >
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#081129]/70 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    placeholder="COMPARE OVER 200 TESTS"
                    aria-label="Search blood tests and health screenings"
                    value={dockedSearchTerm}
                    onChange={(e) => setDockedSearchTerm(e.target.value)}
                    onKeyDown={handleDockedSearchKey}
                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 text-sm md:text-base font-bold rounded-lg bg-white border-2 border-[#22c0d4]/60 text-[#081129] placeholder:text-[#081129]/60 focus:ring-2 focus:ring-[#22c0d4]/40 focus:outline-none"
                  />
                </div>
              )}

              {/* Right controls — absolutely anchored so they don't pull the logo off-centre */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center pl-2" style={{ backgroundColor: "#ffffff" }}>
                <nav className="flex items-center gap-1 md:gap-2 lg:gap-3" aria-label="User controls">
                  <LanguageSwitcher />
                  <UserMenu />
                </nav>
              </div>

            </div>
          </div>
        </div>
      </header>


      {/* Toolbar sticks directly below the (shrinking) logo bar */}
      <div
        className="sticky z-40 motion-reduce:transition-none"
        style={{ top: logoBarHeight }}
      >
        <div
          className={cn(toolbarClasses, "motion-reduce:transition-none")}
          style={{
            overflow: "visible",
            boxShadow: `0 4px 30px rgba(0,0,0,${0.2 + collapseProgress * 0.15})`,
          }}
        >
          <div className="flex items-center justify-center px-2 sm:px-3 lg:px-8 w-full" style={{ overflow: "visible" }}>
            <NavigationItems className="flex items-center gap-0 flex-nowrap justify-center" />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default Header;
