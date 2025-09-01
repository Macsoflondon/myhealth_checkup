import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "./header/Logo";
import { NavigationItems } from "./header/NavigationItems";
import { UserMenu } from "./header/UserMenu";
import { MobileMenu } from "./header/MobileMenu";
import PromoBanner from "./PromoBanner";
import CategoryFilters from "./CategoryFilters";
import TrustSignals from "./TrustSignals";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <PromoBanner />
      <div className="container mx-auto px-4 py-3 lg:py-4 flex justify-between items-center bg-white">
        <Logo />

        <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationItems className="flex items-center gap-6" />
          <UserMenu />
        </div>
      </div>
      <CategoryFilters />
      <TrustSignals />
    </header>
  );
};
export default Header;