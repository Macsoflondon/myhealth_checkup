import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PERSONAL_HEALTH_RECORDS_ENABLED } from "./personal-health-records";

const edgeSource = (name: string) =>
  readFileSync(
    join(process.cwd(), "supabase", "functions", name, "index.ts"),
    "utf8",
  );

describe("stage 1 personal health-record gate", () => {
  it("is switched off in the site bundle", () => {
    expect(PERSONAL_HEALTH_RECORDS_ENABLED).toBe(false);
  });

  it.each(["ai-human-context", "blood-test-analysis", "hidden-gap-detector"])(
    "%s writes health queries only through the disabled shared gate",
    (name) => {
      const source = edgeSource(name);
      expect(source).toContain("canUsePersonalHealthRecordHistory");
      expect(source).toMatch(
        /if \(canUsePersonalHealthRecordHistory\([^)]*\)\) \{/,
      );
    },
  );

  it("blood-test-analysis keeps stored-reading history behind the same gate", () => {
    expect(edgeSource("blood-test-analysis")).toContain(
      "const historicalData = canUsePersonalHealthRecordHistory(user.id)",
    );
  });

  it("both account surfaces import the site gate and existing-record view", () => {
    for (const path of [
      "src/components/dashboard/HealthDataHub.tsx",
      "src/pages/ClientPortal.tsx",
    ]) {
      const source = readFileSync(join(process.cwd(), path), "utf8");
      expect(source).toContain("PERSONAL_HEALTH_RECORDS_ENABLED");
      expect(source).toContain("StageOneHealthRecords");
    }
  });
});
