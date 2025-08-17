
import { Menu, X } from "lucide-react";
import { NavigationItems } from "./NavigationItems";
import { UserMenu } from "./UserMenu";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const MobileMenu = ({ isMenuOpen, toggleMenu }: MobileMenuProps) => {
  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="lg:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile navigation */}
      <div 
        id="mobile-menu"
        className={`fixed inset-x-0 top-[calc(100%)] lg:hidden bg-white border-t shadow-lg z-40 transition-transform duration-200 ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="py-4 px-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <NavigationItems 
            onItemClick={toggleMenu} 
            className="flex flex-col space-y-1 mb-4"
          />
          <UserMenu isMobile onItemClick={toggleMenu} />
        </div>
      </div>
    </>
  );
};
