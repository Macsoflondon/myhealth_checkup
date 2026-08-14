import { useEffect, useRef, useState } from "react";

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Wraps a section in a scroll reveal animation.
 * - Fades + rises 24px into view when scrolled into viewport.
 * - Fires once, triggers when the element is ~10% inside the viewport.
 * - Respects prefers-reduced-motion (handled by the CSS transition being skipped).
 *
 * Implemented with IntersectionObserver + a CSS transition rather than
 * framer-motion so the homepage never pays for an animation library.
 */
const SectionReveal = ({ children, delay = 0, className }: SectionRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out ${
        revealed
          ? "opacity-100 translate-y-0"
          : "motion-safe:opacity-0 motion-safe:translate-y-6"
      } ${className ?? ""}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};

export default SectionReveal;
