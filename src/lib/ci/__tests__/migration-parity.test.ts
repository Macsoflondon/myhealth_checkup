import { describe, expect, it } from "vitest";
import {
  compareMigrationSets,
  formatParityReport,
} from "../../../../scripts/lib/migration-parity-core.mjs";

const base = ["20250714231842", "20260705225135", "20260912113814"];

describe("compareMigrationSets", () => {
  it("passes when the sets are identical", () => {
    const result = compareMigrationSets(base, base);
    expect(result.ok).toBe(true);
    expect(result.missingLocal).toEqual([]);
    expect(result.missingRemote).toEqual([]);
    expect(result.skewTolerated).toBeNull();
  });

  it("fails on a fixture orphan applied remotely with no committed file", () => {
    const result = compareMigrationSets([...base, "20260913090000"], base);
    expect(result.ok).toBe(false);
    expect(result.missingLocal).toEqual(["20260913090000"]);
    expect(formatParityReport(result)).toContain("no committed migration file");
  });

  it("fails on a committed file that was never applied", () => {
    const result = compareMigrationSets(base, [...base, "20260913090000"]);
    expect(result.ok).toBe(false);
    expect(result.missingRemote).toEqual(["20260913090000"]);
  });

  it("tolerates the documented trailing +1s CLI skew, and says so", () => {
    const repo = ["20250714231842", "20260912113814"];
    const remote = ["20250714231842", "20260912113815"];
    const result = compareMigrationSets(remote, repo);
    expect(result.ok).toBe(true);
    expect(result.skewTolerated).toEqual({
      repo: "20260912113814",
      remote: "20260912113815",
    });
    expect(formatParityReport(result)).toContain("+1s CLI skew");
  });

  it("does not tolerate skew on a non-trailing version", () => {
    const repo = ["20250714231842", "20260912113814"];
    const remote = ["20250714231843", "20260912113814"];
    expect(compareMigrationSets(remote, repo).ok).toBe(false);
  });

  it("does not tolerate a skew larger than one second", () => {
    const repo = ["20260912113814"];
    const remote = ["20260912113820"];
    expect(compareMigrationSets(remote, repo).ok).toBe(false);
  });

  it("rejects malformed versions", () => {
    const result = compareMigrationSets(["not-a-version"], ["not-a-version"]);
    expect(result.ok).toBe(false);
    expect(result.malformed).toContain("not-a-version");
  });

  it("de-duplicates repeated versions before comparing", () => {
    expect(compareMigrationSets([...base, ...base], base).ok).toBe(true);
  });
});
