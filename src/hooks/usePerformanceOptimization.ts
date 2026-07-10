import { useEffect } from "react";
import { logger } from "@/lib/logger";

/**
 * Lightweight perf hook for the homepage / LCP route.
 *
 * Responsibilities:
 *  - Dev-only Web Vitals observers (LCP / FID / CLS) for in-loop debugging.
 *  - Defensive cleanup of stale `cache_*` localStorage entries (>10 min old).
 *
 * Intentionally NOT done here:
 *  - DNS prefetch / preconnect — these belong in index.html where they take
 *    effect before React hydrates.
 *  - Viewport meta override — set once in index.html / per-page Helmet.
 *  - data-src lazy-loading observer — every <img> on the platform uses native
 *    `loading="lazy"`, which is more reliable.
 *  - Critical-CSS injection — the broken `aspect-ratio: attr(...)` rule was
 *    invalid (attr() only works in `content`) and the rest is in index.css.
 */
export function usePerformanceOptimization() {
  useEffect(() => {
    const observers: PerformanceObserver[] = [];

    if (import.meta.env.DEV && "PerformanceObserver" in window) {
      try {
        const lcp = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) logger.debug("LCP:", last.startTime);
        });
        lcp.observe({ entryTypes: ["largest-contentful-paint"] });
        observers.push(lcp);

        const fid = new PerformanceObserver((list) => {
          list.getEntries().forEach((e) => {
            const entry = e as PerformanceEntry & { processingStart?: number };
            if (entry.processingStart) {
              logger.debug("FID:", entry.processingStart - entry.startTime);
            }
          });
        });
        fid.observe({ entryTypes: ["first-input"] });
        observers.push(fid);

        const cls = new PerformanceObserver((list) => {
          list.getEntries().forEach((e) => {
            const entry = e as PerformanceEntry & {
              value?: number;
              hadRecentInput?: boolean;
            };
            if (!entry.hadRecentInput && typeof entry.value === "number") {
              logger.debug("CLS:", entry.value);
            }
          });
        });
        cls.observe({ entryTypes: ["layout-shift"] });
        observers.push(cls);
      } catch {
        // Observer types may be unsupported — silently ignore
      }
    }

    // Drop stale localStorage cache entries on idle
    const scheduleIdle =
      window.requestIdleCallback ||
      ((cb: IdleRequestCallback) =>
        setTimeout(cb as unknown as TimerHandler, 1));
    const idleId = scheduleIdle(() => {
      try {
        const now = Date.now();
        const TTL = 10 * 60 * 1000;
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key?.startsWith("cache_")) continue;
          try {
            const item = JSON.parse(localStorage.getItem(key) || "{}");
            if (item.timestamp && now - item.timestamp > TTL) keysToRemove.push(key);
          } catch {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {
        // localStorage unavailable (privacy mode) — ignore
      }
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      if (window.cancelIdleCallback && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);
}
