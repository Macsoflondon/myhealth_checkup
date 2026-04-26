import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, within } from "@testing-library/react";
import PromoTicker from "../PromoTicker";

/**
 * Smoke test for the new pure-CSS PromoTicker.
 *
 * The animation runs in CSS, so we don't drive timers — we just assert the
 * structure: every promo string is rendered twice (duplicated track for
 * seamless wrap) and the track has the marquee animation class.
 */

describe("PromoTicker", () => {
  afterEach(() => cleanup());

  it("renders the promo strip", () => {
    const { getByLabelText } = render(<PromoTicker />);
    expect(
      getByLabelText("Promotional offers from health test providers")
    ).toBeTruthy();
  });

  it("duplicates every promo so the marquee wraps seamlessly", () => {
    const { getByLabelText } = render(<PromoTicker />);
    const strip = getByLabelText(
      "Promotional offers from health test providers"
    ) as HTMLElement;
    const utils = within(strip);

    expect(utils.getAllByText("GoodBody:")).toHaveLength(2);
    expect(utils.getAllByText("Medichecks:")).toHaveLength(2);
    expect(utils.getAllByText("Lola Health:")).toHaveLength(2);

    expect(
      utils.getAllByText("5% off on all popular blood tests")
    ).toHaveLength(2);
    expect(
      utils.getAllByText("20% off all tests with code APRIL20")
    ).toHaveLength(2);
    expect(utils.getAllByText("£20 off with code Mar20")).toHaveLength(2);
  });

  it("wires the marquee animation class onto the track", () => {
    const { getByTestId } = render(<PromoTicker />);
    const track = getByTestId("promo-ticker-track");
    expect(track.className).toContain("animate-marquee");
  });
});
