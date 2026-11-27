// Stage 1 gate: ai-human-context, blood-test-analysis and hidden-gap-detector
// must not write health_queries or read biomarker_readings history while
// PERSONAL_HEALTH_RECORDS_ENABLED is false. The functions call Supabase from
// inside Deno.serve, so this test checks the source: every access to those
// tables must sit inside a canUsePersonalHealthRecordHistory(...) guard, and
// that guard is false in stage 1 (personal-health-records.test.ts).
import { strict as assert } from "node:assert";
import { canUsePersonalHealthRecordHistory } from "./personal-health-records.ts";

const FUNCTIONS = [
  "ai-human-context",
  "blood-test-analysis",
  "hidden-gap-detector",
];
const GATED_TABLES =
  /\.from\(\s*["'](health_queries|biomarker_readings)["']\s*\)/g;
const GUARD = "canUsePersonalHealthRecordHistory(";
// The guard opens the block or ternary that holds the table access.
const MAX_LINES_FROM_GUARD = 6;

function source(fn: string): string {
  return Deno.readTextFileSync(new URL(`../${fn}/index.ts`, import.meta.url));
}

for (const fn of FUNCTIONS) {
  Deno.test(
    `${fn}: every health_queries / biomarker_readings access is gated`,
    () => {
      const src = source(fn);
      assert.ok(
        src.includes('from "../_shared/personal-health-records.ts"'),
        `${fn} must import the shared stage 1 flag`,
      );
      for (const m of src.matchAll(GATED_TABLES)) {
        const before = src.slice(0, m.index).split("\n");
        const window = before.slice(-MAX_LINES_FROM_GUARD).join("\n");
        assert.ok(
          window.includes(GUARD),
          `${fn}: ${m[0]} at line ${before.length} is not inside ${GUARD}...)`,
        );
      }
    },
  );
}

Deno.test("stage 1 guard is false for signed-in and guest callers", () => {
  assert.equal(canUsePersonalHealthRecordHistory("user-id"), false);
  assert.equal(canUsePersonalHealthRecordHistory(null), false);
});

Deno.test("the guard test catches an ungated insert", () => {
  const ungated = 'await supabase.from("health_queries").insert({});';
  const m = [...ungated.matchAll(GATED_TABLES)];
  assert.equal(m.length, 1);
  assert.ok(!ungated.slice(0, m[0].index).includes(GUARD));
});
