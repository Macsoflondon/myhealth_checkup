import { describe, it, expect, afterEach, beforeAll } from "vitest";
import { render, cleanup, within } from "@testing-library/react";
import PromoTicker from "../PromoTicker";

// jsdom doesn't ship ResizeObserver
beforeAll(() => {
  if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === "undefined") {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

/**
 * Smoke test for the rAF-driven PromoTicker (cloned from TestCategoryTicker).
 *
 * We don't drive the animation loop — we just assert structure: the track
 * exists with the expected testid, and every promo is rendered multiple times
 * (one copy per SET) so the marquee can wrap seamlessly.
 */

describe("PromoTicker", () => {
  afterEach(() => cleanup());

  it("renders the promo strip", () => {
    const { getByLabelText } = render(<PromoTicker />);
    expect(
      getByLabelText("Promotional offers from health test providers")
    ).toBeTruthy();
  });

  it("renders the marquee track with the test id", () => {
    const { getByTestId } = render(<PromoTicker />);
    const track = getByTestId("promo-ticker-track");
    expect(track).toBeTruthy();
    expect(track.className).toContain("flex");
  });

  it("duplicates every promo across multiple sets so the marquee wraps", () => {
    const { getByLabelText } = render(<PromoTicker />);
    const strip = getByLabelText(
      "Promotional offers from health test providers"
    ) as HTMLElement;
    const utils = within(strip);

    // SETS = 8, so each promo label/text should appear 8 times.
    expect(utils.getAllByText("GOODBODY:").length).toBeGreaterThanOrEqual(2);
    expect(utils.getAllByText("MEDICHECKS:").length).toBeGreaterThanOrEqual(2);
    expect(utils.getAllByText("LOLA HEALTH:").length).toBeGreaterThanOrEqual(2);

    expect(
      utils.getAllByText("GOODBODY5").length
    ).toBeGreaterThanOrEqual(2);
    expect(
      utils.getAllByText("APRIL20").length
    ).toBeGreaterThanOrEqual(2);
    expect(
      utils.getAllByText("Mar20").length
    ).toBeGreaterThanOrEqual(2);
  });
});
