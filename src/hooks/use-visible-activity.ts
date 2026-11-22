import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/** No polling: activity changes only on intersection, visibility or motion changes. */
export function observeVisibleActivity(
  element: HTMLElement,
  onChange: (active: boolean) => void,
  respectReducedMotion = true,
) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = { intersects: false };
  const update = () =>
    onChange(
      state.intersects &&
        document.visibilityState === "visible" &&
        (!respectReducedMotion || !media.matches),
    );
  const observer = new IntersectionObserver((entries) => {
    state.intersects = entries.some((entry) => entry.isIntersecting);
    update();
  });
  observer.observe(element);
  document.addEventListener("visibilitychange", update);
  media.addEventListener("change", update);
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", update);
    media.removeEventListener("change", update);
    onChange(false);
  };
}

export function useVisibleActivity<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    return observeVisibleActivity(ref.current, setActive);
  }, []);
  return { ref, active };
}

/** The original 0.5 px/frame at 60Hz is 30 px/s, independent of refresh rate. */
export function useCompositorMarquee(
  ref: RefObject<HTMLDivElement | null>,
  setCount: number,
) {
  useEffect(() => {
    const track = ref.current;
    if (!track || setCount <= 0) return;
    const measure = () => {
      const first = track.children.item(0);
      const next = track.children.item(setCount);
      if (!(first instanceof HTMLElement) || !(next instanceof HTMLElement))
        return;
      const width = next.offsetLeft - first.offsetLeft;
      if (width <= 0) return;
      track.style.setProperty("--marquee-distance", `${-width}px`);
      track.style.setProperty("--marquee-duration", `${width / 30}s`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [ref, setCount]);
}
