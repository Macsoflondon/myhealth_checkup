import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Logo } from "../header/Logo";
import mainLogo from "@/assets/myhealth-logo-cropped.webp";
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
  if (isMobile) {
    return (
      <ErrorBoundary>
        <div className={cn("sticky top-0 z-50 bg-[hsl(var(--brand-navy))]", className)}>
          <PromoTicker />
        <header className="bg-[hsl(var(--brand-navy))] shadow-md">
          <div className="container mx-auto max-w-full px-3 sm:px-4 bg-[#08122b]">
              <div className="py-2.5 flex items-center justify-between gap-4 sm:gap-6 min-w-0 bg-[#08122b]">
                <Link to="/" className="flex min-w-0 flex-1 items-center overflow-hidden bg-[#08122b]">
                  <img
                    src={mainLogo}
                    alt="myhealth checkup"
                    className="h-[70px] xs:h-[80px] sm:h-[90px] w-auto max-w-[calc(100vw-12rem)] object-contain object-left"
                  />
                </Link>

                <nav className="flex shrink-0 items-center gap-2" aria-label="User controls">
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
    "bg-[hsl(220,5%,97%)] border-b border-gray-200/30 my-0 mx-0 px-0 py-2 md:py-2.5 lg:py-1 shadow-[0_4px_30px_rgba(0,0,0,0.06)]",
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

      {/* Logo section — becomes sticky when search docks */}
      <header
        className={cn(
          className,
          isSearchDocked && "sticky top-0 z-40 shadow-lg"
        )}
      >
        <div className="bg-[hsl(var(--brand-navy))]" style={{ backgroundColor: "#081129" }}>
          <div className="px-3 md:px-4 lg:px-8 xl:px-12">
            <div
              className={cn(
                "flex items-center gap-2 transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                isSearchDocked ? "py-2 md:py-3" : "py-4 md:py-6 lg:py-8"
              )}
            >
              {/* Left spacer — collapses when docked so logo shifts left */}
              <div
                className={cn(
                  "min-w-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                  isSearchDocked ? "flex-[0]" : "flex-1"
                )}
              />

              {/* Logo + Tagline */}
              <Link
                to="/"
                className="flex items-center flex-shrink-0 min-w-0 gap-3 md:gap-4 lg:gap-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 motion-reduce:transition-none"
              >
                <img
                  src={mainLogo}
                  alt="myhealth checkup"
                  className={cn(
                    "w-auto object-contain flex-shrink-0 transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                    isSearchDocked
                      ? "h-10 md:h-12 lg:h-14"
                      : "h-12 md:h-14 lg:h-[5rem] xl:h-[5.5rem]"
                  )}
                />
                <img
                  src={headerTagline}
                  alt="Your Health. Your Choice. One Trusted Platform!"
                  aria-hidden={isSearchDocked}
                  className={cn(
                    "w-auto object-contain transition-[height,max-width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                    isSearchDocked
                      ? "h-0 max-w-0 opacity-0"
                      : "h-12 md:h-14 lg:h-[5rem] xl:h-[5.5rem] max-w-[40vw] lg:max-w-[50vw] opacity-100"
                  )}
                />
              </Link>

              {/* Docked search — fades in when scrolled past hero */}
              <div
                className={cn(
                  "flex items-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none overflow-hidden",
                  isSearchDocked
                    ? "flex-1 max-w-[640px] ml-4 md:ml-6 opacity-100"
                    : "flex-[0] max-w-0 ml-0 opacity-0 pointer-events-none"
                )}
                aria-hidden={!isSearchDocked}
              >
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/80 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    placeholder="COMPARE OVER 200 TESTS"
                    aria-label="Search blood tests and health screenings"
                    value={dockedSearchTerm}
                    onChange={(e) => setDockedSearchTerm(e.target.value)}
                    onKeyDown={handleDockedSearchKey}
                    tabIndex={isSearchDocked ? 0 : -1}
                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 text-sm md:text-base font-bold rounded-lg bg-white/10 border-2 border-[#22c0d4]/60 text-white placeholder:text-white/70 backdrop-blur-md focus:ring-2 focus:ring-white/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Right controls */}
              <div
                className={cn(
                  "min-w-0 flex items-center justify-end transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                  isSearchDocked ? "flex-[0_0_auto]" : "flex-1"
                )}
              >
                <nav className="flex items-center gap-1 md:gap-2 lg:gap-3" aria-label="User controls">
                  <LanguageSwitcher />
                  <UserMenu />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>


      {/* Toolbar sticks below the promo ticker independently */}
      <div
        className="sticky z-40"
        style={{ top: tickerHeight }}
      >
        {/* Divider removed */}

        <div
          className={cn(
            toolbarClasses,
            "transition-all duration-300",
            isToolbarSticky && "shadow-lg animate-fade-in",
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
