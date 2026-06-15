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
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);
  const [tickerHeight, setTickerHeight] = useState(0);
  const [logoBarHeight, setLogoBarHeight] = useState(0);
  const [isSearchDocked, setIsSearchDocked] = useState(false);
  const [dockedSearchTerm, setDockedSearchTerm] = useState("");
  const logoBarRef = useRef<HTMLElement>(null);
  const promoTrackerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Observe hero search sentinel to drive docked state (desktop only).
  useEffect(() => {
    if (isMobile) {
      setIsSearchDocked(false);
      return;
    }
    const findAndObserve = () => {
      const el = document.getElementById("hero-search-sentinel");
      if (!el) {
        // No hero on this route — keep header in default state.
        setIsSearchDocked(false);
        return null;
      }
      const observer = new IntersectionObserver(
        ([entry]) => setIsSearchDocked(!entry.isIntersecting),
        { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
      );
      observer.observe(el);
      return observer;
    };
    let observer = findAndObserve();
    // Hero may mount slightly later (lazy children) — retry once on next frame.
    const raf = requestAnimationFrame(() => {
      if (!observer) observer = findAndObserve();
    });
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [isMobile, location.pathname]);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsToolbarSticky(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* Promo ticker — collapses when search docks */}
      <div
        ref={promoTrackerRef}
        className={cn("sticky top-0 z-50 overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none", className)}
        style={{
          maxHeight: isSearchDocked ? 0 : 200,
          opacity: isSearchDocked ? 0 : 1,
        }}
        aria-hidden={isSearchDocked}
      >
        <PromoTicker />
      </div>

      {/* Logo section — sticks at top when search docks */}
      <header
        ref={logoBarRef}
        className={cn(
          className,
          "sticky z-[60] motion-reduce:transition-none",
          isSearchDocked && "shadow-lg"
        )}
        style={{ top: isSearchDocked ? 0 : tickerHeight }}
      >
        <div style={{ backgroundColor: "#ffffff" }}>
          <div className="px-3 md:px-4 lg:px-8 xl:px-12">
            <div
              className={cn(
                "relative flex items-center justify-center transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                isSearchDocked ? "py-0 md:py-2" : "py-2 md:py-4 lg:py-6"
              )}
            >
              {/* Center: Combined logo + tagline */}
              {!isSearchDocked && (
                <Link
                  to="/"
                  className="flex items-center flex-shrink-0 min-w-0 transform-gpu scale-105 hover:scale-110 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform motion-reduce:transition-none motion-reduce:hover:scale-105"
                  style={{ transformOrigin: "center center" }}
                >
                  <img
                    src={fullLogo.url}
                    alt="myhealth checkup — Your health! Your choice! One trusted platform!"
                    className="w-auto object-contain flex-shrink-0 h-24 md:h-28 lg:h-32 xl:h-36 max-w-[90vw]"
                  />
                </Link>
              )}


              {/* Center: docked search */}
              {isSearchDocked && (
                <div className="relative w-full max-w-[640px]">
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


      {/* Toolbar sticks below the logo bar */}
      <div
        className="sticky z-40 transition-[top] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ top: (isSearchDocked ? 0 : tickerHeight) + logoBarHeight }}
      >
        {/* Divider removed */}

        <div
          className={cn(
            toolbarClasses,
            "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
            isToolbarSticky && "shadow-lg",
          )}
          style={{ overflow: "visible" }}
        >
          <div className="flex items-center justify-center px-2 sm:px-3 lg:px-8 w-full" style={{ overflow: "visible" }}>
            <NavigationItems className="flex items-center gap-0 flex-nowrap justify-center" />
          </div>
        </div>
        {/* Divider removed */}

      </div>
    </ErrorBoundary>
  );
};
export default Header;
