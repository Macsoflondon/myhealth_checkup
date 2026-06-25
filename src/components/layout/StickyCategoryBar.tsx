import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavigationMenu } from "@/components/header/NavigationMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface StickyCategoryBarProps {
  /**
   * If set, the bar stays hidden until the element with this id scrolls out of view.
   * This guarantees the bar never overlaps the hero on any screen size.
   */
  hideUntilTriggerId?: string;
}

export const StickyCategoryBar = ({ hideUntilTriggerId }: StickyCategoryBarProps) => {
  const [visible, setVisible] = useState(hideUntilTriggerId === undefined);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!hideUntilTriggerId) {
      setVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let raf = 0;

    const attach = () => {
      const el = document.getElementById(hideUntilTriggerId);
      if (!el) {
        // Sentinel not mounted yet — retry next frame.
        raf = requestAnimationFrame(attach);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          // Visible once the sentinel (placed at end of hero) is no longer
          // intersecting the viewport from the top.
          const rect = entry.boundingClientRect;
          setVisible(!entry.isIntersecting && rect.top <= 0);
        },
        { threshold: 0, rootMargin: "0px" }
      );
      observer.observe(el);
    };

    attach();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [hideUntilTriggerId]);

  return (
    <div
      className={`sticky top-0 z-50 bg-[#081129]/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-2">
        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-semibold text-white tracking-wide">
                Browse categories
              </span>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label={open ? "Close category menu" : "Open category menu"}
                  aria-expanded={open}
                  aria-controls="sticky-category-sheet"
                  className="inline-flex items-center gap-2 min-h-11 min-w-11 px-3 rounded-lg text-white bg-white/10 hover:bg-white/15 active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2 focus-visible:ring-offset-[#081129] transition"
                >
                  {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
                  <span className="text-sm font-semibold">Menu</span>
                </button>
              </SheetTrigger>
            </div>

            <SheetContent
              id="sticky-category-sheet"
              side="right"
              className="w-[88vw] max-w-sm bg-[#081129] border-l border-white/10 p-0 text-white"
            >
              <SheetHeader className="px-4 py-4 border-b border-white/10 text-left">
                <SheetTitle className="text-white text-base font-heading">Categories</SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Sticky category navigation"
                className="px-3 py-4 overflow-y-auto max-h-[calc(100dvh-64px)]"
              >
                <NavigationMenu onItemClick={() => setOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav aria-label="Sticky category navigation">
            <NavigationMenu />
          </nav>
        )}
      </div>
    </div>
  );
};

export default StickyCategoryBar;
