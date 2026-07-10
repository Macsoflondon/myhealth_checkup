/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

/**
 * Regression tests guarding the scrape -> canonical_category pipeline.
 *
 * These tests query the live Supabase project (read-only) to assert invariants
 * that, if broken, mean a new scrape has inserted rows that won't render on
 * any category page. They use the anon key and only SELECT from public tables.
 *
 * If env vars are missing (e.g. local dev without .env), the suite is skipped
 * rather than failed so CI on forks doesn't break.
 */

const url = (import.meta as any).env?.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const key =
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const skip = !url || !key;
const d = skip ? describe.skip : describe;

const KNOWN_CATEGORIES = new Set([
  "womens-health",
  "mens-health",
  "fertility",
  "sexual-health",
  "thyroid",
  "heart",
  "gut",
  "gut-health",
  "vitamins",
  "vitamins-minerals",
  "hormones",
  "cancer-screening",
  "sports-performance",
  "general-health",
  "at-home",
  "allergy",
  "blood-health",
  "diabetes",
  "genetic-testing",
  "kidney-health",
  "liver-health",
]);

d("provider_tests canonical_category integrity", () => {
  const supabase = createClient(url!, key!);

  it("every active row has a canonical_category", async () => {
    const { data, error, count } = await supabase
      .from("provider_tests")
      .select("id,provider_id,test_name,source_section", { count: "exact" })
      .eq("is_active", true)
      .is("canonical_category", null)
      .limit(20);
    expect(error).toBeNull();
    if ((count ?? 0) > 0) {
      console.warn("Rows missing canonical_category:", data);
    }
    expect(count ?? 0).toBe(0);
  });

  it("every canonical_category is in the known set", async () => {
    const { data, error } = await supabase
      .from("provider_tests")
      .select("canonical_category")
      .eq("is_active", true)
      .not("canonical_category", "is", null)
      .limit(5000);
    expect(error).toBeNull();
    const unknown = new Set(
      (data ?? [])
        .map((r) => r.canonical_category as string)
        .filter((c) => !KNOWN_CATEGORIES.has(c))
    );
    expect([...unknown]).toEqual([]);
  });

  it("source_section maps consistently to a single canonical_category per provider", async () => {
    const { data, error } = await supabase
      .from("provider_tests")
      .select("provider_id,source_section,canonical_category")
      .eq("is_active", true)
      .not("source_section", "is", null)
      .not("canonical_category", "is", null)
      .limit(5000);
    expect(error).toBeNull();

    const map = new Map<string, Set<string>>();
    for (const r of data ?? []) {
      const k = `${r.provider_id}::${r.source_section}`;
      const set = map.get(k) ?? new Set<string>();
      set.add(r.canonical_category as string);
      map.set(k, set);
    }
    const conflicts = [...map.entries()].filter(([, set]) => set.size > 1);
    if (conflicts.length) {
      console.warn("Conflicting section->canonical mappings:", conflicts);
    }
    expect(conflicts.length).toBe(0);
  });

  it("womens-health section keywords never land in mens-health", async () => {
    const { data, error } = await supabase
      .from("provider_tests")
      .select("id,test_name,source_section,canonical_category")
      .eq("is_active", true)
      .ilike("source_section", "%women%")
      .neq("canonical_category", "womens-health")
      .limit(20);
    expect(error).toBeNull();
    if ((data ?? []).length) {
      console.warn("Womens-health sections misrouted:", data);
    }
    expect((data ?? []).length).toBe(0);
  });
});
