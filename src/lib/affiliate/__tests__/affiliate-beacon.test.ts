import { describe, expect, it } from "vitest";
import {
  handleAffiliateBeacon,
  type AffiliateClickRow,
} from "@/routes/api/public/affiliate-click";

const TEST_ID = "dcc3f301-4eca-4b0c-bf67-33fa13c8854a";
function run(body: Record<string, unknown>) {
  const rows: AffiliateClickRow[] = [];
  const req = new Request("http://x/api/public/affiliate-click", { method: "POST", body: JSON.stringify(body) });
  return handleAffiliateBeacon(req, {
    lookupTest: async (id) =>
      id === TEST_ID ? { id, provider_id: "medichecks", url: "https://www.medichecks.com/products/x" } : null,
    withinLimit: async () => true,
    insert: async (r) => (rows.push(r), true),
  }).then((res) => ({ status: res.status, rows }));
}
const base = {
  click_id: "8b0e0e5e-1111-4222-8333-444455556666",
  provider_id: "medichecks",
  source_page: "/compare",
  placement: "card",
  destination_host: "evil.example",
};

describe("booking click beacon", () => {
  it("stores the catalogue URL's host, not a forged destination_host", async () => {
    const { status, rows } = await run({ ...base, test_id: TEST_ID });
    expect(status).toBe(204);
    expect(rows[0].destination_host).toBe("www.medichecks.com");
  });
  it("stores the provider's configured host when no test is given", async () => {
    const { rows } = await run({ ...base, test_id: null });
    expect(rows[0].destination_host).toBe("medichecks.com");
    expect(JSON.stringify(rows)).not.toContain("evil.example");
  });
  it("still accepts clients that send no destination_host", async () => {
    const { destination_host: _d, ...rest } = base;
    expect((await run({ ...rest, test_id: null })).status).toBe(204);
  });
});
