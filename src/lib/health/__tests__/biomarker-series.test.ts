import { describe, expect, it } from "vitest";
import {
  buildBiomarkerSeries,
  filterByDateRange,
  isTrusted,
  sortChronologically,
} from "@/lib/health/biomarker-series";
import type { ObservationRecord } from "@/types/health-intelligence";

const observation = (
  overrides: Partial<ObservationRecord> & Pick<ObservationRecord, "id">,
): ObservationRecord => ({
  biomarkerId: "bm-ferritin",
  biomarkerName: "Ferritin",
  sourceValue: "50",
  sourceUnit: "ug/L",
  canonicalValue: 50,
  canonicalUnit: "ug/L",
  sourceReferenceLow: 30,
  sourceReferenceHigh: 400,
  collectedAt: "2026-01-01T00:00:00Z",
  resultedAt: null,
  laboratoryName: "Example Laboratory",
  method: null,
  validationStatus: "passed",
  verificationStatus: "confirmed",
  cyclePhase: "unknown",
  cycleDay: null,
  ...overrides,
});

describe("biomarker series", () => {
  it("trusts only confirmed and validated observations", () => {
    expect(isTrusted(observation({ id: "a" }))).toBe(true);
    expect(isTrusted(observation({ id: "b", verificationStatus: "unverified" }))).toBe(false);
    expect(isTrusted(observation({ id: "c", validationStatus: "failed" }))).toBe(false);
    expect(isTrusted(observation({ id: "d", validationStatus: "overridden" }))).toBe(true);
  });

  it("excludes unverified observations from the series entirely", () => {
    const series = buildBiomarkerSeries([
      observation({ id: "a", collectedAt: "2026-01-01T00:00:00Z" }),
      observation({
        id: "draft",
        collectedAt: "2026-06-01T00:00:00Z",
        verificationStatus: "unverified",
        canonicalValue: 999,
      }),
    ]);
    expect(series.points.map((p) => p.id)).toEqual(["a"]);
    expect(series.latest?.canonicalValue).toBe(50);
  });

  it("orders points oldest first regardless of input order", () => {
    const sorted = sortChronologically([
      observation({ id: "late", collectedAt: "2026-09-01T00:00:00Z" }),
      observation({ id: "early", collectedAt: "2026-02-01T00:00:00Z" }),
    ]);
    expect(sorted.map((p) => p.id)).toEqual(["early", "late"]);
  });

  it("computes absolute change, percentage change and interval", () => {
    const series = buildBiomarkerSeries([
      observation({ id: "prev", collectedAt: "2026-01-01T00:00:00Z", canonicalValue: 40 }),
      observation({ id: "latest", collectedAt: "2026-01-31T00:00:00Z", canonicalValue: 60 }),
    ]);
    expect(series.absoluteChange).toBe(20);
    expect(series.percentageChange).toBe(50);
    expect(series.direction).toBe("rising");
    expect(series.intervalDays).toBe(30);
  });

  it("calls small movement stable rather than a trend", () => {
    const series = buildBiomarkerSeries([
      observation({ id: "prev", collectedAt: "2026-01-01T00:00:00Z", canonicalValue: 100 }),
      observation({ id: "latest", collectedAt: "2026-02-01T00:00:00Z", canonicalValue: 103 }),
    ]);
    expect(series.direction).toBe("stable");
  });

  it("refuses to compare values recorded in different units", () => {
    const series = buildBiomarkerSeries([
      observation({ id: "prev", collectedAt: "2026-01-01T00:00:00Z", canonicalValue: 40, canonicalUnit: "ug/L" }),
      observation({ id: "latest", collectedAt: "2026-02-01T00:00:00Z", canonicalValue: 60, canonicalUnit: "nmol/L" }),
    ]);
    expect(series.absoluteChange).toBeNull();
    expect(series.percentageChange).toBeNull();
    expect(series.direction).toBe("indeterminate");
  });

  it("withholds percentage change against a zero baseline", () => {
    const series = buildBiomarkerSeries([
      observation({ id: "prev", collectedAt: "2026-01-01T00:00:00Z", canonicalValue: 0 }),
      observation({ id: "latest", collectedAt: "2026-02-01T00:00:00Z", canonicalValue: 5 }),
    ]);
    expect(series.absoluteChange).toBe(5);
    expect(series.percentageChange).toBeNull();
  });

  it("handles a single point without inventing a comparison", () => {
    const series = buildBiomarkerSeries([observation({ id: "only" })]);
    expect(series.previous).toBeNull();
    expect(series.absoluteChange).toBeNull();
    expect(series.direction).toBe("indeterminate");
    expect(series.intervalDays).toBeNull();
  });

  it("filters by date range", () => {
    const points = [
      observation({ id: "old", collectedAt: "2025-01-01T00:00:00Z" }),
      observation({ id: "recent", collectedAt: "2026-05-01T00:00:00Z" }),
    ];
    expect(
      filterByDateRange(points, { from: "2026-01-01T00:00:00Z" }).map((p) => p.id),
    ).toEqual(["recent"]);
  });

  it("returns an empty series when nothing is trusted", () => {
    const series = buildBiomarkerSeries([
      observation({ id: "a", verificationStatus: "rejected" }),
    ]);
    expect(series.points).toHaveLength(0);
    expect(series.latest).toBeNull();
    expect(series.direction).toBe("indeterminate");
  });
});
