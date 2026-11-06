import { useEffect, useState } from "react";

/**
 * True while the visitor is scrolling down on a narrow screen; false once they
 * stop (after `idleMs`) or scroll up. Wider screens always return false.
 */
export const useHideOnScrollDown = (maxWidth = 639, idleMs = 600): boolean => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${maxWidth}px)`);
    let lastY = window.scrollY;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (!query.matches) return setHidden(false);
      if (delta > 2) setHidden(true);
      else if (delta < -2) setHidden(false);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setHidden(false), idleMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [maxWidth, idleMs]);

  return hidden;
};
