import { describe, expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
import {
  buildHomepageComparisonPanels,
  HOMEPAGE_PANEL_COLUMNS,
  HOMEPAGE_PANEL_NAME_FILTER,
  type HomepageComparisonRow,
} from "../homepage-comparison-service";

const row = (
  id: string,
  provider: string,
  name: string,
  price: number,
): HomepageComparisonRow => ({
  id,
  provider_id: provider,
  test_name: name,
  price,
  total_expected_cost: price,
  biomarker_count: 12,
  biomarkers_listed: 12,
  turnaround_days_text: "2 days",
  updated_at: null,
  price_checked_at: null,
  clinic_visit_available: true,
  home_kit_available: false,
  collection_method: "clinic",
  collection_fee_type: "none",
  collection_fee_amount: 0,
});
describe("bounded homepage comparison query", () => {
  it("filters panel names upstream without fetching full biomarker arrays", () => {
    expect(HOMEPAGE_PANEL_NAME_FILTER).toContain(
      "test_name.ilike.%full blood count%",
    );
    expect(HOMEPAGE_PANEL_NAME_FILTER).toContain("test_name.ilike.%thyroid%");
    expect(HOMEPAGE_PANEL_COLUMNS.split(", ").includes("biomarkers_list")).toBe(
      false,
    );
    expect(HOMEPAGE_PANEL_COLUMNS).toContain("biomarkers_listed");
  });
  it("keeps cheapest-per-provider ordering and excludes female tests from male panels", () => {
    const panels = buildHomepageComparisonPanels([
      row("a", "medichecks", "Full Blood Count", 59),
      row("b", "clinilabs", "Full Blood Count", 50),
      row("c", "medichecks", "Full Blood Count", 70),
      row("d", "medichecks", "Female Hormone Panel", 79),
      row("e", "clinilabs", "Female Hormone Panel", 59),
    ]);
    expect(
      panels
        .find((panel) => panel.slug === "full-blood-count")
        ?.rows.map((item) => item.id),
    ).toEqual(["b", "a"]);
    expect(panels.some((panel) => panel.slug === "male-hormones")).toBe(false);
    expect(
      panels
        .find((panel) => panel.slug === "full-blood-count")
        ?.rows.map((item) => item.price),
    ).toEqual([50, 59]);
  });
});
