import { useEffect, useRef, useState, type ReactNode, type ElementType, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal — Phase 1 motion primitive.
 *
 * Fades + translates children into view once as they intersect the viewport.
 * CSS-driven (see [data-reveal] in index.css) with a single IntersectionObserver
 * per instance. Respects prefers-reduced-motion automatically via the CSS layer.
 *
 * Usage:
 *   <Reveal>...</Reveal>
 *   <Reveal as="section" delay={120} amount={0.2}>...</Reveal>
 *
 * Delay is applied via inline transition-delay so multiple children can be
 * staggered (e.g. map with index * 80).
 */
export interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Delay in ms before the transition starts once visible. */
  delay?: number;
  /** IntersectionObserver threshold. Default 0.15. */
  amount?: number;
  /** Fire once (default) or every time the element re-enters the viewport. */
  once?: boolean;
  style?: CSSProperties;
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  amount = 0.15,
  once = true,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: skip observation and reveal immediately.
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount, once]);

  return (
    <Tag
      ref={ref as never}
      data-reveal={visible ? "visible" : "hidden"}
      className={cn(className)}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
