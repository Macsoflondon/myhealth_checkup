import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

import { homepageFeeLabel } from "../homepage-comparison-service";

describe("homepageFeeLabel", () => {
  it("shows nothing for none or a missing fee type", () => {
    expect(homepageFeeLabel("none", null)).toBeNull();
    expect(homepageFeeLabel(null, null)).toBeNull();
  });
  it("fixed", () => {
    expect(homepageFeeLabel("fixed", 24)).toBe("Includes blood draw £24");
  });
  it("from", () => {
    expect(homepageFeeLabel("from", 30)).toBe("Includes blood draw from £30");
  });
  it("self_arranged", () => {
    expect(homepageFeeLabel("self_arranged", 35)).toBe("Free if self-arranged, or from £35");
  });
});
