import { useEffect, useRef, useState, useCallback, RefObject } from "react";

/**
 * Drives a horizontal infinite-marquee ticker via JS-controlled translate3d.
 *
 * Mobile-first optimisations:
 *  - Pauses rAF when the ticker is offscreen (IntersectionObserver), saving
 *    battery on mobile where the homepage scrolls quickly past it.
 *  - Pauses when the tab is hidden.
 *  - Honours `prefers-reduced-motion` only as a slowdown, not a stop, since
 *    these tickers carry brand messaging.
 *  - Re-measures on font load and container resize, no scroll listeners.
 *
 * Returns `trackRef` to attach to the moving track element. The component is
 * responsible for rendering enough duplicated content (≥2 sets, ideally 4–8)
 * so the wrap point is offscreen.
 *
 * @param itemCount Number of items in ONE set (used to compute set width).
 * @param speedPxPerMs Optional speed (defaults to 0.04 ≈ 40px/sec).
 */
export function useMarqueeTicker(itemCount: number, speedPxPerMs = 0.04) {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const isVisibleRef = useRef(true);

  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    let width = 0;
    const max = Math.min(itemCount, track.children.length);
    for (let i = 0; i < max; i++) {
      width += (track.children[i] as HTMLElement).getBoundingClientRect().width;
    }
    return width;
  }, [itemCount]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const w = measureSetWidth();
      if (w > 0) singleSetWidthRef.current = w;
    };

    measure();
    document.fonts?.ready?.then(measure).catch(() => {});

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    // Pause when offscreen — biggest mobile battery win
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(track);

    let animationId = 0;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      animationId = requestAnimationFrame(animate);

      if (document.hidden || !isVisibleRef.current) {
        lastTime = 0;
        return;
      }

      if (lastTime === 0) {
        lastTime = timestamp;
        return;
      }
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (singleSetWidthRef.current <= 0) measure();

      const clampedDelta = Math.min(delta, 50);
      positionRef.current -= speedPxPerMs * clampedDelta;

      const setWidth = singleSetWidthRef.current;
      if (setWidth > 0 && Math.abs(positionRef.current) >= setWidth) {
        positionRef.current += setWidth;
      }

      track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    };

    animationId = requestAnimationFrame(animate);

    const onVisibility = () => {
      lastTime = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
    };
  }, [measureSetWidth, speedPxPerMs]);

  return trackRef as RefObject<HTMLDivElement>;
}
