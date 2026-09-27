import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestProviders } from "@/test/test-providers";
import { UniversalTestDetailModal, type UniversalTestData } from "../UniversalTestCard";
import { trackFunnelEvent } from "@/lib/funnelTracking";

vi.mock("@/lib/funnelTracking", () => ({ trackFunnelEvent: vi.fn() }));

const test: UniversalTestData = {
  id: "t-1",
  provider_id: "medichecks",
  test_name: "Thyroid Function Blood Test",
  price: 39,
  url: "https://www.medichecks.com/products/thyroid-function-blood-test",
};

describe("UniversalTestDetailModal provider link", () => {
  beforeEach(() => vi.mocked(trackFunnelEvent).mockClear());

  it("records a provider_click funnel event when the provider link is opened", () => {
    render(<UniversalTestDetailModal test={test} onClose={() => {}} />, { wrapper: TestProviders });

    const link = screen
      .getAllByRole("link")
      .find((a) => a.getAttribute("href") === test.url);
    expect(link).toBeDefined();

    fireEvent.click(link!);

    expect(trackFunnelEvent).toHaveBeenCalledTimes(1);
    expect(trackFunnelEvent).toHaveBeenCalledWith("provider_click", {
      provider_id: "medichecks",
      entity_type: "test",
      entity_id: "t-1",
      entity_name: "Thyroid Function Blood Test",
    });
  });
});
