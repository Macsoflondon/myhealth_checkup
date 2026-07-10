#!/usr/bin/env node
/**
 * Audit every provider's active tests against the live taxonomy.
 * Fails (exit 1) if any active product is orphaned (no category mapping)
 * or if a provider has more than 60% of its catalogue stuck on
 * `general-health` only — a signal that aliases need tightening.
 *
 * Usage:  node scripts/audit-provider-taxonomy.mjs
 *
 * Reads SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_ equivalents).
 */
import { createClient } from "@supabase/supabase-js";

const url =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_ANON_KEY");
  process.exit(2);
}

const sb = createClient(url, key, { auth: { persistSession: false } });
const GENERAL_THRESHOLD = 0.6;

const { data: cats, error: cErr } = await sb
  .from("categories")
  .select("id,slug");
if (cErr) throw cErr;
const generalId = cats.find((c) => c.slug === "general-health")?.id;

const { data: tests, error: tErr } = await sb
  .from("provider_tests")
  .select("id,provider_id,test_name,category_ids,is_active")
  .eq("is_active", true)
  .limit(5000);
if (tErr) throw tErr;

const byProvider = new Map();
const orphans = [];

for (const t of tests) {
  const cats = t.category_ids ?? [];
  const slot = byProvider.get(t.provider_id) ?? {
    active: 0,
    orphan: 0,
    onlyGeneral: 0,
    multi: 0,
  };
  slot.active++;
  if (cats.length === 0) {
    slot.orphan++;
    orphans.push(t);
  } else if (cats.length === 1 && cats[0] === generalId) {
    slot.onlyGeneral++;
  } else {
    slot.multi++;
  }
  byProvider.set(t.provider_id, slot);
}

let fail = false;
console.log(
  `\nProvider taxonomy audit (${tests.length} active tests across ${byProvider.size} providers)\n`,
);
console.log(
  "provider".padEnd(28),
  "active".padStart(7),
  "orphan".padStart(7),
  "general-only".padStart(13),
  "specific".padStart(9),
);
for (const [p, s] of [...byProvider.entries()].sort()) {
  const generalRatio = s.onlyGeneral / s.active;
  const flag = s.orphan > 0 || generalRatio > GENERAL_THRESHOLD ? " ✗" : "";
  if (s.orphan > 0 || generalRatio > GENERAL_THRESHOLD) fail = true;
  console.log(
    p.padEnd(28),
    String(s.active).padStart(7),
    String(s.orphan).padStart(7),
    String(s.onlyGeneral).padStart(13),
    String(s.multi).padStart(9),
    flag,
  );
}

if (orphans.length) {
  console.log(`\nOrphan products (${orphans.length}):`);
  for (const o of orphans.slice(0, 25)) {
    console.log(`  - [${o.provider_id}] ${o.test_name} (${o.id})`);
  }
  if (orphans.length > 25) console.log(`  …and ${orphans.length - 25} more`);
}

console.log(
  fail
    ? "\n✗ Audit failed — fix orphans or tighten aliases.\n"
    : "\n✓ All providers cleanly mapped into the taxonomy.\n",
);
process.exit(fail ? 1 : 0);
