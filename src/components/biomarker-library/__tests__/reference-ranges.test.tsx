import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ReferenceRanges } from "../BiomarkerLibraryUI";
import { resolveRangeView } from "../biomarker-ranges";

const band = (min: number, max: number) => ({
  optimal: { min, max, label: "Normal" },
});

type Entry = Parameters<typeof ReferenceRanges>[0]["entry"];
const entry = (over: Partial<Entry>): Entry => ({
  referenceRanges: null,
  normalRangeMale: null,
  normalRangeFemale: null,
  unit: "µg/L",
  ...over,
});

const box = () => screen.getByTestId("reference-ranges");

describe("resolveRangeView", () => {
  it("returns split, single-sex, shared and none", () => {
    expect(
      resolveRangeView(
        entry({
          referenceRanges: { male: band(30, 400), female: band(13, 150) },
        }),
      ).kind,
    ).toBe("split");
    expect(resolveRangeView(entry({ normalRangeMale: "30-400" })).kind).toBe(
      "single-sex",
    );
    expect(
      resolveRangeView(entry({ referenceRanges: { both: band(1, 2) } })).kind,
    ).toBe("shared");
    expect(
      resolveRangeView(entry({ referenceRanges: { male: {} } })).kind,
    ).toBe("none");
  });
});

describe("ReferenceRanges", () => {
  it("shows the toggle when both sexes have data", () => {
    render(
      <ReferenceRanges
        entry={entry({
          referenceRanges: { male: band(30, 400) },
          normalRangeFemale: "13-150",
        })}
      />,
    );
    const male = screen.getByRole("button", { name: "Male" });
    const female = screen.getByRole("button", { name: "Female" });
    expect(male).toHaveAttribute("aria-pressed", "true");
    expect(within(box()).getByText("30–400")).toBeInTheDocument();
    fireEvent.click(female);
    expect(female).toHaveAttribute("aria-pressed", "true");
    expect(within(box()).getByText("Female: 13-150 µg/L")).toBeInTheDocument();
    expect(within(box()).queryByText("30–400")).not.toBeInTheDocument();
  });

  it("labels a male-only range and says no female range is listed", () => {
    render(<ReferenceRanges entry={entry({ normalRangeMale: "30-400" })} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(within(box()).getByText("Male range")).toBeInTheDocument();
    expect(within(box()).getByText("Male: 30-400 µg/L")).toBeInTheDocument();
    expect(
      within(box()).getByText("No female range is listed for this biomarker."),
    ).toBeInTheDocument();
  });

  it("labels a female-only range and says no male range is listed", () => {
    render(
      <ReferenceRanges
        entry={entry({ referenceRanges: { female: band(13, 150) } })}
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(within(box()).getByText("Female range")).toBeInTheDocument();
    expect(within(box()).getByText("13–150")).toBeInTheDocument();
    expect(
      within(box()).getByText("No male range is listed for this biomarker."),
    ).toBeInTheDocument();
  });

  it("shows a shared-only range with no toggle and no claim about sex", () => {
    render(
      <ReferenceRanges
        entry={entry({ referenceRanges: { both: band(1, 2) } })}
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(within(box()).getByText("1–2")).toBeInTheDocument();
    expect(box().textContent).not.toMatch(/both sexes|male|female/i);
  });

  it("shows the not-yet-available note when there is no range", () => {
    render(<ReferenceRanges entry={entry({})} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      within(box()).getByText(/Reference range not yet available/),
    ).toBeInTheDocument();
  });
});
