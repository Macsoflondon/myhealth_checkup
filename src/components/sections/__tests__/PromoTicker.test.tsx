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

    // SETS = 8, so each promo label should appear once per set. Match
    // provider names case-insensitively — the uppercasing is CSS-only
    // (text-transform), which Testing Library does not apply. Don't assert
    // on promo copy: it changes with marketing campaigns.
    expect(
      utils.getAllByText(/goodbody:/i).length
    ).toBeGreaterThanOrEqual(2);
    expect(
      utils.getAllByText(/medichecks:/i).length
    ).toBeGreaterThanOrEqual(2);
    expect(
      utils.getAllByText(/lola health:/i).length
    ).toBeGreaterThanOrEqual(2);
  });
});
