import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

// Headings rise in; whole sections fade in as they scroll into view.
const TARGETS: ReadonlyArray<readonly [string, string]> = [
  ["h2, .type-section-title", "rise"],
  ["section", "fade"],
];

/**
 * Applies the shared data-reveal animation to headings and sections that
 * start below the fold. Server HTML is untouched, so crawlers and no-JS
 * visitors always see full content; elements already on screen never hide.
 */
export function AutoReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const handled = new WeakSet<HTMLElement>();
    const scans = { frame: 0, sweep: 0 };
    const scan = () => {
      scans.frame = 0;
      const fold = window.innerHeight;
      for (const [selector, variant] of TARGETS) {
        document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          if (handled.has(el)) return;
          handled.add(el);
          if (
            el.hasAttribute("data-reveal") ||
            el.closest("[data-reveal], [role=dialog], nav, header")
          )
            return;
          if (el.getBoundingClientRect().top < fold) return;
          el.setAttribute("data-reveal-variant", variant);
          el.setAttribute("data-reveal", "hidden");
          observer.observe(el);
        });
      }
    };

    // Fallback for elements the observer cannot see (clipped or
    // content-visibility containers): reveal anything scrolled past.
    let ticking = false;
    const sweep = () => {
      ticking = false;
      const limit = window.innerHeight;
      document
        .querySelectorAll<HTMLElement>(
          '[data-reveal="hidden"][data-reveal-variant]',
        )
        .forEach((el) => {
          if (el.getBoundingClientRect().top < limit)
            el.setAttribute("data-reveal", "visible");
        });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      scans.sweep = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const scheduleScan = () => {
      if (!scans.frame) scans.frame = requestAnimationFrame(scan);
    };
    scheduleScan();
    // Catch lazily mounted sections.
    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(scans.frame);
      cancelAnimationFrame(scans.sweep);
      mutations.disconnect();
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      // Never leave content stranded hidden when this observer goes away.
      document
        .querySelectorAll('[data-reveal="hidden"][data-reveal-variant]')
        .forEach((el) => el.setAttribute("data-reveal", "visible"));
    };
  }, [pathname]);

  return null;
}
