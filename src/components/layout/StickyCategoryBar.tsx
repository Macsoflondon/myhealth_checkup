import { useEffect, useState } from "react";
import { NavigationMenu } from "@/components/header/NavigationMenu";

interface StickyCategoryBarProps {
  /** If set, bar stays hidden until window.scrollY exceeds this threshold (px). */
  hideUntilScroll?: number;
}

export const StickyCategoryBar = ({ hideUntilScroll }: StickyCategoryBarProps) => {
  const [visible, setVisible] = useState(hideUntilScroll === undefined);

  useEffect(() => {
    if (hideUntilScroll === undefined) {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > hideUntilScroll);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideUntilScroll]);

  return (
    <div
      className={`sticky top-0 z-50 bg-[#081129]/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-2">
        <NavigationMenu />
      </div>
    </div>
  );
};

export default StickyCategoryBar;
