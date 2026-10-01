import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sql = readFileSync(
  resolve(
    process.cwd(),
    "supabase/migrations/20261001120000_affiliate_click_tracking.sql",
  ),
  "utf8",
);

describe("affiliate migration matches live database", () => {
  it("keeps a valid click id when deduplicating conversions", () => {
    expect(sql).toContain(
      "max(click_raw) over (partition by provider_id, network_reference) as click_raw",
    );
    expect(sql).toContain("on c.click_id = d.click_raw::uuid");
    expect(sql).toMatch(/then lower\(trim\(r->>'click_id'\)\) end as click_raw/);
  });

  it("bases conversion rate on attributed conversions only", () => {
    expect(sql).toContain("as attributed");
    expect(sql).toContain("sum(attributed)::numeric / sum(clicks)");
    expect(sql).not.toMatch(/conversions::numeric \/ clicks/);
    expect(sql).not.toMatch(/sum\(conversions\)::numeric/);
  });
});
