import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const MobileMenu = ({
  isMenuOpen,
  toggleMenu
}: MobileMenuProps) => {
  return (
    <Button 
      variant="ghost"
      size="sm"
      onClick={toggleMenu} 
      aria-label={isMenuOpen ? "Close menu" : "Open menu"} 
      aria-expanded={isMenuOpen} 
      aria-controls="mobile-menu" 
      className={cn(
        "lg:hidden h-9 w-9 p-0 rounded-md transition-colors flex-shrink-0",
        isMenuOpen 
          ? "bg-[#22c0d4]/20 text-[#22c0d4] border-2 border-[#22c0d4]" 
          : "text-[#e70d69] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-2 border-[#e70d69]/60 hover:border-[#22c0d4]"
      )}
    >
      <div className="relative h-4.5 w-4.5">
        <Menu 
          className={cn(
            "h-4 w-4 absolute inset-0 transition-all duration-300 ease-out",
            isMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          )} 
        />
        <X 
          className={cn(
            "h-4 w-4 absolute inset-0 transition-all duration-300 ease-out",
            isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          )} 
        />
      </div>
    </Button>
  );
};
