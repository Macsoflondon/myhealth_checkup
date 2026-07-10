import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  /** Min height of the placeholder so layout doesn't jump. */
  minHeight?: number | string;
  /** How far before the section enters the viewport to mount. */
  rootMargin?: string;
  /** Optional placeholder content (defaults to an empty sized div). */
  fallback?: ReactNode;
}

/**
 * Mounts `children` only when the placeholder scrolls near the viewport.
 * Keeps initial DOM/JS cost low for below-the-fold homepage sections.
 */
export const LazyMount = ({
  children,
  minHeight = 400,
  rootMargin = "600px 0px",
  fallback,
}: LazyMountProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible || typeof IntersectionObserver === "undefined") {
      if (!visible) setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  if (visible) return <>{children}</>;

  return (
    <div
      ref={ref}
      style={{ minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }}
      aria-hidden="true"
    >
      {fallback}
    </div>
  );
};

export default LazyMount;
