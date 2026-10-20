import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Displayed prices must come from unified_provider_tests via viewPricing.ts.
 * This guard fails if src/ reads a raw total or clinic fee from provider_tests
 * again, or does clinic-fee arithmetic outside the helper.
 */
const ROOT = join(process.cwd(), "src");
const ALLOWED = new Set([
  "lib/viewPricing.ts",
  "integrations/supabase/types.ts",
]);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === "__tests__" ? [] : files(p);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [p] : [];
  });
}

const FORBIDDEN: Array<[string, RegExp]> = [
  ["raw clinic phlebotomy cost", /clinic_phlebotomy_cost/],
  [
    "clinic fee arithmetic",
    /price\s*\+\s*(clinicFee|clinic_fee)|(clinicFee|clinic_fee)\s*\+\s*\w*price/i,
  ],
];

describe("price source guard", () => {
  it("no raw clinic fee reads or clinic fee arithmetic outside viewPricing.ts", () => {
    const hits: string[] = [];
    for (const f of files(ROOT)) {
      const rel = relative(ROOT, f);
      if (ALLOWED.has(rel)) continue;
      const src = readFileSync(f, "utf8");
      for (const [label, re] of FORBIDDEN)
        if (re.test(src)) hits.push(`${rel}: ${label}`);
    }
    expect(hits).toEqual([]);
  });

  it("provider_tests selects never pull total_expected_cost", () => {
    const hits: string[] = [];
    for (const f of files(ROOT)) {
      const rel = relative(ROOT, f);
      if (ALLOWED.has(rel)) continue;
      const src = readFileSync(f, "utf8");
      const re = /from\("provider_tests"\)\s*\.select\(\s*([`"'])([\s\S]*?)\1/g;
      for (const m of src.matchAll(re)) {
        if (/total_expected_cost|collection_fee_amount/.test(m[2]))
          hits.push(rel);
      }
    }
    expect(hits).toEqual([]);
  });
});
