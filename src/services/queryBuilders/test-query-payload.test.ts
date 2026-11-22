import { beforeEach, describe, expect, it, vi } from "vitest";

const selections = vi.hoisted(() => [] as string[]);
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => {
      const query = {
        select: (columns: string) => {
          selections.push(columns);
          return query;
        },
        eq: () => query,
        gt: () => query,
        not: () => query,
        order: () => query,
        limit: () => query,
        in: () => query,
        or: () => query,
        returns: () => query,
      };
      return query;
    },
  },
}));
import { TestQueryBuilder } from "./testQueryBuilder";
import { CATEGORY_TEST_COLUMNS } from "@/lib/categoryTestMapper";
import { testDetailsQueryOptions } from "@/hooks/queries/useTestDetailsByIds";

describe("lightweight catalogue pools", () => {
  beforeEach(() => {
    selections.length = 0;
  });
  it("compare browsing omits descriptions and biomarker lists while retaining the sorting count", () => {
    TestQueryBuilder.buildCategoryQuery("heart");
    const columns = selections[0]?.split(",").map((column) => column.trim());
    expect(columns).toContain("biomarker_count");
    expect(columns).not.toContain("description");
    expect(columns).not.toContain("biomarkers_list");
  });
  it("search uses the same lightweight projection", () => {
    TestQueryBuilder.buildSearchQuery("cholesterol");
    expect(
      selections[0]?.split(",").map((column) => column.trim()),
    ).not.toContain("biomarkers_list");
    expect(
      selections[0]?.split(",").map((column) => column.trim()),
    ).not.toContain("description");
  });
  it("equivalent panels omit both heavy fields and retain counts", () => {
    TestQueryBuilder.buildPanelQuery({
      label: "Cholesterol",
      includeNames: ["cholesterol"],
    });
    expect(selections[0]).toContain("biomarker_count");
    expect(selections[0]).not.toContain("biomarkers_list");
    expect(selections[0]).not.toContain("description");
  });
  it("category lists omit both heavy fields and retain counts", () => {
    const columns = CATEGORY_TEST_COLUMNS.split(",");
    expect(columns).toContain("biomarker_count");
    expect(columns).not.toContain("biomarkers_list");
    expect(columns).not.toContain("description");
  });
  it("route variants share one real test-details identifier", () => {
    const options = testDetailsQueryOptions([
      "a::clinic",
      "a::home_kit",
      "b",
      "a",
    ]);
    expect(options.queryKey).toEqual(["test-details", ["a", "b"]]);
  });
});
