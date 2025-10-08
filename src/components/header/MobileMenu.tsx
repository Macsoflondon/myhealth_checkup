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
      <button onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen} aria-controls="mobile-menu" className="lg:hidden h-10 px-3 flex items-center justify-center touch-manipulation text-[#dc27a0] hover:text-[#22c0d4] bg-white/10 hover:bg-[#22c0d4]/20 border-[3px] border-white/60 hover:border-[#22c0d4] rounded-md transition-colors">
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile dropdown navigation */}
      <MobileDropdownMenu isOpen={isMenuOpen} onItemClick={toggleMenu} />
    </>;
};