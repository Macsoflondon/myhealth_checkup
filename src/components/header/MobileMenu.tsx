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
      <button onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen} aria-controls="mobile-menu" className="lg:hidden h-11 w-11 flex items-center justify-center touch-manipulation text-[#e70d69] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-[3px] border-[#e70d69]/60 hover:border-[#22c0d4] rounded-md transition-colors active:scale-95">
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile dropdown navigation */}
      <MobileDropdownMenu isOpen={isMenuOpen} onItemClick={toggleMenu} />
    </>;
};