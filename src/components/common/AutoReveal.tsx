import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

// Headings rise in; whole sections fade in as they scroll into view.
const TARGETS: ReadonlyArray<readonly [string, string]> = [
  ["h2, .type-section-title", "rise"],
  ["section", "fade"],
];

/**
 * Applies the shared reveal animation to headings and sections that
 * start below the fold. Server HTML is untouched, so crawlers and no-JS
 * visitors always see full content; elements already on screen never hide.
 */
export function AutoReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (
      typeof IntersectionObserver === "undefined" ||
      typeof Element.prototype.animate !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    // Animation effects do not mutate React-owned attributes. Deferred sections
    // can therefore hydrate without seeing reveal attributes absent from SSR.
    const animations = new Map<HTMLElement, Animation>();
    const pending = new Set<HTMLElement>();
    const theme = getComputedStyle(document.documentElement);
    const durationToken = theme.getPropertyValue("--duration-reveal").trim();
    const duration =
      Number.parseFloat(durationToken) *
        (durationToken.endsWith("ms") ? 1 : 1000) || 600;
    const easing = theme.getPropertyValue("--ease-emphasized").trim() || "ease";
    const reveal = (element: HTMLElement) => {
      pending.delete(element);
      animations.get(element)?.play();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
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
          for (const ancestor of pending) {
            if (ancestor.contains(el)) return;
          }
          if (el.getBoundingClientRect().top < fold) return;
          const animation = el.animate(
            [
              {
                opacity: 0,
                transform:
                  variant === "rise" ? "translate3d(0, 16px, 0)" : "none",
              },
              { opacity: 1, transform: "none" },
            ],
            { duration, easing, fill: "both" },
          );
          animation.pause();
          animation.currentTime = 0;
          animation.onfinish = () => {
            animation.cancel();
            animations.delete(el);
          };
          animations.set(el, animation);
          pending.add(el);
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
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < limit) reveal(el);
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
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return null;
}
