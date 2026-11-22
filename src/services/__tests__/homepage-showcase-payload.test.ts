import { describe, expect, it, vi } from "vitest";
const { selects } = vi.hoisted(() => ({ selects: [] as string[] }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => {
      const state = { provider: "" };
      const chain = {
        select(columns: string) {
          selects.push(columns);
          return chain;
        },
        eq(field: string, value: string) {
          if (field === "provider_id") state.provider = value;
          return chain;
        },
        gt() {
          return chain;
        },
        not() {
          return chain;
        },
        order() {
          return chain;
        },
        limit() {
          return Promise.resolve({
            data: [
              {
                id: state.provider,
                provider_id: state.provider,
                test_name: "Profile",
                price: 59,
                url: "https://example.com/profile",
                category_primary: "wellness",
              },
            ],
            error: null,
          });
        },
      };
      return chain;
    },
  },
}));
import { getHomepageShowcaseTests } from "../homepage-test-showcase";

describe("homepage showcase projection", () => {
  it("omits provider descriptions from the showcase query", async () => {
    selects.length = 0;
    expect(await getHomepageShowcaseTests()).toHaveLength(9);
    expect(selects).toHaveLength(9);
    expect(
      selects.every((columns) => !columns.split(", ").includes("description")),
    ).toBe(true);
  });
  it("omits biomarker arrays from the showcase query", async () => {
    selects.length = 0;
    await getHomepageShowcaseTests();
    expect(selects).toHaveLength(9);
    expect(
      selects.every(
        (columns) => !columns.split(", ").includes("biomarkers_list"),
      ),
    ).toBe(true);
  });
});
