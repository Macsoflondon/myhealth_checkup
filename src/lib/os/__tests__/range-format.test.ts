import { describe, expect, it } from "vitest";
import {
  addDays,
  lastNDays,
  londonToday,
  osWindow,
  parseOsRange,
  previousNDays,
  snapshotRangeKey,
  previousCovered,
} from "@/lib/os/range";
import {
  daysSince,
  formatAgo,
  formatDay,
  formatDelta,
  formatGbp,
  formatInt,
  formatShare,
  providerName,
} from "@/lib/os/format";

describe("OS range windows", () => {
  it("defaults unknown ranges to 28 days", () => {
    expect(parseOsRange(null)).toBe("28d");
    expect(parseOsRange("365d")).toBe("28d");
    expect(parseOsRange("7d")).toBe("7d");
    expect(snapshotRangeKey("90d")).toBe("90");
  });

  it("uses the London calendar date, not UTC", () => {
    // 23:30 UTC on 5 Oct 2026 is 00:30 on 6 Oct in London (BST).
    expect(londonToday(new Date("2026-10-05T23:30:00Z"))).toBe("2026-10-06");
    // In winter London is on UTC.
    expect(londonToday(new Date("2026-12-05T23:30:00Z"))).toBe("2026-12-05");
  });

  it("covers N London days ending today, with London midnight bounds", () => {
    const w = osWindow("7d", new Date("2026-10-09T12:00:00Z"));
    expect(w.firstDay).toBe("2026-10-03");
    expect(w.lastDay).toBe("2026-10-09");
    expect(w.from.toISOString()).toBe("2026-10-02T23:00:00.000Z");
    expect(w.to.toISOString()).toBe("2026-10-09T23:00:00.000Z");
    expect(w.label).toBe("last 7 days");
  });

  it("handles the clock change at the end of October", () => {
    const w = osWindow("7d", new Date("2026-10-27T12:00:00Z"));
    // 21 Oct starts at 23:00 UTC on 20 Oct (BST); 28 Oct starts at 00:00 UTC (GMT).
    expect(w.from.toISOString()).toBe("2026-10-20T23:00:00.000Z");
    expect(w.to.toISOString()).toBe("2026-10-28T00:00:00.000Z");
  });

  it("adds days across month ends", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("slices daily series anchored on the series' own last day", () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({
      date: addDays("2026-09-01", i),
      v: i,
    }));
    const last = lastNDays(rows, 7);
    expect(last.map((r) => r.date)).toEqual([
      "2026-09-14",
      "2026-09-15",
      "2026-09-16",
      "2026-09-17",
      "2026-09-18",
      "2026-09-19",
      "2026-09-20",
    ]);
    const prev = previousNDays(rows, 7);
    expect(prev[0].date).toBe("2026-09-07");
    expect(prev[prev.length - 1].date).toBe("2026-09-13");
    expect(lastNDays([], 7)).toEqual([]);
  });
});

describe("previousCovered", () => {
  it("compares only when records reach back to the previous window", () => {
    const prevFrom = "2026-09-25T23:00:00.000Z";
    expect(previousCovered("2026-09-01T10:00:00Z", prevFrom)).toBe(true);
    expect(previousCovered("2026-10-01T10:00:00Z", prevFrom)).toBe(false);
    expect(previousCovered(null, prevFrom)).toBe(false);
    // Older summaries without these fields keep their comparison.
    expect(previousCovered(undefined, prevFrom)).toBe(true);
    expect(previousCovered("2026-10-01T10:00:00Z", undefined)).toBe(true);
  });
});

describe("OS formatting", () => {
  it("formats numbers and money in en-GB", () => {
    expect(formatInt(12345)).toBe("12,345");
    expect(formatInt(null)).toBe("–");
    expect(formatGbp(1234.5)).toBe("£1,234.50");
    expect(formatGbp(1234.5, { whole: true })).toBe("£1,235");
    expect(formatShare(0.6429)).toBe("64.3%");
  });

  it("reports change without inventing a percentage from a zero base", () => {
    expect(formatDelta(0, 0).text).toBe("no change");
    expect(formatDelta(5, 0)).toMatchObject({
      direction: "up",
      ratio: null,
      text: "new this period",
    });
    expect(formatDelta(1, 2)).toMatchObject({
      direction: "down",
      text: "−50% vs previous",
    });
    expect(formatDelta(105, 100).text).toBe("+5.0% vs previous");
    // A negative base: -£100 to +£50 is an improvement.
    expect(formatDelta(50, -100)).toMatchObject({
      direction: "up",
      text: "+150% vs previous",
    });
    expect(formatDelta(-150, -100)).toMatchObject({
      direction: "down",
      text: "−50% vs previous",
    });
    expect(formatDelta(-5, 0).direction).toBe("down");
    expect(formatDelta(null, 3).direction).toBe("none");
  });

  it("describes ages and day labels", () => {
    const now = new Date("2026-10-09T12:00:00Z");
    expect(formatAgo("2026-10-09T11:59:30Z", now)).toBe("just now");
    expect(formatAgo("2026-10-09T11:01:00Z", now)).toBe("59 min ago");
    expect(formatAgo("2026-10-09T11:00:00Z", now)).toBe("1 h ago");
    expect(formatAgo("2026-10-04T02:05:00Z", now)).toBe("5 days ago");
    expect(formatAgo(null, now)).toBe("never");
    expect(daysSince("2026-10-04T02:05:00Z", now)).toBe(5);
    expect(formatDay("2026-10-04")).toBe("4 Oct");
  });

  it("names providers", () => {
    expect(providerName("lola-health")).toBe("Lola Health");
    expect(providerName("awin-12345")).toBe("Awin 12345");
  });
});
