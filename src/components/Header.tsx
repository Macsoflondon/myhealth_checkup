import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { User, ShoppingCart, Search } from "lucide-react";
import { Logo } from "./header/Logo";
import { NavigationItems } from "./header/NavigationItems";
import { MobileMenu } from "./header/MobileMenu";
import { ErrorBoundary } from "./ErrorBoundary";
import styles from "./Header.module.css";
interface HeaderProps {
  className?: string;
}
const Header = ({
  className
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  if (isMobile) {
    return <ErrorBoundary>
        <header className={cn("sticky top-0 z-50 bg-white shadow-md", className)}>
          <div className="px-3 py-2 flex justify-between items-center gap-2 bg-white h-14">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/auth" className="p-2">
                <User className="h-5 w-5 text-gray-700" />
              </Link>
              <Link to="/dashboard" className="p-2 relative">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-[#e70d69] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </Link>
              <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </header>
      </ErrorBoundary>;
  }
  return <ErrorBoundary>
      <header className={cn("sticky top-0 z-50 bg-white shadow-md", className)}>
        {/* Main header bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between py-3 gap-4">
              {/* Logo and tagline */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link to="/" className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png" 
                    alt="myhealth checkup" 
                    className="h-12 w-12"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold leading-tight">
                      <span className="text-gray-900">myhealth</span>{" "}
                      <span className="text-[#22c0d4]">checkup</span>
                    </span>
                  </div>
                </Link>
                <span className="hidden lg:block text-[#22c0d4] font-medium text-sm ml-2">
                  Your health is your greatest asset!
                </span>
              </div>
              
              {/* Search bar */}
              <div className="flex-1 max-w-xl mx-4 hidden md:flex">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search from over 300 tests"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#22c0d4]"
                  />
                  <button className="absolute right-0 top-0 bottom-0 bg-[#e70d69] text-white px-6 rounded-r-lg hover:bg-[#d00c5f] transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Right side - User and Cart */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <Link to="/auth" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="h-6 w-6 text-gray-700" />
                </Link>
                <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-[#e70d69] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-8">
            <NavigationItems className="flex items-center justify-center gap-1" />
          </div>
        </div>
      </header>
    </ErrorBoundary>;
};
export default Header;