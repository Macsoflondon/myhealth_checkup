import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const MobileMenu = ({
  isMenuOpen,
  toggleMenu
}: MobileMenuProps) => {
  return (
    <button 
      onClick={toggleMenu} 
      aria-label={isMenuOpen ? "Close menu" : "Open menu"} 
      aria-expanded={isMenuOpen} 
      aria-controls="mobile-menu" 
      className={cn(
        "lg:hidden h-11 w-11 flex items-center justify-center touch-manipulation",
        "rounded-xl transition-all duration-200 active:scale-90",
        "min-h-[44px] min-w-[44px]", // Minimum touch target size
        isMenuOpen 
          ? "bg-[hsl(var(--primary))] text-white shadow-lg shadow-[hsl(var(--primary))]/30" 
          : "text-white bg-white/10 hover:bg-white/20 border border-white/20"
      )}
    >
      <div className="relative w-5 h-5">
        {/* Animated hamburger to X transition */}
        <span 
          className={cn(
            "absolute left-0 top-[4px] w-5 h-0.5 bg-current transition-all duration-300 ease-out",
            isMenuOpen && "rotate-45 translate-y-[6px]"
          )} 
        />
        <span 
          className={cn(
            "absolute left-0 top-[10px] w-5 h-0.5 bg-current transition-all duration-200",
            isMenuOpen && "opacity-0 scale-x-0"
          )} 
        />
        <span 
          className={cn(
            "absolute left-0 top-[16px] w-5 h-0.5 bg-current transition-all duration-300 ease-out",
            isMenuOpen && "-rotate-45 -translate-y-[6px]"
          )} 
        />
      </div>
    </button>
  );
};
