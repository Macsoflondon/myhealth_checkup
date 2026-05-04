import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Logo } from "../header/Logo";
import mainLogo from "@/assets/myhealth-logo-cropped.webp";
import headerTagline from "@/assets/header-tagline.webp";
import mobileLogo from "@/assets/myhealth-logo-cropped.webp";
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
  const promoTrackerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isMobile = useIsMobile();

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
            {/* Top gradient divider */}
            <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
            <div className="container mx-auto max-w-full px-3 sm:px-4 bg-tertiary">
              <div className="py-4 flex items-start justify-between gap-6 sm:gap-8 min-w-0 bg-tertiary">
                <Link to="/" className="flex min-w-0 flex-1 items-start overflow-hidden">
                  <img
                    src={mobileLogo}
                    alt="myhealth checkup"
                    className="h-[80px] xs:h-[90px] sm:h-[100px] w-auto max-w-[calc(100vw-11rem)] object-contain object-left"
                  />
                </Link>

                <nav className="flex shrink-0 items-center gap-0.5 self-start pt-1" aria-label="User controls">
                  <LanguageSwitcher />
                  <UserMenu isMobile />
                  <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                </nav>
              </div>
            </div>
            {/* Bottom gradient divider */}
            <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

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
    "bg-[hsl(220,5%,97%)] border-b border-gray-200/30 my-0 mx-0 px-0 py-1 shadow-[0_4px_30px_rgba(0,0,0,0.06)]",
    styles.toolbar
  );
  return (
    <ErrorBoundary>
      {/* Promo ticker stays sticky at top */}
      <div ref={promoTrackerRef} className={cn("sticky top-0 z-50", className)}>
        <PromoTicker />
      </div>

      {/* Logo section scrolls normally */}
      <header className={className}>
        <div className="bg-[hsl(var(--brand-navy))]" style={{ backgroundColor: "#081129" }}>
          <div className="px-4 lg:px-8 xl:px-12">
            <div className="flex items-center py-8">
              {/* Left spacer for balance */}
              <div className="flex-1" />

              {/* Center: Logo + Tagline side by side */}
              <Link to="/" className="flex items-center justify-center flex-shrink-0 gap-6 transition-all duration-200 hover:scale-105">
                <img
                  src={mainLogo}
                  alt="myhealth checkup"
                  className="h-[4.5rem] lg:h-[5rem] xl:h-[5.5rem] w-auto object-contain"
                />
                <img
                  src={headerTagline}
                  alt="Your Health. Your Choice. One Trusted Platform!"
                  className="h-[4.5rem] lg:h-[5rem] xl:h-[5.5rem] w-auto object-contain max-w-[50vw]"
                />
              </Link>

              {/* Right: Controls pushed to far right */}
              <div className="flex-1 flex items-center justify-end">
                <nav className="flex items-center gap-3" aria-label="User controls">
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
        {/* Top gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
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
        {/* Bottom gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      </div>
    </ErrorBoundary>
  );
};
export default Header;
