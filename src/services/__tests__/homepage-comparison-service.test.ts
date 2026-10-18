import { beforeEach, describe, expect, it, vi } from "vitest";

const { query } = vi.hoisted(() => ({ query: { from: vi.fn(), select: vi.fn(), in: vi.fn(), or: vi.fn(), eq: vi.fn(), gt: vi.fn(), order: vi.fn() } }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: query }));
import { getHomepageComparison } from "@/services/homepage-comparison-service";

describe("homepage comparison read", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const name of ["from", "select", "in", "or", "eq", "gt"] as const) query[name].mockReturnValue(query);
  });
  it("reads the unified catalogue and retains one row per provider", async () => {
    query.order.mockResolvedValue({ data: [{ id: "a", provider_id: "clinilabs" }, { id: "b", provider_id: "clinilabs" }, { id: "c", provider_id: "medichecks" }], error: null });
    expect(await getHomepageComparison()).toEqual([{ id: "a", provider_id: "clinilabs" }, { id: "c", provider_id: "medichecks" }]);
    expect(query.from).toHaveBeenCalledWith("unified_provider_tests");
  });
  it("surfaces catalogue errors rather than inventing prices", async () => {
    query.order.mockResolvedValue({ data: null, error: new Error("Unavailable") });
    await expect(getHomepageComparison()).rejects.toThrow("Unavailable");
  });
});