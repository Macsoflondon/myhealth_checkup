import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Logo } from "../header/Logo";
import mainLogo from "@/assets/myhealth-logo.png";
import headerTagline from "@/assets/header-tagline.png";
import mobileLogo from "@/assets/myhealth-mobile-logo.png";
import { SearchBar } from "../header/SearchBar";
import { NavigationItems } from "../header/NavigationItems";
import { UserMenu } from "../header/UserMenu";
import { MobileMenu } from "../header/MobileMenu";
import { MobileNavigationDrawer } from "../header/MobileNavigationDrawer";
import { LanguageSwitcher } from "../header/LanguageSwitcher";
import { UtilityBar } from "../header/UtilityBar";
import { ErrorBoundary } from "../common/ErrorBoundary";
import BrandTicker from "../sections/BrandTicker";
import styles from "./Header.module.css";

interface HeaderProps {
  className?: string;
}
const Header = ({ className }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);
  const [tickerHeight, setTickerHeight] = useState(0);
  const brandTickerRef = useRef<HTMLDivElement>(null);
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

  // Measure BrandTicker height for sticky toolbar offset (desktop only)
  useEffect(() => {
    if (isMobile || !brandTickerRef.current) return;
    const measure = () => {
      if (brandTickerRef.current) {
        setTickerHeight(brandTickerRef.current.getBoundingClientRect().height);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(brandTickerRef.current);
    return () => observer.disconnect();
  }, [isMobile]);
  if (isMobile) {
    return (
      <ErrorBoundary>
        <div className={cn("sticky top-0 z-50", className)}>
          <BrandTicker />
          <header className="bg-[#081129] shadow-md">
            {/* Top gradient divider */}
            <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
            <div className="container mx-auto px-3 sm:px-4">
              {/* Single row: Logo left, Nav controls right */}
              <div className="py-0.5 flex items-center justify-between gap-1.5">
                {/* Left: Combined logo with tagline */}
                <Link to="/" className="flex items-center flex-shrink min-w-0">
                  <img
                    src={mobileLogo}
                    alt="myhealth checkup - Your health. Your choice. One trusted platform."
                    className="h-[100px] xs:h-[110px] sm:h-[120px] w-auto object-contain"
                  />
                </Link>

                {/* Right: Navigation controls */}
                <nav className="flex items-center gap-1 flex-shrink-0" aria-label="User controls">
                  <LanguageSwitcher />
                  <UserMenu isMobile />
                  <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                </nav>
              </div>
            </div>
            {/* Bottom gradient divider */}
            <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

            {/* Mobile Navigation Drawer */}
            <MobileNavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </header>
        </div>
      </ErrorBoundary>
    );
  }
  // Toolbar with glassmorphism
  const toolbarClasses = cn(
    "bg-[hsl(220,5%,97%)] border-b border-gray-200/30 my-0 mx-0 px-0 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.06)]",
    styles.toolbar
  );
  return (
    <ErrorBoundary>
      {/* BrandTicker stays sticky at top */}
      <div ref={brandTickerRef} className={cn("sticky top-0 z-50", className)}>
        <BrandTicker />
      </div>

      {/* Logo section scrolls normally */}
      <header className={className}>
        <div className="bg-[hsl(var(--brand-navy))]" style={{ backgroundColor: "#081129" }}>
          <div className="px-4 lg:px-8 xl:px-12">
            <div className="flex items-center py-0">
              {/* Left spacer for balance */}
              <div className="flex-1" />

              {/* Center: Combined logo with tagline */}
              <Link to="/" className="flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105">
                <img
                  src={logoWithTagline}
                  alt="myhealth checkup - Your Health. Your Choice. One Trusted Platform!"
                  className="h-28 lg:h-32 xl:h-36 w-auto object-contain"
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

      {/* Toolbar sticks below BrandTicker independently */}
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
            <NavigationItems className="flex items-center gap-0 flex-wrap justify-center" />
          </div>
        </div>
        {/* Bottom gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      </div>
    </ErrorBoundary>
  );
};
export default Header;
