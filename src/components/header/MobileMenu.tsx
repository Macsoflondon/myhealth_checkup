
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
        className="lg:hidden"
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
        className={`lg:hidden bg-white border-t py-4 px-4 shadow-md ${isMenuOpen ? 'block' : 'hidden'}`}
        aria-hidden={!isMenuOpen}
      >
        <NavigationItems 
          onItemClick={toggleMenu} 
          className="flex flex-col space-y-4"
        />
        <UserMenu isMobile onItemClick={toggleMenu} />
      </div>
    </>
  );
};
