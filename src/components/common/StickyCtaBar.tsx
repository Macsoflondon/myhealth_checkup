import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyCtaBarProps {
  /** Scroll threshold in pixels before showing the bar */
  showAfter?: number;
}

const StickyCtaBar = ({ showAfter = 600 }: StickyCtaBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-[#081129] border-t border-[#22c0d4]/20 shadow-lg",
        "transform transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Message */}
          <div className="hidden sm:block">
            <p className="text-white text-sm sm:text-base font-sans">
              <span className="text-[#22c0d4] font-medium">200+ tests</span> from trusted UK providers
            </p>
          </div>

          {/* Mobile: Compact message */}
          <p className="sm:hidden text-white text-sm font-sans">
            Compare <span className="text-[#22c0d4]">200+ tests</span>
          </p>

          {/* Right: CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              onClick={() => navigate("/compare")}
              className="bg-[#22c0d4] hover:bg-[#1ba8b8] text-white font-semibold rounded-lg shadow-md px-4 sm:px-6"
            >
              Compare
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-white/60 hover:text-white hover:bg-white/10 p-1.5 h-auto"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCtaBar;
