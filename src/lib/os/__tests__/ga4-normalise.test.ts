import { describe, expect, it } from "vitest";
import {
  ga4ChannelsRequest,
  ga4DailyRequest,
  ga4Date,
  ga4MetricTotal,
  ga4Number,
  ga4OutboundRequest,
  ga4ReportNotes,
  ga4ReportUrl,
  ga4TimeZoneNote,
  ga4TopPagesRequest,
  parseGa4Batch,
  parseGa4Channels,
  ga4RequestedDays,
  parseGa4Daily,
  parseGa4Outbound,
  parseGa4PropertyId,
  parseGa4TopPages,
  toRanged,
  unavailableOutbound,
  type Ga4Report,
} from "../../../../supabase/functions/os-plugins/adapters/ga4-normalise";

/** A GA4 report in the API's shape: values as strings, in header order. */
function report(
  dimensions: string[],
  metrics: string[],
  rows: [string[], string[]][],
  metadata?: Ga4Report["metadata"],
): Ga4Report {
  return {
    dimensionHeaders: dimensions.map((name) => ({ name })),
    metricHeaders: metrics.map((name) => ({ name, type: "TYPE_INTEGER" })),
    rows: rows.map(([dims, values]) => ({
      dimensionValues: dims.map((value) => ({ value })),
      metricValues: values.map((value) => ({ value })),
    })),
    metadata,
  };
}

// Deliberately not the order ga4DailyRequest asks for.
const SHUFFLED = [
  "keyEvents",
  "screenPageViews",
  "sessions",
  "newUsers",
  "engagedSessions",
  "totalUsers",
];

describe("parseGa4PropertyId", () => {
  it("accepts a bare id and strips a pasted properties/ prefix", () => {
    expect(parseGa4PropertyId("123456789")).toEqual({
      ok: true,
      id: "123456789",
    });
    expect(parseGa4PropertyId(" properties/123456789 ")).toEqual({
      ok: true,
      id: "123456789",
    });
  });

  it("explains a measurement ID and other non-numeric values", () => {
    const measurement = parseGa4PropertyId("G-ABC123");
    expect(measurement.ok).toBe(false);
    if (!measurement.ok) expect(measurement.message).toMatch(/measurement ID/);
    expect(parseGa4PropertyId("12a").ok).toBe(false);
  });
});

describe("GA4 requests", () => {
  it("builds the daily report over 90 complete days", () => {
    const req = ga4DailyRequest();
    expect(req.dateRanges).toEqual([
      { startDate: "90daysAgo", endDate: "yesterday" },
    ]);
    expect(req.dimensions).toEqual([{ name: "date" }]);
    expect(req.metrics.map((m) => m.name)).toEqual([
      "sessions",
      "totalUsers",
      "newUsers",
      "engagedSessions",
      "screenPageViews",
      "keyEvents",
    ]);
    expect(req.keepEmptyRows).toBe(true);
    expect(req.limit).toBe(1000);
  });

  it("builds ranged reports ending yesterday", () => {
    expect(ga4TopPagesRequest(7).dateRanges).toEqual([
      { startDate: "7daysAgo", endDate: "yesterday" },
    ]);
    expect(ga4TopPagesRequest(28).limit).toBe(15);
    expect(ga4ChannelsRequest(90).orderBys).toEqual([
      { metric: { metricName: "sessions" }, desc: true },
    ]);
    const outbound = ga4OutboundRequest(28);
    expect(outbound.dimensions).toEqual([{ name: "linkDomain" }]);
    expect(outbound.dimensionFilter).toEqual({
      filter: {
        fieldName: "eventName",
        stringFilter: { matchType: "EXACT", value: "click" },
      },
    });
    expect(outbound.limit).toBe(25);
  });

  it("addresses the property's report methods", () => {
    expect(ga4ReportUrl("42", "batchRunReports")).toBe(
      "https://analyticsdata.googleapis.com/v1beta/properties/42:batchRunReports",
    );
  });
});

describe("ga4Number and ga4Date", () => {
  it("reads GA's string numbers and treats anything else as 0", () => {
    expect(ga4Number("123")).toBe(123);
    expect(ga4Number("0.25")).toBe(0.25);
    expect(ga4Number("abc")).toBe(0);
    expect(ga4Number("Infinity")).toBe(0);
    expect(ga4Number(undefined)).toBe(0);
    expect(ga4Number(null)).toBe(0);
  });

  it("converts YYYYMMDD and rejects impossible dates", () => {
    expect(ga4Date("20261008")).toBe("2026-10-08");
    expect(ga4Date("20240229")).toBe("2024-02-29");
    expect(ga4Date("20230229")).toBeNull();
    expect(ga4Date("20261332")).toBeNull();
    expect(ga4Date("(other)")).toBeNull();
  });
});

describe("parseGa4Daily", () => {
  const daily = parseGa4Daily(
    report(["date"], SHUFFLED, [
      [["20261008"], ["2", "50", "20", "5", "10", "15"]],
      [["20261005"], ["1", "40", "abc", "4", "8", "12"]],
    ]),
    "123",
  );

  it("maps metrics by header name, not position", () => {
    expect(daily.days[daily.days.length - 1]).toEqual({
      date: "2026-10-08",
      sessions: 20,
      users: 15,
      new_users: 5,
      engaged_sessions: 10,
      page_views: 50,
      key_events: 2,
    });
  });

  it("sorts oldest first and zero-fills days missing between first and last", () => {
    expect(daily.property_id).toBe("123");
    expect(daily.days.map((d) => d.date)).toEqual([
      "2026-10-05",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
    ]);
    expect(daily.days[1]).toEqual({
      date: "2026-10-06",
      sessions: 0,
      users: 0,
      new_users: 0,
      engaged_sessions: 0,
      page_views: 0,
      key_events: 0,
    });
  });

  it("reads a non-numeric metric value as 0", () => {
    expect(daily.days[0].sessions).toBe(0);
    expect(daily.days[0].users).toBe(12);
  });

  it("returns no days for an empty report", () => {
    expect(parseGa4Daily({}, "1").days).toEqual([]);
  });

  it("fills every requested day, so an outage reads as zero visits", () => {
    const out = parseGa4Daily(
      report(["date"], SHUFFLED, [
        [["20261002"], ["1", "40", "20", "4", "8", "12"]],
      ]),
      "1",
      { from: "2026-10-01", to: "2026-10-08" },
    );
    expect(out.days.map((d) => d.date)).toEqual([
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
      "2026-10-04",
      "2026-10-05",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
    ]);
    expect(out.days[7].sessions).toBe(0);
    expect(out.days[1].sessions).toBeGreaterThan(0);
  });

  it("works out the requested days in the property's time zone", () => {
    const now = new Date("2026-10-09T23:30:00Z");
    expect(ga4RequestedDays({}, now)).toEqual({
      from: "2026-07-12",
      to: "2026-10-09",
    });
    expect(
      ga4RequestedDays({ metadata: { timeZone: "America/New_York" } }, now),
    ).toEqual({ from: "2026-07-11", to: "2026-10-08" });
    expect(
      ga4RequestedDays({ metadata: { timeZone: "Not/AZone" } }, now).to,
    ).toBe("2026-10-09");
  });

  it("refuses a report that leaves out a requested metric", () => {
    expect(() =>
      parseGa4Daily(
        report(["date"], ["sessions"], [[["20261008"], ["1"]]]),
        "1",
      ),
    ).toThrow(/totalUsers/);
  });
});

describe("ranged GA4 parsers", () => {
  it("parses top pages with the most viewed first", () => {
    const pages = parseGa4TopPages(
      report(
        ["pagePath"],
        ["sessions", "screenPageViews"],
        [
          [["/compare"], ["5", "10"]],
          [["/"], ["20", "30"]],
        ],
      ),
    );
    expect(pages).toEqual([
      { path: "/", views: 30, sessions: 20 },
      { path: "/compare", views: 10, sessions: 5 },
    ]);
  });

  it("parses channels", () => {
    expect(
      parseGa4Channels(
        report(
          ["sessionDefaultChannelGroup"],
          ["keyEvents", "sessions"],
          [[["Organic Search"], ["3", "90"]]],
        ),
      ),
    ).toEqual([{ channel: "Organic Search", sessions: 90, key_events: 3 }]);
  });

  it("keeps only outbound clicks that have a link domain", () => {
    expect(
      parseGa4Outbound(
        report(
          ["linkDomain"],
          ["eventCount"],
          [
            [["(not set)"], ["9"]],
            [["medichecks.com"], ["3"]],
            [[""], ["2"]],
            [["randoxhealth.com"], ["7"]],
          ],
        ),
      ),
    ).toEqual([
      { domain: "randoxhealth.com", clicks: 7 },
      { domain: "medichecks.com", clicks: 3 },
    ]);
  });

  it("keys ranged values as 7, 28 and 90", () => {
    expect(toRanged(["a", "b", "c"])).toEqual({
      "7": "a",
      "28": "b",
      "90": "c",
    });
    expect(() => toRanged(["a"])).toThrow();
  });

  it("stores an unavailable outbound report with empty ranges", () => {
    expect(unavailableOutbound()).toEqual({
      available: false,
      ranges: { "7": [], "28": [], "90": [] },
    });
  });
});

describe("parseGa4Batch and ga4MetricTotal", () => {
  it("checks the number of reports returned", () => {
    expect(parseGa4Batch({ reports: [{}, {}] }, 2)).toHaveLength(2);
    expect(() => parseGa4Batch({ reports: [{}] }, 2)).toThrow(
      /1 reports where 2/,
    );
    expect(() => parseGa4Batch(null, 1)).toThrow();
  });

  it("totals one metric, reading no rows as 0", () => {
    expect(
      ga4MetricTotal(report([], ["sessions"], [[[], ["321"]]]), "sessions"),
    ).toBe(321);
    expect(
      ga4MetricTotal({ metricHeaders: [{ name: "sessions" }] }, "sessions"),
    ).toBe(0);
  });
});

describe("GA4 report notes", () => {
  it("names the reports GA4 thresholded, sampled or rolled into (other)", () => {
    const notes = ga4ReportNotes([
      { label: "daily", report: { metadata: { subjectToThresholding: true } } },
      {
        label: "top pages (90 days)",
        report: {
          metadata: { dataLossFromOtherRow: true, samplingMetadatas: [{}] },
        },
      },
      { label: "channels (7 days)", report: {} },
    ]);
    expect(notes).toHaveLength(3);
    expect(notes[0]).toMatch(/\(other\).*top pages \(90 days\)/);
    expect(notes[1]).toMatch(/thresholding.*daily/);
    expect(notes[2]).toMatch(/sample.*top pages \(90 days\)/);
  });

  it("flags a property that does not count UK days", () => {
    expect(
      ga4TimeZoneNote({ metadata: { timeZone: "Europe/London" } }),
    ).toBeNull();
    expect(ga4TimeZoneNote({})).toBeNull();
    expect(
      ga4TimeZoneNote({ metadata: { timeZone: "America/Los_Angeles" } }),
    ).toMatch(/America\/Los_Angeles/);
  });
});
