import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import PromoTracker from "../PromoTracker";

/**
 * Smoke test for the homepage promo ticker.
 *
 * The ticker is a rAF-driven transform animation. We can't run a real browser
 * E2E here, but jsdom + fake rAF lets us assert the same observable behaviour:
 * the inner track's translateX changes over time. We run the assertion at both
 * the mobile and desktop viewport widths the production header uses.
 */

const VIEWPORTS = [
  { name: "mobile", width: 390 },
  { name: "desktop", width: 1440 },
];

const setViewport = (width: number) => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 844 });
};

const stubResizeObserver = () => {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (window as unknown as { ResizeObserver: typeof RO }).ResizeObserver = RO;
};

const stubGetBoundingClientRect = () => {
  // jsdom returns 0 for layout. Give every span a real width so the ticker
  // measures a non-zero set width and starts translating.
  const original = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function () {
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 40,
      right: 200,
      width: 200,
      height: 40,
      toJSON: () => ({}),
    } as DOMRect;
  };
  return () => {
    HTMLElement.prototype.getBoundingClientRect = original;
  };
};

const readTranslateX = (el: HTMLElement | null): number => {
  if (!el) return NaN;
  const match = el.style.transform.match(/translate3d\(([-\d.]+)px/);
  return match ? parseFloat(match[1]) : 0;
};

describe("PromoTracker", () => {
  let restoreRect: () => void;

  beforeEach(() => {
    stubResizeObserver();
    restoreRect = stubGetBoundingClientRect();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreRect();
    cleanup();
  });

  for (const vp of VIEWPORTS) {
    it(`scrolls the ticker on ${vp.name} (${vp.width}px)`, async () => {
      setViewport(vp.width);

      const { container } = render(<PromoTracker />);
      const track = container.querySelector<HTMLDivElement>(
        '[aria-label^="Promotional offers"] > div'
      );
      expect(track).not.toBeNull();

      // Drive a few rAF frames forward in time so the animation loop runs.
      await vi.advanceTimersByTimeAsync(0); // initial measure
      const before = readTranslateX(track);

      // ~3 seconds of animation time
      for (let i = 0; i < 180; i++) {
        await vi.advanceTimersByTimeAsync(16);
      }
      const after = readTranslateX(track);

      // Track should have moved leftwards (negative translate) by a meaningful amount.
      expect(after).toBeLessThan(before);
      expect(before - after).toBeGreaterThan(5);
    });
  }
});