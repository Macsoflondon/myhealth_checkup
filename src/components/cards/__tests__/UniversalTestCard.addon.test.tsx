import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { TestProviders } from "@/test/test-providers";
import {
  ADDON_MARKER_LABEL,
  ADDON_MARKER_TEXT,
  UniversalTestCard,
  type UniversalTestData,
} from "@/components/cards/UniversalTestCard";

vi.mock("@/lib/router-compat", () => ({
  Link: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  useNavigate: () => () => {},
  useLocation: () => ({ pathname: "/", search: "" }),
}));

const baseTest: UniversalTestData = {
  id: "11111111-2222-3333-4444-555555555555",
  provider_id: "medichecks",
  test_name: "Vitamin D Blood Test",
  price: 39,
  total_expected_cost: 39,
  category: "vitamins",
};

function renderCard(test: UniversalTestData) {
  return render(<UniversalTestCard test={test} />, { wrapper: TestProviders });
}

describe("UniversalTestCard add-on marker", () => {
  it("shows a text add-on marker on an add-on card, separate from the button", () => {
    renderCard({ ...baseTest, test_name: "Ferritin add-on", is_addon: true });

    const marker = screen.getByTestId("addon-marker");
    expect(marker).toHaveTextContent(ADDON_MARKER_LABEL);
    expect(marker).toHaveTextContent(ADDON_MARKER_TEXT);
    expect(screen.getByText(ADDON_MARKER_TEXT)).toBeInTheDocument();
    // The compact pill in the detail layer still says why in words for screen readers.
    expect(screen.getByTestId("addon-marker-compact")).toHaveTextContent(
      /add-on.*only sold with a main test/i,
    );
    expect(
      screen.getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();
  });

  it("treats a Lola Health add-on section row as an add-on", () => {
    renderCard({
      ...baseTest,
      provider_id: "lola-health",
      category: "Add-ons",
      is_addon: false,
    });
    expect(screen.getByTestId("addon-marker")).toBeInTheDocument();
  });

  it("shows no add-on marker on a normal card", () => {
    renderCard({ ...baseTest, is_addon: false });

    expect(screen.queryByTestId("addon-marker")).toBeNull();
    expect(screen.queryByTestId("addon-marker-compact")).toBeNull();
    expect(screen.queryByText(ADDON_MARKER_TEXT)).toBeNull();
    expect(
      screen.getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();
  });
});
