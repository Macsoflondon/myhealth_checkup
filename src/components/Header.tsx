import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "./header/Logo";
import { SearchBar } from "./header/SearchBar";
import { NavigationItems } from "./header/NavigationItems";
import { UserMenu } from "./header/UserMenu";
import { MobileMenu } from "./header/MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          <Logo />
          <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Main header bar */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-8 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>
          
          {/* User Menu */}
          <div className="flex-shrink-0">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="px-6 py-2 max-w-7xl mx-auto">
          <NavigationItems className="flex items-center justify-center gap-8" />
        </div>
      </div>
    </header>
  );
};
export default Header;