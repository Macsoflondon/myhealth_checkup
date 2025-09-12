import { Menu, X } from "lucide-react";
import { MobileDropdownMenu } from "./MobileDropdownMenu";
interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}
export const MobileMenu = ({
  isMenuOpen,
  toggleMenu
}: MobileMenuProps) => {
  return <>
      {/* Mobile menu button */}
      <button onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen} aria-controls="mobile-menu" className="lg:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation text-[#dc27a0] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border border-[#dc27a0]/20 hover:border-[#22c0d4]/20 rounded-lg transition-colors">
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile dropdown navigation */}
      <MobileDropdownMenu isOpen={isMenuOpen} onItemClick={toggleMenu} />
    </>;
};